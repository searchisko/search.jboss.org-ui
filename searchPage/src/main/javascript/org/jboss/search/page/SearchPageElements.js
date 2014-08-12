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
 * @fileoverview Representation of all the DOM elements needed by {@link SearchPage}.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.SearchPageElements');
goog.provide('org.jboss.search.page.SearchPageElementsParams');

goog.require('org.jboss.core.widget.ComponentElements');


/**
 * Definition of {@link SearchPageElementsParams} constructor type.
 *
 * @typedef {{
 *   query_field: !HTMLInputElement,
 *   clear_query: !HTMLDivElement,
 *   spinner: !HTMLDivElement,
 *   date_order: !HTMLSelectElement,
 *   query_suggestions_div: !HTMLDivElement,
 *   search_results_div: !HTMLDivElement,
 *   search_filters_div: !HTMLDivElement
 * }}
 */
org.jboss.search.page.SearchPageElementsParams;



/**
 * Create a new instance of Search Page elements.
 *
 * @param {!org.jboss.search.page.SearchPageElementsParams} params
 * @implements {org.jboss.core.widget.ComponentElements}
 * @constructor
 */
org.jboss.search.page.SearchPageElements = function(params) {

  /**
   * @const
   * @type {!HTMLInputElement}
   * @private
   */
  this.query_field_ = params.query_field;

  /**
   * @const
   * @type {!HTMLDivElement}
   * @private
   */
  this.spinner_div_ = params.spinner;

  /**
   * @const
   * @type {!HTMLDivElement}
   * @private
   */
  this.clear_query_div_ = params.clear_query;

  /**
   * @const
   * @type {!HTMLDivElement}
   * @private
   */
  this.query_suggestions_div_ = params.query_suggestions_div;

  /**
   * @const
   * @type {!HTMLSelectElement}
   * @private
   */
  this.date_order_ = params.date_order;

  /**
   * @const
   * @type {!HTMLDivElement}
   * @private
   */
  this.search_results_div_ = params.search_results_div;

  /**
   * @const
   * @type {!HTMLDivElement}
   * @private
   */
  this.search_filters_div_ = params.search_filters_div;
};


/**
 * Object is valid if all the html elements are defined and not null.
 * @return {boolean}
 */
org.jboss.search.page.SearchPageElements.prototype.isValid = function() {
  return goog.isDefAndNotNull(this.query_field_) &&
      goog.isDefAndNotNull(this.spinner_div_) &&
      goog.isDefAndNotNull(this.clear_query_div_) &&
      goog.isDefAndNotNull(this.query_suggestions_div_) &&
      goog.isDefAndNotNull(this.date_order_) &&
      goog.isDefAndNotNull(this.search_results_div_) &&
      goog.isDefAndNotNull(this.search_filters_div_);
};


/** @return {!HTMLInputElement} */
org.jboss.search.page.SearchPageElements.prototype.getQuery_field = function() {
  return this.query_field_;
};


/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getSpinner_div = function() {
  return this.spinner_div_;
};


/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getClear_query_div = function() {
  return this.clear_query_div_;
};


/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getQuery_suggestions_div = function() {
  return this.query_suggestions_div_;
};


/** @return {!HTMLSelectElement} */
org.jboss.search.page.SearchPageElements.prototype.getDate_order = function() {
  return this.date_order_;
};


/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getSearch_results_div = function() {
  return this.search_results_div_;
};


/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getSearch_filters_div = function() {
  return this.search_filters_div_;
};
