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
 * @fileoverview
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.service.QueryServiceImpl');

goog.require('org.jboss.search.response');
goog.require('org.jboss.search.util.urlGenerator');
goog.require('org.jboss.search.LookUp');
goog.require('org.jboss.search.Constants');
goog.require('goog.Uri');

/**
 *
 * @param {!org.jboss.search.service.QueryServiceDispatcher} dispatcher
 * @constructor
 * @implements {org.jboss.search.service.QueryService}
 * @extends {goog.Disposable}
 */
org.jboss.search.service.QueryServiceImpl = function(dispatcher) {

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
};
goog.inherits(org.jboss.search.service.QueryServiceImpl, goog.Disposable);

/** @inheritDoc */
org.jboss.search.service.QueryServiceImpl.prototype.disposeInternal = function() {
    // Call the superclass's disposeInternal() method.
    org.jboss.search.service.QueryServiceImpl.superClass_.disposeInternal.call(this);

    delete this.dispatcher_;
    delete this.searchURI_;
};

/**
 * @override
 */
org.jboss.search.service.QueryServiceImpl.prototype.userQuery = function(query_string, opt_page, opt_log) {

    this.getXHRManager_().abort(org.jboss.search.Constants.SEARCH_QUERY_REQUEST_ID, true);
    this.dispatcher_.dispatchUserQueryAbort();

    var searchURI_ = this.searchURI_.clone();
//    var query_string_ = query_string;
//    var opt_page_ = opt_page;
    var query_url_string_ = org.jboss.search.util.urlGenerator.searchUrl(searchURI_, query_string, undefined, undefined, opt_page);

    if (!goog.isNull(query_url_string_)) {
        this.dispatcher_.dispatchUserQueryStart(query_string, query_url_string_);
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
                var event = /** @type goog.net.XhrManager.Event */ (e);
                if (event.target.isSuccess()) {
                    try {
                        var response = event.target.getResponseJson();
                        var normalizedResponse = org.jboss.search.response.normalizeSearchResponse(
                            response, query_string, opt_page, opt_log
                        );
                        this.dispatcher_.dispatchUserQuerySucceeded(normalizedResponse);
                    } catch (err) {
                        // catch the error so the UI is not broken, ignore fixing for now...
                    }
                } else {
                    // We failed getting search results data
                    this.dispatcher_.dispatchUserQueryError(query_string, event.target.getLastError());
                }
            }, this)
        );
    }

};

/**
 * @return {!goog.net.XhrManager}
 * @private
 */
org.jboss.search.service.QueryServiceImpl.prototype.getXHRManager_ = function() {
    return org.jboss.search.LookUp.getInstance().getXhrManager();
};