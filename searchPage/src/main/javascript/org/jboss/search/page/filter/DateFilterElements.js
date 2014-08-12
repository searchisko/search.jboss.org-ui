/*
 * JBoss, Home of Professional Open Source
 * Copyright 2014 Red Hat Inc. and/or its affiliates and other contributors
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
 * @fileoverview Representation of all the DOM elements needed by {@link DateFilter}.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.filter.DateFilterElements');
goog.provide('org.jboss.search.page.filter.DateFilterElementsParams');

goog.require('org.jboss.core.widget.ComponentElements');


/**
 * Definition of {@link DateFilterElements} constructor type.
 *
 * @typedef {{
 *    tab_element:     !HTMLDivElement,
 *    hosting_element: !HTMLElement,
 *    chart_div:       !HTMLDivElement,
 *    date_from_field: !HTMLInputElement,
 *    date_to_field:   !HTMLInputElement
 * }}
 */
org.jboss.search.page.filter.DateFilterElementsParams;



/**
 * Create a new instance of Date filter elements.
 *
 * @param {org.jboss.search.page.filter.DateFilterElementsParams} params
 * @implements {org.jboss.core.widget.ComponentElements}
 * @constructor
 */
org.jboss.search.page.filter.DateFilterElements = function(params) {

  /**
   * @const
   * @type {!HTMLDivElement}
   * @private
   */
  this.tab_ = params.tab_element;

  /**
   * @const
   * @type {!HTMLElement}
   * @private
   */
  this.element_ = params.hosting_element;

  /**
   * @const
   * @type {!HTMLDivElement}
   * @private
   */
  this.chart_div_ = params.chart_div;

  /**
   * @const
   * @type {!HTMLInputElement}
   * @private
   */
  this.date_from_field_ = params.date_from_field;

  /**
   * @const
   * @type {!HTMLInputElement}
   * @private
   */
  this.date_to_field_ = params.date_to_field;
};


/** @override */
org.jboss.search.page.filter.DateFilterElements.prototype.isValid = function() {
  return goog.isDefAndNotNull(this.tab_) &&
      goog.isDefAndNotNull(this.element_) &&
      goog.isDefAndNotNull(this.chart_div_) &&
      goog.isDefAndNotNull(this.date_from_field_) &&
      goog.isDefAndNotNull(this.date_to_field_);
};


/**
 * @return {!HTMLDivElement}
 */
org.jboss.search.page.filter.DateFilterElements.prototype.getTabElement = function() {
  return this.tab_;
};


/**
 * @return {!HTMLElement}
 */
org.jboss.search.page.filter.DateFilterElements.prototype.getHostingElement = function() {
  return this.element_;
};


/**
 * @return {!HTMLDivElement}
 */
org.jboss.search.page.filter.DateFilterElements.prototype.getChartDiv = function() {
  return this.chart_div_;
};


/**
 * @return {!HTMLInputElement}
 */
org.jboss.search.page.filter.DateFilterElements.prototype.getDateFromField = function() {
  return this.date_from_field_;
};


/**
 * @return {!HTMLInputElement}
 */
org.jboss.search.page.filter.DateFilterElements.prototype.getDateToField = function() {
  return this.date_to_field_;
};
