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

goog.require('org.jboss.search.page.SearchPageElements');

goog.require('goog.dom');

goog.require('goog.testing.jsunit');

var testInvalidObject = function () {

    var elements = new org.jboss.search.page.SearchPageElements();
    assertFalse(elements.isValid());

};

var testIncompleteParameters = function () {

    var query_field = /** @type {!HTMLInputElement} */ goog.dom.createDom('input', { type: 'text'});

    var elements = new org.jboss.search.page.SearchPageElements(query_field);
    assertFalse(elements.isValid());

};

/**
 * SearchPageElements.isValid() return true only if all the parameters are passed.
 */
var testValidParameters = function() {

    var query_field = /** @type {!HTMLInputElement} */ goog.dom.createDom('input', { type: 'text'});
    var spinner_div = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);
    var clear_query_div = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);
    var query_suggestions_div = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);

    var date_filter_body_div    = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);
    var project_filter_body_div = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);
    var author_filter_body_div  = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);

    var date_histogram_chart_div = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);
    var date_filter_from_field   = /** @type {!HTMLInputElement} */ goog.dom.createDom('input', { type: 'text'});
    var date_filter_to_field     = /** @type {!HTMLInputElement} */ goog.dom.createDom('input', { type: 'text'});

    var date_filter_tab_div    = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);
    var author_filter_tab_div  = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);
    var project_filter_tab_div = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);
    var date_order             = /** @type {!HTMLSelectElement} */ goog.dom.createDom('select', null);

    var project_filter_query_field = /** @type {!HTMLInputElement} */ goog.dom.createDom('input', { type: 'text'});
    var author_filter_query_field  = /** @type {!HTMLInputElement} */ goog.dom.createDom('input', { type: 'text'});

    var search_results_div = /** @type {!HTMLDivElement} */ goog.dom.createDom('div', null);

    var elements = new org.jboss.search.page.SearchPageElements(
        query_field, spinner_div, clear_query_div, query_suggestions_div,
        date_filter_tab_div, project_filter_tab_div, author_filter_tab_div,
        date_filter_body_div, project_filter_body_div, author_filter_body_div,
        date_histogram_chart_div, date_filter_from_field, date_filter_to_field,
        date_order,
        project_filter_query_field, author_filter_query_field,
        search_results_div
    );
    assertTrue(elements.isValid());

}