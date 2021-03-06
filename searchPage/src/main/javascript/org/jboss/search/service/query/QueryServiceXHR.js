/*
 * JBoss, Home of Professional Open Source
 * Copyright 2012 Red Hat Inc. and/or its affiliates and other contributors
 * as indicated by the @authors tag. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Implementation of QueryService that is using XHR manager. This class is expected to be used
 * in production code. One fundamental aspect of this service is that client can rely on the fact that only a single
 * request of given "type" can run at a time. For example if a new userQuery request is about to be fired then it makes
 * sure that any existing (prior) requests are aborted first (and of course relevant events are dispatched according
 * to this).
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.service.query.QueryServiceXHR');

goog.require('goog.Disposable');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.array.ArrayLike');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.XhrManager');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.object');
goog.require('goog.string');
goog.require('org.jboss.core.Constants');
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.service.query.QueryService');
goog.require('org.jboss.core.service.query.QueryServiceDispatcher');
goog.require('org.jboss.core.util.urlGenerator');
goog.require('org.jboss.search.Constants');
goog.require('org.jboss.search.Variables');
goog.require('org.jboss.search.response');



/**
 * Create a new instance.
 *
 * @param {!org.jboss.core.service.query.QueryServiceDispatcher} dispatcher
 * @constructor
 * @implements {org.jboss.core.service.query.QueryService}
 * @extends {goog.Disposable}
 */
org.jboss.search.service.query.QueryServiceXHR = function(dispatcher) {
  goog.Disposable.call(this);

  /**
   * @type {!org.jboss.core.service.query.QueryServiceDispatcher}
   * @private
   */
  this.dispatcher_ = dispatcher;

  /**
   * @type {!goog.Uri}
   * @private
   */
  this.searchURI_ = goog.Uri.parse(org.jboss.search.Constants.API_URL_SEARCH_QUERY);

  /**
   * @type {!goog.Uri}
   * @private
   */
  this.searchSuggestionsURI_ = goog.Uri.parse(org.jboss.search.Constants.API_URL_SUGGESTIONS_QUERY);
};
goog.inherits(org.jboss.search.service.query.QueryServiceXHR, goog.Disposable);


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceXHR.prototype.disposeInternal = function() {
  org.jboss.search.service.query.QueryServiceXHR.superClass_.disposeInternal.call(this);

  delete this.dispatcher_;
  delete this.searchURI_;
  delete this.searchSuggestionsURI_;
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceXHR.prototype.userQuery = function(requestParams) {

  this.abortUserQuery();

  var searchURI_ = this.searchURI_.clone();
  var query_url_string_ = org.jboss.core.util.urlGenerator.searchUrl(searchURI_, requestParams,
      org.jboss.search.Variables.SEARCH_RESULTS_PER_PAGE);

  if (!goog.isNull(query_url_string_)) {
    this.dispatcher_.dispatchUserQueryStart(requestParams, query_url_string_);
    this.getXHRManager_().send(
        org.jboss.search.Constants.SEARCH_QUERY_REQUEST_ID,
        // setting the parameter value clears previously set value (that is what we want!)
        query_url_string_,
        org.jboss.core.Constants.GET,
        '', // post_data
        {}, // headers_map
        org.jboss.search.Constants.SEARCH_QUERY_REQUEST_PRIORITY,
        // callback, The only param is the event object from the COMPLETE event.
        goog.bind(function(e) {
          this.dispatcher_.dispatchUserQueryFinished();
          var event = /** @type {goog.net.XhrManager.Event} */ (e);
          if (event.target.isSuccess()) {
            try {
              var response = event.target.getResponseJson();
              var normalizedResponse = org.jboss.search.response.normalizeSearchResponse(response, requestParams);

              // we must make sure this is set to lookup before the success event is dispatched (see #80)
              org.jboss.core.service.Locator.getInstance().getLookup().setRequestParams(requestParams);
              org.jboss.core.service.Locator.getInstance().getLookup().setRecentQueryResultData(normalizedResponse);

              var eventData = /** @type {org.jboss.core.response.SearchResults} */ ({
                query: requestParams,
                response: normalizedResponse
              });
              this.dispatcher_.dispatchUserQuerySucceeded(eventData);
            } catch (err) {
              this.dispatcher_.dispatchUserQueryError(requestParams.getQueryString(), err);
            }
          } else {
            // We failed getting search results data
            // console.log('error code >', event.target.getLastErrorCode());
            // console.log('error message >', goog.net.ErrorCode.getDebugMessage(event.target.getLastErrorCode()));
            this.dispatcher_.dispatchUserQueryError(requestParams.getQueryString(), event.target.getLastError());
          }
        }, this)
    );
  }
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceXHR.prototype.isUserQueryRunning = function() {
  var ids = this.getXHRManager_().getOutstandingRequestIds();
  return goog.array.contains(ids, org.jboss.search.Constants.SEARCH_QUERY_REQUEST_ID);
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceXHR.prototype.abortUserQuery = function() {
  if (this.isUserQueryRunning()) {
    this.getXHRManager_().abort(org.jboss.search.Constants.SEARCH_QUERY_REQUEST_ID, true);
    this.dispatcher_.dispatchUserQueryAbort();
  }
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceXHR.prototype.userSuggestionQuery = function(query) {

  var ids = this.getXHRManager_().getOutstandingRequestIds();
  if (goog.array.contains(ids, org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_ID)) {
    this.getXHRManager_().abort(org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_ID, true);
    // this.dispatcher_.dispatchUserSuggestionsQueryAbort();
  }

  if (!goog.isDefAndNotNull(query) || goog.string.isEmptySafe(query)) {
    // TODO: for now this is used as a workaround to enable suggestions hiding when query is empty
    this.dispatcher_.dispatchUserSuggestionsQueryAbort();
  }

  if (goog.isDefAndNotNull(query) && !goog.string.isEmptySafe(query)) {
    var searchSuggestionsURI_ = this.searchSuggestionsURI_.clone();
    var query_url_string_ = searchSuggestionsURI_.setParameterValue('q', query).toString();

    this.dispatcher_.dispatchUserSuggestionsQueryStart(query, query_url_string_);
    this.getXHRManager_().send(
        org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_ID,
        // setting the parameter value clears previously set value (that is what we want!)
        query_url_string_,
        org.jboss.core.Constants.GET,
        '', // post_data
        {}, // headers_map
        org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_PRIORITY,
        // callback, The only param is the event object from the COMPLETE event.
        goog.bind(function(e) {
          this.dispatcher_.dispatchUserSuggestionsQueryFinished();
          var event = /** @type {goog.net.XhrManager.Event} */ (e);
          if (event.target.isSuccess()) {
            try {
              var response = event.target.getResponseJson();
              // We are taking the response from the mock server for now,
              // just replace the token with an actual query string.
              response['view']['search']['options'] = [query];
              response['model']['search']['search']['query'] = query;

              // var model = /** @type {!Object} */ (goog.object.get(response, "model", {}));
              // thiz_.query_suggestions_model = thiz_.parseQuerySuggestionsModel_(model);
              //
              // if (goog.object.containsKey(response, "view")) {
              //    var view = /** @type {!Object} */ (goog.object.get(response, "view", {}));
              //
              //    thiz_.query_suggestions_view_.update(view);
              //    thiz_.query_suggestions_view_.show();
              //
              //} else {
              //    thiz_.hideAndCleanSuggestionsElementAndModel_();
              // }

              this.dispatcher_.dispatchUserSuggestionsQuerySucceeded(response);
            } catch (err) {
              // catch the error so the UI is not broken, ignore fixing for now...
            }
          } else {
            // We failed getting query suggestions
            // thiz_.hideAndCleanSuggestionsElementAndModel_();
            // console.log('error code >', event.target.getLastErrorCode());
            // console.log('error message >', goog.net.ErrorCode.getDebugMessage(event.target.getLastErrorCode()));
            this.dispatcher_.dispatchUserSuggestionsQueryError(query, event.target.getLastError());
          }

        }, this)
    );

  }
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceXHR.prototype.projectNameSuggestions = function(query) {

  this.abortProjectNameSuggestions();

  if (goog.isDefAndNotNull(query) && !goog.string.isEmptySafe(query)) {
    var query_url_string = org.jboss.core.util.urlGenerator.projectNameSuggestionsUrl(
        goog.Uri.parse(org.jboss.search.Constants.API_URL_SUGGESTIONS_PROJECT).clone(), query, 30
        );

    if (query_url_string != null) {
      this.dispatcher_.dispatchProjectNameSuggestionsQueryStart(query, query_url_string);
      this.getXHRManager_().send(
          org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_ID,
          query_url_string,
          org.jboss.core.Constants.GET,
          '', // post_data
          {}, // headers_map
          org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_PRIORITY,
          goog.bind(function(e) {
            this.dispatcher_.dispatchProjectNameSuggestionsQueryFinished();
            var event = /** @type {goog.net.XhrManager.Event} */ (e);
            if (event.target.isSuccess()) {
              try {
                var response = event.target.getResponseJson();
                if (goog.isDef(response)) {
                  // TODO: this is ugly code and not safe at all
                  // ------
                  var ngrams = /** @type {goog.array.ArrayLike} */ (goog.object.getValueByKeys(response['responses'][0],
                      'hits', 'hits'));
                  var fuzzy = /** @type {goog.array.ArrayLike} */ (goog.object.getValueByKeys(response['responses'][1],
                      'hits', 'hits'));
                  // ------
                  this.dispatcher_.dispatchProjectNameSuggestionsQuerySucceeded(
                      org.jboss.search.response.normalizeProjectSuggestionsResponse(query, ngrams, fuzzy)
                  );
                } else {
                  // malformed response?
                  this.dispatcher_.dispatchProjectNameSuggestionsQueryError(query, {});
                }
              } catch (err) {
                // malformed response?
                this.dispatcher_.dispatchProjectNameSuggestionsQueryError(query, {});
              }
            } else {
              // Project info failed to load.
              // TODO: provide error details
              // console.log('error code >', event.target.getLastErrorCode());
              // console.log('error message >', goog.net.ErrorCode.getDebugMessage(event.target.getLastErrorCode()));
              this.dispatcher_.dispatchProjectNameSuggestionsQueryError(query, {});
            }
          }, this)
      );
    }
  } else {
    this.dispatcher_.dispatchProjectNameSuggestionsQuerySucceeded(
        org.jboss.search.response.normalizeProjectSuggestionsResponse(query, [], [])
    );
  }

};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceXHR.prototype.isProjectNameSuggestionsRunning = function() {
  var ids = this.getXHRManager_().getOutstandingRequestIds();
  return goog.array.contains(ids, org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_ID);
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceXHR.prototype.abortProjectNameSuggestions = function() {
  if (this.isProjectNameSuggestionsRunning()) {
    this.getXHRManager_().abort(org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_ID, true);
    this.dispatcher_.dispatchProjectNameSuggestionsQueryAbort();
  }
};


/**
 * @return {!goog.net.XhrManager}
 * @private
 */
org.jboss.search.service.query.QueryServiceXHR.prototype.getXHRManager_ = function() {
  return org.jboss.core.service.Locator.getInstance().getLookup().getXhrManager();
};
