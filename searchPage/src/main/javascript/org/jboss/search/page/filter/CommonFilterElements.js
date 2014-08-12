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
 * @fileoverview Representation of all the DOM elements needed by filter.
 * It is used by {@link AuthorFilter} and {@link TechnologyFilter}.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.filter.CommonFilterElements');
goog.provide('org.jboss.search.page.filter.CommonFilterElementsParams');

goog.require('org.jboss.core.widget.ComponentElements');


/**
 * Definition of {@link CommonFilterElements} constructor type.
 *
 * @typedef {{
 *    tab_element: !HTMLDivElement,
 *    hosting_element: !HTMLElement,
 *    query_field: !HTMLInputElement,
 *    items_div: !HTMLDivElement,
 *    items_order: !HTMLSelectElement
 * }}
 */
org.jboss.search.page.filter.CommonFilterElementsParams;



/**
 * Create a new instance of Common filter elements.
 *
 * @param {org.jboss.search.page.filter.CommonFilterElementsParams} params
 * @implements {org.jboss.core.widget.ComponentElements}
 * @constructor
 */
org.jboss.search.page.filter.CommonFilterElements = function(params) {

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
   * @type {!HTMLInputElement}
   * @private
   */
  this.query_field_ = params.query_field;

  /**
   * @const
   * @type {!HTMLDivElement}
   * @private
   */
  this.items_div_ = params.items_div;

  /**
   * @const
   * @type {!HTMLSelectElement}
   * @private
   */
  this.items_order_ = params.items_order;
};


/** @override */
org.jboss.search.page.filter.CommonFilterElements.prototype.isValid = function() {
  return goog.isDefAndNotNull(this.tab_) &&
      goog.isDefAndNotNull(this.element_) &&
      goog.isDefAndNotNull(this.query_field_) &&
      goog.isDefAndNotNull(this.items_div_) &&
      goog.isDefAndNotNull(this.items_order_);
};


/**
 * @return {!HTMLDivElement}
 */
org.jboss.search.page.filter.CommonFilterElements.prototype.getTabElement = function() {
  return this.tab_;
};


/**
 * @return {!HTMLElement}
 */
org.jboss.search.page.filter.CommonFilterElements.prototype.getHostingElement = function() {
  return this.element_;
};


/**
 * @return {!HTMLInputElement}
 */
org.jboss.search.page.filter.CommonFilterElements.prototype.getQueryField = function() {
  return this.query_field_;
};


/**
 * @return {!HTMLDivElement}
 */
org.jboss.search.page.filter.CommonFilterElements.prototype.getItemsDiv = function() {
  return this.items_div_;
};


/**
 * @return {!HTMLSelectElement}
 */
org.jboss.search.page.filter.CommonFilterElements.prototype.getItemsOrder = function() {
  return this.items_order_;
};
