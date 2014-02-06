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
 * @fileoverview {@link RequestParams} object represents client request parameters.
 *
 * The idea is to have a reference of these values in case we need to (re)send a new query with small
 * parameter changes. For example, user changes date filter (selects a new interval) then we need
 * to send a new request and we need to get the most recent values of previous request parameters.
 * <p/>
 * There is convenient factory method {@link RequestParamsFactory} that is used to create a new instances.
 * <p/>
 * There is utility class {@link org.jboss.core.util.fragmentParser} that can parse URL fragment and create
 * new RequestParams entity based on values found in it.
 *
 * @see RequestParamsFactory
 * @see fragmentParser
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.core.context.RequestParams');
goog.provide('org.jboss.core.context.RequestParams.Order');
goog.provide('org.jboss.core.context.RequestParamsFactory');

goog.require('goog.date.DateTime');

/**
 * Request parameters. Do not create instances directly, use {@link RequestParamsFactory} instead.
 *
 * @param {string} query_string
 * @param {?number} page
 * @param {?goog.date.DateTime} from
 * @param {?goog.date.DateTime} to
 * @param {org.jboss.core.context.RequestParams.Order} order
 * @param {?Array.<string>} contributors
 * @param {?string} log
 * @param {?boolean} resetCaches
 * @constructor
 * @private
 */
org.jboss.core.context.RequestParams = function(query_string, page, from, to, order, contributors, log, resetCaches) {

    /**
     * @type {string}
     * @private
     */
    this.query_string_ = query_string;

    /**
     * @type {number|null}
     * @private
     */
    this.page_ = page;

    /**
     * @type {goog.date.DateTime|null}
     * @private
     */
    this.from_ = from;

    /**
     * @type {goog.date.DateTime|null}
     * @private
     */
    this.to_ = to;

    /**
     * @type {org.jboss.core.context.RequestParams.Order}
     * @private
     */
    this.order_ = order;

	/**
	 * @type {?Array.<string>}
	 * @private
	 */
	this.contributors_ = contributors;

    /**
     * @type {string|null}
     * @private
     */
    this.log_ = log;

    /**
     * @type {boolean|null}
     * @private
     */
    this.resetCaches_ = resetCaches;
};

/**
 * @return {string}
 */
org.jboss.core.context.RequestParams.prototype.getQueryString = function() {
	return this.query_string_;
};

/**
 * @return {number|null}
 */
org.jboss.core.context.RequestParams.prototype.getPage = function() {
	return this.page_;
};

/**
 * @return {goog.date.DateTime|null}
 */
org.jboss.core.context.RequestParams.prototype.getFrom = function() {
	return (this.from_ instanceof Date) ? new goog.date.DateTime(this.from_) : this.from_;
};

/**
 * @return {goog.date.DateTime|null}
 */
org.jboss.core.context.RequestParams.prototype.getTo = function() {
	return (this.to_ instanceof Date) ? new goog.date.DateTime(this.to_) : this.to_;
};

/**
 * @return {org.jboss.core.context.RequestParams.Order}
 */
org.jboss.core.context.RequestParams.prototype.getOrder = function() {
	return this.order_;
};

/**
 * @return {Array.<string>|null}
 */
org.jboss.core.context.RequestParams.prototype.getContributors = function() {
	return this.contributors_;
};

/**
 * @return {string|null}
 */
org.jboss.core.context.RequestParams.prototype.getLog = function() {
	return this.log_;
};

/**
 * @return {boolean|null}
 */
org.jboss.core.context.RequestParams.prototype.getResetCaches = function() {
	return this.resetCaches_;
};


/**
 * Available values of the 'order' URL request parameter.
 * They must match values of HTML select option elements.
 * @enum {string}
 */
org.jboss.core.context.RequestParams.Order = {
	SCORE : "score",
	NEW_FIRST : "new_first",
	OLD_FIRST : "old_first"
};


/**
 * Factory that provides fluent API for creating {@link RequestParams} instances.
 * This factory is global singleton, use {@code getInstance} method to get instance of it.
 * <p/>
 * Example of usage:
 * <code>
 *     var requestParams1 = org.jboss.core.context.RequestParamsFactory.getInstance().reset().setQueryString("Hello").setPage(2).build();
 *     // use can use existing RequestParams instance to generate a new instance with slightly update values:
 *     requestParams2 = org.jboss.core.context.RequestParamsFactory.getInstance().reset().copy(requestParams1).setPage(null).build();
 * </code>
 *
 * @constructor
 */
org.jboss.core.context.RequestParamsFactory = function() {

	/**
	 * @type {string}
	 * @private
	 */
	this.query_string_;

	/**
	 * @type {number|null}
	 * @private
	 */
	this.page_;

	/**
	 * @type {goog.date.DateTime|null}
	 * @private
	 */
	this.from_;

	/**
	 * @type {goog.date.DateTime|null}
	 * @private
	 */
	this.to_;

	/**
	 * @type {org.jboss.core.context.RequestParams.Order}
	 * @private
	 */
	this.order_;

	/**
	 * @type {Array.<string>|null}
	 * @private
	 */
	this.contributors_;

	/**
	 * @type {string|null}
	 * @private
	 */
	this.log_;

	/**
	 * @type {boolean|null}
	 * @private
	 */
	this.resetCaches_;

	// reset internal state
	this.reset();
};
// Make this factory a global singleton. We do not expect that we would need
// to mock it so there is no need to add it into LookUp.
goog.addSingletonGetter(org.jboss.core.context.RequestParamsFactory);

/**
 *
 * @return {!org.jboss.core.context.RequestParams}
 */
org.jboss.core.context.RequestParamsFactory.prototype.build = function() {
	var rp = new org.jboss.core.context.RequestParams(
		this.query_string_, this.page_, this.from_, this.to_, this.order_,
		this.contributors_, this.log_, this.resetCaches_
	);
	this.reset();
	return rp;
};

/**
 * Reset all internal members, this is typically called before building a new {@link RequestParams}.
 *
 * @return {org.jboss.core.context.RequestParamsFactory}
 */
org.jboss.core.context.RequestParamsFactory.prototype.reset = function() {
	this.query_string_ = "";
	this.page_ = 1;
	this.from_ = null;
	this.to_ = null;
	this.order_ = org.jboss.core.context.RequestParams.Order.SCORE;
	this.contributors_ = [];
	this.log_ = null;
	this.resetCaches_ = null;
	return this;
};

/**
 * Copy all values from given RequestPrams object.  This method works like deep clone and overrides
 * all previously set values.
 * TODO: rename to clone()
 *
 * @param {!org.jboss.core.context.RequestParams} requestParams
 * @return {org.jboss.core.context.RequestParamsFactory}
 */
org.jboss.core.context.RequestParamsFactory.prototype.copy = function(requestParams) {
	this.query_string_ = requestParams.getQueryString();
	this.page_ = requestParams.getPage();
	this.from_ = requestParams.getFrom();
	this.to_ = requestParams.getTo();
	this.order_ = requestParams.getOrder();
	this.contributors_ = requestParams.getContributors();
	this.log_ = requestParams.getLog();
	this.resetCaches_ = requestParams.getResetCaches();
	return this;
};

/**
 * Set new query string value, <code>null</code> value is not allowed.
 *
 * @param {string} queryString
 * @return {org.jboss.core.context.RequestParamsFactory}
 */
org.jboss.core.context.RequestParamsFactory.prototype.setQueryString = function(queryString) {
	this.query_string_ = queryString;
	return this;
};

/**
 * Set new page value, <code>null</code> is allowed.
 *
 * @param {?number} page
 * @return {org.jboss.core.context.RequestParamsFactory}
 */
org.jboss.core.context.RequestParamsFactory.prototype.setPage = function(page) {
	this.page_ = page;
	return this;
};

/**
 * Set new from value, <code>null</code> is allowed.
 *
 * @param {?goog.date.DateTime} from
 * @return {org.jboss.core.context.RequestParamsFactory}
 */
org.jboss.core.context.RequestParamsFactory.prototype.setFrom = function(from) {
	this.from_ = from;
	return this;
};

/**
 * Set new to value, <code>null</code> is allowed.
 *
 * @param {?goog.date.DateTime} to
 * @return {org.jboss.core.context.RequestParamsFactory}
 */
org.jboss.core.context.RequestParamsFactory.prototype.setTo = function(to) {
	this.to_ = to;
	return this;
};

/**
 * Set new order value.
 *
 * @param {!org.jboss.core.context.RequestParams.Order} order
 * @return {org.jboss.core.context.RequestParamsFactory}
 */
org.jboss.core.context.RequestParamsFactory.prototype.setOrder = function(order) {
	this.order_ = order;
	return this;
};

/**
 * Set new contributors.
 *
 * @param contributors
 * @returns {org.jboss.core.context.RequestParamsFactory}
 */
org.jboss.core.context.RequestParamsFactory.prototype.setContributors = function(contributors) {
	this.contributors_ = contributors;
	return this;
};

/**
 * Set new log value, <code>null</code> is allowed.
 *
 * @param {?string} log
 * @return {org.jboss.core.context.RequestParamsFactory}
 */
org.jboss.core.context.RequestParamsFactory.prototype.setLog = function(log) {
	this.log_ = log;
	return this;
};

/**
 * Set new resetCaches value, <code>null</code> is allowed.
 *
 * @param {?boolean} resetCaches
 * @return {org.jboss.core.context.RequestParamsFactory}
 */
org.jboss.core.context.RequestParamsFactory.prototype.setResetCaches = function(resetCaches) {
	this.resetCaches_ = resetCaches;
	return this;
};