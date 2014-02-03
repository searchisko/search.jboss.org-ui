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
goog.provide('org.jboss.search.context.RequestParams.Order');

goog.require('goog.date.DateTime');

/**
 *
 * @param {string} query_string
 * @param {number=} opt_page
 * @param {goog.date.DateTime=} opt_from
 * @param {goog.date.DateTime=} opt_to
 * @param {?org.jboss.search.context.RequestParams.Order=} opt_order
 * @param {string=} opt_log
 * @param {boolean=} opt_resetCaches
 * @constructor
 */
org.jboss.search.context.RequestParams = function(query_string, opt_page, opt_from, opt_to, opt_order, opt_log, opt_resetCaches) {

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
     * @type {?org.jboss.search.context.RequestParams.Order|undefined}
     * @private
     */
    this.order_ = opt_order;

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
 * defined then it is setup as a new value in the new RequestParams instance. This means <code>null</code> values are
 * allowed and can be used to wipe out original values.
 *
 * TODO: Rename to cloneAndOverride (that is what it does)
 * TODO: use defs instead of list of parameters
 * TODO: it is very hard to use this method correctly, reimplement it!
 *
 * @param {!org.jboss.search.context.RequestParams} requestParams
 * @param {string=} opt_query_string
 * @param {number=} opt_page
 * @param {goog.date.DateTime=} opt_from
 * @param {goog.date.DateTime=} opt_to
 * @param {?org.jboss.search.context.RequestParams.Order=} opt_order
 * @param {string=} opt_log
 * @param {boolean=} opt_resetCaches
 * @return {!org.jboss.search.context.RequestParams}
 */
org.jboss.search.context.RequestParams.prototype.mixin = function(requestParams, opt_query_string, opt_page, opt_from, opt_to, opt_order, opt_log, opt_resetCaches) {

    var query_ = requestParams.getQueryString();
    var page_ = requestParams.getPage();
    var from_ = requestParams.getFrom();
    var to_ = requestParams.getTo();
    var order_ = requestParams.getOrder();
    var log_ = requestParams.getLog();
    var resetCaches_ = requestParams.getResetCaches();

    if (goog.isDefAndNotNull(opt_query_string)) { query_ = opt_query_string }
    if (goog.isDef(opt_page)) { page_ = opt_page }
    if (goog.isDef(opt_from)) { from_ = opt_from }
    if (goog.isDef(opt_to)) { to_ = opt_to }
    if (goog.isDef(opt_order)) { order_ = opt_order }
    if (goog.isDef(opt_log)) { log_ = opt_log }
    if (goog.isDef(opt_resetCaches)) { resetCaches_ = opt_resetCaches }

    return new org.jboss.search.context.RequestParams(
        query_, page_, from_, to_, order_, log_, resetCaches_
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
 * @returns {?org.jboss.search.context.RequestParams.Order|undefined}
 */
org.jboss.search.context.RequestParams.prototype.getOrder = function() {
    return this.order_;
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

/**
 * Available values of the 'order' URL request parameter.
 * They must match values of HTML select option elements.
 * @enum {string}
 */
org.jboss.search.context.RequestParams.Order = {
    SCORE : "score",
    NEW_FIRST : "new_first",
    OLD_FIRST : "old_first"
};