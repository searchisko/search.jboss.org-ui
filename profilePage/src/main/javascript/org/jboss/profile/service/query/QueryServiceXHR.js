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
 * sure that any existing (prior) requests are aborted first (and of course relevant events are dispatched according to
 * this).
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.profile.service.query.QueryServiceXHR');

goog.require('goog.Disposable');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.net.XhrManager');
goog.require('goog.net.XhrManager.Event');
goog.require('org.jboss.core.Constants');
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.context.RequestParams.Order');
goog.require('org.jboss.core.context.RequestParamsFactory');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.service.query.QueryService');
goog.require('org.jboss.core.service.query.QueryServiceDispatcher');
goog.require('org.jboss.core.util.urlGenerator');
goog.require('org.jboss.profile.Constants');
goog.require('org.jboss.profile.Variables');



/**
 * Create a new instance.
 *
 * @param {!org.jboss.core.service.query.QueryServiceDispatcher} dispatcher
 * @constructor
 * @implements {org.jboss.core.service.query.QueryService}
 * @extends {goog.Disposable}
 */
org.jboss.profile.service.query.QueryServiceXHR = function(dispatcher) {

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
  this.searchURI_ = goog.Uri.parse(org.jboss.profile.Constants.API_URL_SEARCH_QUERY);

};
goog.inherits(org.jboss.profile.service.query.QueryServiceXHR, goog.Disposable);


/** @inheritDoc */
org.jboss.profile.service.query.QueryServiceXHR.prototype.disposeInternal = function() {
  org.jboss.profile.service.query.QueryServiceXHR.superClass_.disposeInternal.call(this);

  delete this.dispatcher_;
  delete this.searchURI_;
  // delete this.searchSuggestionsURI_;
};


/** @inheritDoc */
org.jboss.profile.service.query.QueryServiceXHR.prototype.userQuery = function(requestParams) {

  this.abortUserQuery();

  var searchURI_ = this.searchURI_.clone();
  var query_url_string_ = org.jboss.core.util.urlGenerator.searchUrl(searchURI_, requestParams, 0,
      { fields: [], highlighting: false, size: 0});

  if (!goog.isNull(query_url_string_)) {
    this.dispatcher_.dispatchUserQueryStart(requestParams, query_url_string_);
    this.getXHRManager_().send(
        org.jboss.profile.Constants.SEARCH_QUERY_REQUEST_ID,
        // setting the parameter value clears previously set value (that is what we want!)
        query_url_string_,
        org.jboss.core.Constants.GET,
        '', // post_data
        {}, // headers_map
        org.jboss.profile.Constants.SEARCH_QUERY_REQUEST_PRIORITY,
        // callback, The only param is the event object from the COMPLETE event.
        goog.bind(function(e) {
          this.dispatcher_.dispatchUserQueryFinished();
          var event = /** @type {goog.net.XhrManager.Event} */ (e);
          if (event.target.isSuccess()) {
            try {
              var response = event.target.getResponseJson();

              // we must make sure this is set to lookup before the success event is dispatched (see #80)
              org.jboss.core.service.Locator.getInstance().getLookup().setRequestParams(requestParams);
              org.jboss.core.service.Locator.getInstance().getLookup().setRecentQueryResultData(response);

              this.dispatcher_.dispatchUserQuerySucceeded(response);
            } catch (err) {
              this.dispatcher_.dispatchUserQueryError(requestParams.getQueryString(), err);
            }
          } else {
            // We failed getting search results data
            this.dispatcher_.dispatchUserQueryError(requestParams.getQueryString(), event.target.getLastError());
          }
        }, this)
    );
  }
};


/** @inheritDoc */
org.jboss.profile.service.query.QueryServiceXHR.prototype.abortUserQuery = function() {
  if (this.isUserQueryRunning()) {
    this.getXHRManager_().abort(org.jboss.profile.Constants.SEARCH_QUERY_REQUEST_ID, true);
    this.dispatcher_.dispatchUserQueryAbort();
  }
};


/** @inheritDoc */
org.jboss.profile.service.query.QueryServiceXHR.prototype.isUserQueryRunning = function() {
  var ids = this.getXHRManager_().getOutstandingRequestIds();
  return goog.array.contains(ids, org.jboss.profile.Constants.SEARCH_QUERY_REQUEST_ID);
};


/** @inheritDoc */
org.jboss.profile.service.query.QueryServiceXHR.prototype.userSuggestionQuery = function(query) {
  // no-op
};


/** @inheritDoc */
org.jboss.profile.service.query.QueryServiceXHR.prototype.projectNameSuggestions = function() {
  // no-op
};


/** @inheritDoc */
org.jboss.profile.service.query.QueryServiceXHR.prototype.isProjectNameSuggestionsRunning = function() {
  // no-op
};


/** @inheritDoc */
org.jboss.profile.service.query.QueryServiceXHR.prototype.abortProjectNameSuggestions = function() {
  // no-op
};


/**
 * @return {!goog.net.XhrManager}
 * @private
 */
org.jboss.profile.service.query.QueryServiceXHR.prototype.getXHRManager_ = function() {
  return org.jboss.core.service.Locator.getInstance().getLookup().getXhrManager();
};
