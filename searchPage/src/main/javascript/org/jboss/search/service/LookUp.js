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
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.service.LookUp');

goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.service.LookUpImpl');
goog.require('org.jboss.core.service.query.QueryService');
goog.require('org.jboss.core.service.query.QueryServiceDispatcher');
goog.require('org.jboss.search.page.filter.AuthorFilter');
goog.require('org.jboss.search.page.filter.ContentFilter');
goog.require('org.jboss.search.page.filter.DateFilter');
goog.require('org.jboss.search.page.filter.TechnologyFilter');



/**
 *
 * @constructor
 * @extends {org.jboss.core.service.LookUpImpl}
 * @final
 */
org.jboss.search.service.LookUp = function() {
  org.jboss.core.service.LookUpImpl.call(this);

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
   * @type {org.jboss.search.page.filter.TechnologyFilter}
   * @private
   */
  this.technologyFilter_;

  /**
   * @type {org.jboss.search.page.filter.AuthorFilter}
   * @private
   */
  this.authorFilter_;

  /**
   * @type {org.jboss.search.page.filter.DateFilter}
   * @private
   */
  this.dateFilter_;

  /**
   * @type {org.jboss.search.page.filter.ContentFilter}
   * @private
   */
  this.contentFilter_;

  /**
   * @type {?org.jboss.core.context.RequestParams}
   * @private
   */
  this.requestParams_ = null;

  /**
   * @type {Object}
   * @private
   */
  this.recentQueryResultData_;

};
goog.inherits(org.jboss.search.service.LookUp, org.jboss.core.service.LookUpImpl);


/**
 * @return {Object}
 */
org.jboss.search.service.LookUp.prototype.getProjectMap = function() {
  if (goog.isDefAndNotNull(this.projectMap_)) {
    return this.projectMap_;
  } else {
    throw new Error('ProjectMap hasn\'t been set yet!');
  }
};


/**
 * @param {Object} projectMap
 */
org.jboss.search.service.LookUp.prototype.setProjectMap = function(projectMap) {
  this.projectMap_ = projectMap;
};


/**
 * @return {Array.<{name: string, code: string}>}
 */
org.jboss.search.service.LookUp.prototype.getProjectArray = function() {
  return this.projectArray_;
};


/**
 * @param {Array.<{name: string, code: string}>} projectArray
 */
org.jboss.search.service.LookUp.prototype.setProjectArray = function(projectArray) {
  this.projectArray_ = projectArray;
};


/**
 * @param {org.jboss.search.page.filter.TechnologyFilter} filter
 */
org.jboss.search.service.LookUp.prototype.setTechnologyFilter = function(filter) {
  this.technologyFilter_ = filter;
};


/**
 * @return {org.jboss.search.page.filter.TechnologyFilter}
 */
org.jboss.search.service.LookUp.prototype.getTechnologyFilter = function() {
  return this.technologyFilter_;
};


/**
 * @param {org.jboss.search.page.filter.AuthorFilter} filter
 */
org.jboss.search.service.LookUp.prototype.setAuthorFilter = function(filter) {
  this.authorFilter_ = filter;
};


/**
 * @return {org.jboss.search.page.filter.AuthorFilter}
 */
org.jboss.search.service.LookUp.prototype.getAuthorFilter = function() {
  return this.authorFilter_;
};


/**
 * @param {org.jboss.search.page.filter.ContentFilter} filter
 */
org.jboss.search.service.LookUp.prototype.setContentFilter = function(filter) {
  this.contentFilter_ = filter;
};


/**
 * @return {org.jboss.search.page.filter.ContentFilter}
 */
org.jboss.search.service.LookUp.prototype.getContentFilter = function() {
  return this.contentFilter_;
};


/**
 * @param {org.jboss.search.page.filter.DateFilter} filter
 */
org.jboss.search.service.LookUp.prototype.setDateFilter = function(filter) {
  this.dateFilter_ = filter;
};


/**
 * @return {org.jboss.search.page.filter.DateFilter}
 */
org.jboss.search.service.LookUp.prototype.getDateFilter = function() {
  return this.dateFilter_;
};


/**
 * Set the latest JSON response data of user query.
 * @param {Object} json
 */
org.jboss.search.service.LookUp.prototype.setRecentQueryResultData = function(json) {
  this.recentQueryResultData_ = json;
};


/**
 * Get the latest JSON response data of user query.
 * @return {Object}
 */
org.jboss.search.service.LookUp.prototype.getRecentQueryResultData = function() {
  return this.recentQueryResultData_;
};


/**
 * @param {org.jboss.core.context.RequestParams} requestParams
 */
org.jboss.search.service.LookUp.prototype.setRequestParams = function(requestParams) {
  this.requestParams_ = requestParams;
};


/**
 * @return {?org.jboss.core.context.RequestParams}
 */
org.jboss.search.service.LookUp.prototype.getRequestParams = function() {
  return this.requestParams_;
};
