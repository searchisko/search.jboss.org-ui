/**
 * @preserve
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
 * @fileoverview This is initialization of the application:
 *   - Configuration of locator and lookup.
 *   - Locate all needed DOM elements.
 *   - Then create the main search app.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('init.search');

goog.require('goog.History');
goog.require('goog.dom');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.service.navigation.NavigationServiceHistory');
goog.require('org.jboss.core.util.ImageLoaderNet');
goog.require('org.jboss.search.App');
//goog.require('org.jboss.search.logging.Logging');
goog.require('org.jboss.search.page.SearchPageElements');
goog.require('org.jboss.search.page.filter.ContentFilterElements');
goog.require('org.jboss.search.page.filter.CommonFilterElements');
goog.require('org.jboss.search.page.filter.DateFilterElements');
goog.require('org.jboss.search.service.LookUp');
goog.require('org.jboss.search.service.query.QueryServiceCached');
goog.require('org.jboss.search.service.query.QueryServiceXHR');

{
  // Create and configure LookUp instance
  new org.jboss.core.service.Locator(new org.jboss.search.service.LookUp());

  var lookup_ = org.jboss.core.service.Locator.getInstance().getLookup();

  // setup ImageLoader that does pre-load images.
  lookup_.setImageLoader(new org.jboss.core.util.ImageLoaderNet());

  // setup production QueryService (cached version)
  lookup_.setQueryService(
      new org.jboss.search.service.query.QueryServiceCached(
          new org.jboss.search.service.query.QueryServiceXHR(lookup_.getQueryServiceDispatcher())
      )
  );

  // setup navigation service based on history object
  lookup_.setNavigationService(
      new org.jboss.core.service.navigation.NavigationServiceHistory(
          lookup_.getNavigationServiceDispatcher(),
          new goog.History()
      )
  );

  //  if (goog.DEBUG) {
  //    new org.jboss.search.logging.Logging(
  //        org.jboss.core.service.Locator.getInstance().getLookup().getHistory()
  //    );
  //  }

  // Couple of locate*FilterElements_ function follow.
  // I wanted to put then in the end of the file (function declaration) but
  // for some reason the Closure Compiler was complaining about ...
  // so I have to create functions ahead using expressions instead.
  // Check: this can be fixed in newer version of closure compiler.

  var second_filters_row_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('second_filters_row'));
  if (!goog.isDefAndNotNull(second_filters_row_div)) {
    throw new Error('Missing some DOM elements!');
  }

  /**
   * Locate all DOM elements needed for {@link AuthorFilter}.
   *
   * @return {!org.jboss.search.page.filter.CommonFilterElements}
   * @private
   */
  var locateAuthorFilterElements_ = function() {
    var author_filter_tab_div = /** @type {!HTMLDivElement} */ (
        goog.dom.getElementByClass(
            'author',
            second_filters_row_div));
    var author_filter_body_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('author_filter'));
    var author_filter_query_field = /** @type {!HTMLInputElement} */ (goog.dom.getElement('author_filter_query_field'));
    // DIV element where authors are listed
    var author_filter_items_div = /** @type {!HTMLDivElement} */ (
        goog.dom.getElementByClass(
            'filter_items',
            author_filter_body_div));
    var author_filter_order_select = /** @type {!HTMLSelectElement} */ (
        goog.dom.findNode(
            author_filter_body_div,
            function(node) {
              return (goog.dom.isElement(node) && node.getAttribute('id') == 'author_order');
            }));

    var authorElements = new org.jboss.search.page.filter.CommonFilterElements({
      tab_element: author_filter_tab_div,
      hosting_element: author_filter_body_div,
      query_field: author_filter_query_field,
      items_div: author_filter_items_div,
      items_order: author_filter_order_select
    });
    if (!authorElements.isValid()) {
      throw new Error('Missing some DOM elements for AuthorFilter!');
    }
    return authorElements;
  };

  /**
   * Locate all DOM elements needed for {@link TechnologyFilter}.
   *
   * @return {!org.jboss.search.page.filter.CommonFilterElements}
   * @private
   */
  var locateTechnologyFilterElements_ = function() {
    var technology_filter_tab_div = /** @type {!HTMLDivElement} */ (
        goog.dom.getElementByClass(
            'project',
            second_filters_row_div));
    var technology_filter_body_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('project_filter'));
    var technology_filter_query_field = /** @type {!HTMLInputElement} */ (goog.dom.getElement('project_filter_query_field'));
    // DIV element where authors are listed
    var technology_filter_items_div = /** @type {!HTMLDivElement} */ (
        goog.dom.getElementByClass(
            'filter_items',
            technology_filter_body_div));
    var technology_filter_order_select = /** @type {!HTMLSelectElement} */ (
        goog.dom.findNode(
            technology_filter_body_div,
            function(node) {
              return (goog.dom.isElement(node) && node.getAttribute('id') == 'technology_order');
            }));

    var technologyElements = new org.jboss.search.page.filter.CommonFilterElements({
      tab_element: technology_filter_tab_div,
      hosting_element: technology_filter_body_div,
      query_field: technology_filter_query_field,
      items_div: technology_filter_items_div,
      items_order: technology_filter_order_select
    });
    if (!technologyElements.isValid()) {
      throw new Error('Missing some DOM elements for TechnologyFilter!');
    }
    return technologyElements;
  };

  /**
   * Locate all DOM elements needed for {@link ContentFilter}.
   *
   * @return {!org.jboss.search.page.filter.ContentFilterElements}
   * @private
   */
  var locateContentFilterElements_ = function() {
    var content_filter_tab_div = /** @type {!HTMLDivElement} */ (
        goog.dom.getElementByClass(
            'content',
            second_filters_row_div));
    var content_filter_body_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('content_filter'));
    // DIV element where content types are listed
    var content_filter_items_div = /** @type {!HTMLDivElement} */ (
        goog.dom.getElementByClass(
            'filter_items',
            content_filter_body_div));

    var contentElements = new org.jboss.search.page.filter.ContentFilterElements({
      tab_element: content_filter_tab_div,
      hosting_element: content_filter_body_div,
      items_div: content_filter_items_div
    });
    if (!contentElements.isValid()) {
      throw new Error('Missing some DOM elements for ContentFilter!');
    }
    return contentElements;
  };

  /**
   * Locate all DOM elements needed for {@link DateFilter}.
   *
   * @return {!org.jboss.search.page.filter.DateFilterElements}
   * @private
   */
  var locateDateFilterElements_ = function() {
    var date_filter_tab_div = /** @type {!HTMLDivElement} */ (goog.dom.getElementByClass('date', second_filters_row_div));
    var date_filter_body_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('date_filter'));
    var date_histogram_chart_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('date_histogram_chart'));
    var date_filter_from_field = /** @type {!HTMLInputElement} */ (goog.dom.getElement('date_filter_from_field'));
    var date_filter_to_field = /** @type {!HTMLInputElement} */ (goog.dom.getElement('date_filter_to_field'));

    var dateElements = new org.jboss.search.page.filter.DateFilterElements({
      tab_element: date_filter_tab_div,
      hosting_element: date_filter_body_div,
      chart_div: date_histogram_chart_div,
      date_from_field: date_filter_from_field,
      date_to_field: date_filter_to_field
    });
    if (!dateElements.isValid()) {
      throw new Error('Missing some DOM elements for DateFilter!');
    }
    return dateElements;
  };

  /**
   * Locate all DOM elements needed for {@link DateFilter}.
   *
   * @return {!org.jboss.search.page.SearchPageElements}
   * @private
   */
  var locateSearchPageElements_ = function() {

    var query_field = /** @type {!HTMLInputElement} */ (goog.dom.getElement('query_field'));
    var spinner_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('query_field_div_spinner'));
    var clear_query_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('query_field_div_x'));
    var query_suggestions_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('search_suggestions'));

    var date_order = /** @type {!HTMLSelectElement} */ (goog.dom.getElement('date_order'));

    var search_results_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('search_results'));
    var search_filters_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('active_search_filters'));

    var searchPageElements = new org.jboss.search.page.SearchPageElements({
      query_field: query_field,
      clear_query: clear_query_div,
      spinner: spinner_div,
      date_order: date_order,
      query_suggestions_div: query_suggestions_div,
      search_results_div: search_results_div,
      search_filters_div: search_filters_div
    });

    if (!searchPageElements.isValid()) {
      throw new Error('Missing some HTML elements!');
    }

    return searchPageElements;
  };

  var authorFilterElements = locateAuthorFilterElements_();
  var contentFilterElements = locateContentFilterElements_();
  var dateFilterElements = locateDateFilterElements_();
  var technologyFilterElements = locateTechnologyFilterElements_();
  var searchPageElements = locateSearchPageElements_();

  // Create the search app
  new org.jboss.search.App({
    authorElements: authorFilterElements,
    technologyElements: technologyFilterElements,
    contentElements: contentFilterElements,
    dateElements: dateFilterElements,
    searchPageElements: searchPageElements
  });
}
