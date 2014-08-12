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
 * @fileoverview Representation of all the DOM elements needed by {@link ContentFilter}.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.filter.ContentFilterElements');
goog.provide('org.jboss.search.page.filter.ContentFilterElementsParams');

goog.require('org.jboss.core.widget.ComponentElements');


/**
 * Definition of {@link ContentFilterElements} constructor type.
 *
 * @typedef {{
 *    tab_element: !HTMLDivElement,
 *    hosting_element: !HTMLElement,
 *    items_div: !HTMLDivElement
 * }}
 */
org.jboss.search.page.filter.ContentFilterElementsParams;



/**
 * Create a new instance of Author filter elements.
 *
 * @param {org.jboss.search.page.filter.ContentFilterElementsParams} params
 * @implements {org.jboss.core.widget.ComponentElements}
 * @constructor
 */
org.jboss.search.page.filter.ContentFilterElements = function(params) {

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
  this.items_div_ = params.items_div;
};


/** @override */
org.jboss.search.page.filter.ContentFilterElements.prototype.isValid = function() {
  return goog.isDefAndNotNull(this.tab_) &&
      goog.isDefAndNotNull(this.element_) &&
      goog.isDefAndNotNull(this.items_div_);
};


/**
 * @return {!HTMLDivElement}
 */
org.jboss.search.page.filter.ContentFilterElements.prototype.getTabElement = function() {
  return this.tab_;
};


/**
 * @return {!HTMLElement}
 */
org.jboss.search.page.filter.ContentFilterElements.prototype.getHostingElement = function() {
  return this.element_;
};


/**
 * @return {!HTMLDivElement}
 */
org.jboss.search.page.filter.ContentFilterElements.prototype.getItemsDiv = function() {
  return this.items_div_;
};
