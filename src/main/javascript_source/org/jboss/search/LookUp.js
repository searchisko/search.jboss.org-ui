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
 * @fileoverview This object is a container of other objects that are shared through the application lifecycle.
 * We do not want to pass those objects as parameters. So for now we are using this trivial implementation.
 * Be careful about what you put into LookUp (possible memory leaks!).
 *
 * Going forward we might consider using more robust service locator. For example it might be worth looking at
 * {@link https://github.com/rhysbrettbowen/Loader}.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.LookUp');

goog.require('goog.History');
goog.require('goog.net.XhrManager');
goog.require('org.jboss.search.util.ImageLoader');
goog.require('org.jboss.search.service.QueryService');
goog.require('org.jboss.search.service.QueryServiceDispatcher');

/**
 * @constructor
 */
org.jboss.search.LookUp = function() {

    /**
     * @type {Object}
     * @private
     */
    this.projectMap_;

    /**
     * @type {Array.<{name: string, code: string}>}
     * @private
     */
    this.projectArray_;

    /**
     * @type {org.jboss.search.page.filter.DateFilter}
     * @private
     */
    this.dateFilter_;

    /**
     * @type {org.jboss.search.page.filter.ProjectFilter}
     * @private
     */
    this.projectFilter_;

    /**
     * @type {org.jboss.search.page.filter.AuthorFilter}
     * @private
     */
    this.authorFilter_;

	/**
	 * @type {org.jboss.search.page.filter.ContentFilter}
	 * @private
	 */
	this.contentFilter_;

    /**
     * @type {goog.net.XhrManager}
     * @private
     */
    this.xhrManager_;

    /**
     * @type {goog.History}
     * @private
     */
    this.history_;

    /**
     * @type {?org.jboss.search.context.RequestParams}
     * @private
     */
    this.requestParams_ = null;

    /**
     * @type {Object}
     * @private
     */
    this.recentQueryResultData_;

    /**
     * Global image loader.
     * This is to ensure that any image pre-caching is handled via a single loader.
     * @type {goog.net.ImageLoader}
     * @private
     */
    this.imageLoader_;

    /**
     * @type {org.jboss.search.service.QueryService}
     * @private
     */
    this.queryService_;

    /**
     * @type {org.jboss.search.service.QueryServiceDispatcher}
     * @private
     */
    this.queryServiceDispatcher_;

};
goog.addSingletonGetter(org.jboss.search.LookUp);

/**
 * @return {Object}
 */
org.jboss.search.LookUp.prototype.getProjectMap = function() {
    if (goog.isDefAndNotNull(this.projectMap_)){
        return this.projectMap_;
    } else {
        throw new Error("ProjectMap hasn't been set yet!");
    }
};

/**
 * @param {Object} projectMap
 */
org.jboss.search.LookUp.prototype.setProjectMap = function(projectMap) {
    this.projectMap_ = projectMap;
};

/**
 * @return {Array.<{name: string, code: string}>}
 */
org.jboss.search.LookUp.prototype.getProjectArray = function() {
    return this.projectArray_;
};

/**
 * @param {Array.<{name: string, code: string}>} projectArray
 */
org.jboss.search.LookUp.prototype.setProjectArray = function(projectArray) {
    this.projectArray_ = projectArray;
};

/**
 * Return instance of XhrManager.
 * It is a singleton instance at the application level.
 * @return {!goog.net.XhrManager}
 */
org.jboss.search.LookUp.prototype.getXhrManager = function() {
    if (!goog.isDefAndNotNull(this.xhrManager_)) {
        this.xhrManager_ = new goog.net.XhrManager();
    }
    return this.xhrManager_;
};

/**
 * Return instance of goog.History.
 * It is a singleton instance at the application level.
 * @return {goog.History}
 */
org.jboss.search.LookUp.prototype.getHistory = function() {
    if (!goog.isDefAndNotNull(this.history_)) {
        this.history_ = new goog.History();
    }
    return this.history_;
};

/**
 * @param {org.jboss.search.page.filter.DateFilter} filter
 */
org.jboss.search.LookUp.prototype.setDateFilter = function(filter) {
    this.dateFilter_ = filter;
};

/**
 * @return {org.jboss.search.page.filter.DateFilter}
 */
org.jboss.search.LookUp.prototype.getDateFilter = function() {
    return this.dateFilter_;
};

/**
 * @param {org.jboss.search.page.filter.ProjectFilter} filter
 */
org.jboss.search.LookUp.prototype.setProjectFilter = function(filter) {
    this.projectFilter_ = filter;
};

/**
 * @return {org.jboss.search.page.filter.ProjectFilter}
 */
org.jboss.search.LookUp.prototype.getProjectFilter = function() {
    return this.projectFilter_;
};

/**
 * @param {org.jboss.search.page.filter.AuthorFilter} filter
 */
org.jboss.search.LookUp.prototype.setAuthorFilter = function(filter) {
    this.authorFilter_ = filter;
};

/**
 * @param {org.jboss.search.page.filter.ContentFilter} filter
 */
org.jboss.search.LookUp.prototype.setContentFilter = function(filter) {
	this.contentFilter_ = filter;
};

/**
 * @return {org.jboss.search.page.filter.AuthorFilter}
 */
org.jboss.search.LookUp.prototype.getAuthorFilter = function() {
    return this.authorFilter_;
};

/**
 * @return {org.jboss.search.page.filter.ContentFilter}
 */
org.jboss.search.LookUp.prototype.getContentFilter = function() {
	return this.contentFilter_;
};

/**
 * Set the latest JSON response date of user query.
 * @param {Object} json
 */
org.jboss.search.LookUp.prototype.setRecentQueryResultData = function(json) {
    this.recentQueryResultData_ = json;
};

/**
 * Get the latest JSON response date of user query.
 * @return {Object}
 */
org.jboss.search.LookUp.prototype.getRecentQueryResultData = function() {
    return this.recentQueryResultData_;
};

/**
 * @param {goog.net.ImageLoader} imageLoader
 */
org.jboss.search.LookUp.prototype.setImageLoader = function(imageLoader) {
    this.imageLoader_ = imageLoader;
};

/**
 * Return instance of ImageLoader.
 * It is a singleton instance at the application level.
 * By default it return <code>org.jboss.search.util.ImageLoader</code> which does not do any image pre-loading,
 * if you want pre-load images then you need to set different implementation of ImageLoader via #setImageLoader.
 * @return {!goog.net.ImageLoader}
 */
org.jboss.search.LookUp.prototype.getImageLoader = function() {
    if (!goog.isDefAndNotNull(this.imageLoader_)) {
        this.imageLoader_ = new org.jboss.search.util.ImageLoader();
    }
    return this.imageLoader_;
};

/**
 * @param {org.jboss.search.service.QueryService} queryService
 */
org.jboss.search.LookUp.prototype.setQueryService = function(queryService) {
    this.queryService_ = queryService;
};

/**
 * @return {org.jboss.search.service.QueryService}
 */
org.jboss.search.LookUp.prototype.getQueryService = function() {
    return this.queryService_;
};

/**
 * Return QueryServiceDispatcher.
 * @return {!org.jboss.search.service.QueryServiceDispatcher}
 */
org.jboss.search.LookUp.prototype.getQueryServiceDispatcher = function() {
    if (!goog.isDefAndNotNull(this.queryServiceDispatcher_)) {
        this.queryServiceDispatcher_ = new org.jboss.search.service.QueryServiceDispatcher();
    }
    return this.queryServiceDispatcher_;
};

/**
 * @param {org.jboss.search.context.RequestParams} requestParams
 */
org.jboss.search.LookUp.prototype.setRequestParams = function(requestParams) {
    this.requestParams_ = requestParams;
};

/**
 * @return {?org.jboss.search.context.RequestParams}
 */
org.jboss.search.LookUp.prototype.getRequestParams = function() {
    return this.requestParams_;
}