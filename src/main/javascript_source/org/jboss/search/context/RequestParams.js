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
 * @fileoverview Object is used to hold request parameters.
 *
 * The idea is to have a reference of these values in case we need to send a new query with small
 * parameter changes. For example, user changes date filter (selects a new interval) then we need
 * to send a new request (via QueryService) and we need to get the latest values of the rest of the
 * parameters.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.context.RequestParams');

goog.require('goog.date.DateTime');

/**
 *
 * @param {string} query_string
 * @param {number=} opt_page
 * @param {goog.date.DateTime=} opt_from
 * @param {goog.date.DateTime=} opt_to
 * @param {string=} opt_log
 * @param {boolean=} opt_resetCaches
 * @constructor
 */
org.jboss.search.context.RequestParams = function(query_string, opt_page, opt_from, opt_to, opt_log, opt_resetCaches) {

    /**
     * @type {string}
     * @private
     */
    this.query_string_ = query_string;

    /**
     * @type {number|undefined}
     * @private
     */
    this.page_ = opt_page;

    /**
     * @type {goog.date.DateTime|undefined}
     * @private
     */
    this.from_ = opt_from;

    /**
     * @type {goog.date.DateTime|undefined}
     * @private
     */
    this.to_ = opt_to;

    /**
     * @type {string|undefined}
     * @private
     */
    this.log_ = opt_log;

    /**
     * @type {boolean|undefined}
     * @private
     */
    this.resetCaches_ = opt_resetCaches;
};

/**
 * Return a new instance of RequestParams based on provided requestParams instance and if any of other parameters is
 * defined and not null then it is setup as a new value in the new RequestParams instance.
 *
 * TODO: Rename to cloneAndOverride (that is what it does)
 *
 * @param {!org.jboss.search.context.RequestParams} requestParams
 * @param {string=} opt_query_string
 * @param {number=} opt_page
 * @param {goog.date.DateTime=} opt_from
 * @param {goog.date.DateTime=} opt_to
 * @param {string=} opt_log
 * @param {boolean=} opt_resetCaches
 * @return {!org.jboss.search.context.RequestParams}
 */
org.jboss.search.context.RequestParams.prototype.mixin = function(requestParams, opt_query_string, opt_page, opt_from, opt_to, opt_log, opt_resetCaches) {

    var query_ = requestParams.getQueryString();
    var page_ = requestParams.getPage();
    var from_ = requestParams.getFrom();
    var to_ = requestParams.getTo();
    var log_ = requestParams.getLog();
    var resetCaches_ = requestParams.getResetCaches();

    if (goog.isDefAndNotNull(opt_query_string)) { query_ = opt_query_string }
    if (goog.isDefAndNotNull(opt_page)) { page_ = opt_page }
    if (goog.isDefAndNotNull(opt_from)) { from_ = opt_from }
    if (goog.isDefAndNotNull(opt_to)) { to_ = opt_to }
    if (goog.isDefAndNotNull(opt_log)) { log_ = opt_log }
    if (goog.isDefAndNotNull(opt_resetCaches)) { resetCaches_ = opt_resetCaches }

    return new org.jboss.search.context.RequestParams(
        query_, page_, from_, to_, log_, resetCaches_
    );
};

/**
 * @return {string}
 */
org.jboss.search.context.RequestParams.prototype.getQueryString = function() {
    return this.query_string_;
};

/**
 * @return {number|undefined}
 */
org.jboss.search.context.RequestParams.prototype.getPage = function() {
    return this.page_;
};

/**
 * @return {goog.date.DateTime|undefined}
 */
org.jboss.search.context.RequestParams.prototype.getFrom = function() {
    return (this.from_ instanceof Date) ? new goog.date.DateTime(this.from_) : this.from_;
};

/**
 * @return {goog.date.DateTime|undefined}
 */
org.jboss.search.context.RequestParams.prototype.getTo = function() {
    return (this.to_ instanceof Date) ? new goog.date.DateTime(this.to_) : this.to_;
};

/**
 * @return {string|undefined}
 */
org.jboss.search.context.RequestParams.prototype.getLog = function() {
    return this.log_;
};

/**
 * @returns {boolean|undefined}
 */
org.jboss.search.context.RequestParams.prototype.getResetCaches = function() {
    return this.resetCaches_;
};