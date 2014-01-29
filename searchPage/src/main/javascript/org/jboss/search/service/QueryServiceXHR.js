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
 * @fileoverview Implementation of QueryService that is using XHR manager. This class is expected to be used in production code.
 * One fundamental aspect of this service is that client can rely on the fact that only a single request of given "type" can run
 * at a time. For example if a new userQuery request is about to be fired then it makes sure that any existing (prior) requests
 * are aborted first (and of course relevant events are dispatched according to this).
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.service.QueryServiceXHR');

goog.require('org.jboss.search.response');
goog.require('org.jboss.search.util.urlGenerator');
goog.require('org.jboss.search.context.RequestParams');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.search.Constants');
goog.require('org.jboss.search.service.QueryService');
goog.require('org.jboss.search.service.QueryServiceDispatcher');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.net.XhrManager');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.string');
goog.require('goog.Disposable');

/**
 * Create a new instance.
 * @param {!org.jboss.search.service.QueryServiceDispatcher} dispatcher
 * @constructor
 * @implements {org.jboss.search.service.QueryService}
 * @extends {goog.Disposable}
 */
org.jboss.search.service.QueryServiceXHR = function(dispatcher) {

    goog.Disposable.call(this);

    /**
     * @type {!org.jboss.search.service.QueryServiceDispatcher}
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
goog.inherits(org.jboss.search.service.QueryServiceXHR, goog.Disposable);

/** @inheritDoc */
org.jboss.search.service.QueryServiceXHR.prototype.disposeInternal = function() {
    // Call the superclass's disposeInternal() method.
    org.jboss.search.service.QueryServiceXHR.superClass_.disposeInternal.call(this);

    delete this.dispatcher_;
    delete this.searchURI_;
    delete this.searchSuggestionsURI_;
};

/** @override */
org.jboss.search.service.QueryServiceXHR.prototype.userQuery = function(requestParams) {

	var ids = this.getXHRManager_().getOutstandingRequestIds();
	if (goog.array.contains(ids, org.jboss.search.Constants.SEARCH_QUERY_REQUEST_ID)) {
		this.getXHRManager_().abort(org.jboss.search.Constants.SEARCH_QUERY_REQUEST_ID, true);
		this.dispatcher_.dispatchUserQueryAbort();
	}

    var searchURI_ = this.searchURI_.clone();
    var query_url_string_ = org.jboss.search.util.urlGenerator.searchUrl(searchURI_, requestParams);

    if (!goog.isNull(query_url_string_)) {
        this.dispatcher_.dispatchUserQueryStart(requestParams, query_url_string_);
        this.getXHRManager_().send(
            org.jboss.search.Constants.SEARCH_QUERY_REQUEST_ID,
            // setting the parameter value clears previously set value (that is what we want!)
            query_url_string_,
            org.jboss.search.Constants.GET,
            "", // post_data
            {}, // headers_map
            org.jboss.search.Constants.SEARCH_QUERY_REQUEST_PRIORITY,
            // callback, The only param is the event object from the COMPLETE event.
            goog.bind(function(e) {
                this.dispatcher_.dispatchUserQueryFinished();
                var event = /** @type {goog.net.XhrManager.Event} */ (e);
                if (event.target.isSuccess()) {
                    try {
                        this.dispatcher_.dispatchNewRequestParameters(requestParams);
                        var response = event.target.getResponseJson();
                        var normalizedResponse = org.jboss.search.response.normalizeSearchResponse(response, requestParams);
                        this.dispatcher_.dispatchUserQuerySucceeded(normalizedResponse);
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

/** @override */
org.jboss.search.service.QueryServiceXHR.prototype.userSuggestionQuery = function(query_string) {

	var ids = this.getXHRManager_().getOutstandingRequestIds();
	if (goog.array.contains(ids, org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_ID)) {
		this.getXHRManager_().abort(org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_ID, true);
//	    this.dispatcher_.dispatchUserSuggestionsQueryAbort();
	}

    if (!goog.isDefAndNotNull(query_string) || goog.string.isEmptySafe(query_string)) {
        // TODO: for now this is used as a workaround to enable suggestions hiding when query is empty
        this.dispatcher_.dispatchUserSuggestionsQueryAbort();
    }

    if (goog.isDefAndNotNull(query_string) && !goog.string.isEmptySafe(query_string)) {
        var searchSuggestionsURI_ = this.searchSuggestionsURI_.clone();
        var query_url_string_ = searchSuggestionsURI_.setParameterValue("q",query_string).toString();

        this.dispatcher_.dispatchUserSuggestionsQueryStart(query_string, query_url_string_);
        this.getXHRManager_().send(
            org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_ID,
            // setting the parameter value clears previously set value (that is what we want!)
            query_url_string_,
            org.jboss.search.Constants.GET,
            "", // post_data
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
                        response['view']['search']['options'] = [query_string];
                        response['model']['search']['search']['query'] = query_string;

//                        var model = /** @type {!Object} */ (goog.object.get(response, "model", {}));
//                        thiz_.query_suggestions_model = thiz_.parseQuerySuggestionsModel_(model);
//
//                        if (goog.object.containsKey(response, "view")) {
//                            var view = /** @type {!Object} */ (goog.object.get(response, "view", {}));
//
//                            thiz_.query_suggestions_view_.update(view);
//                            thiz_.query_suggestions_view_.show();
//
//                        } else {
//                            thiz_.hideAndCleanSuggestionsElementAndModel_();
//                        }

                        this.dispatcher_.dispatchUserSuggestionsQuerySucceeded(response);
                    } catch (err) {
                        // catch the error so the UI is not broken, ignore fixing for now...
                    }
                } else {
                    // We failed getting query suggestions
//                    thiz_.hideAndCleanSuggestionsElementAndModel_();
                    this.dispatcher_.dispatchUserSuggestionsQueryError(query_string, event.target.getLastError());
                }

            }, this)
        );

    }
};

/**
 * @return {!goog.net.XhrManager}
 * @private
 */
org.jboss.search.service.QueryServiceXHR.prototype.getXHRManager_ = function() {
    return org.jboss.core.service.Locator.getInstance().getLookup().getXhrManager();
};