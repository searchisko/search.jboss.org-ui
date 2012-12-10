/*
    @preserve
    JBoss, Home of Professional Open Source
    Copyright 2012 Red Hat Inc. and/or its affiliates and other contributors
    as indicated by the @authors tag. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

goog.provide('Init');

goog.require('org.jboss.search.page.SearchPage');

goog.require('goog.dom');

goog.require('goog.net.XhrManager');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.net.XhrManager.Request');

goog.require('goog.debug.Logger');

// Added to get rid of advanced compilation errors - Closure dependencies are broken ?
goog.require('goog.net.XhrLite');

/**
 * @fileoverview Initialization of the Search UI.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
{
    var log = goog.debug.Logger.getLogger('init');

    log.info("Starting...");

    // ================================================================
    // A shortcut
    // ================================================================
    var const_ = org.jboss.search.Constants;

    // ================================================================
    // Get necessary HTML elements
    // ================================================================

    var query_field = /** @type {!HTMLInputElement} */ goog.dom.getElement('query_field');
    var query_suggestions_div = /** @type {!HTMLDivElement} */ goog.dom.getElement('search_suggestions');

    var date_filter_body_div    = /** @type {!HTMLDivElement} */ goog.dom.getElement('date_filter');
    var project_filter_body_div = /** @type {!HTMLDivElement} */ goog.dom.getElement('project_filter');
    var author_filter_body_div  = /** @type {!HTMLDivElement} */ goog.dom.getElement('author_filter');

    var project_filter_query_field = /** @type {!HTMLInputElement} */ goog.dom.getElement('project_filter_query_field');
    var author_filter_query_field  = /** @type {!HTMLInputElement} */ goog.dom.getElement('author_filter_query_field');

    var second_filters_row_div = /** @type {!HTMLDivElement} */ goog.dom.getElement('second_filters_row');

    var date_filter_tab_div    = /** @type {!HTMLDivElement} */ goog.dom.getElementByClass('date', second_filters_row_div);
    var author_filter_tab_div  = /** @type {!HTMLDivElement} */ goog.dom.getElementByClass('author', second_filters_row_div);
    var project_filter_tab_div = /** @type {!HTMLDivElement} */ goog.dom.getElementByClass('project', second_filters_row_div);

    // ================================================================
    // Define internal variables and objects
    // ================================================================

    /** @type {!goog.net.XhrManager} */
    var xhrManager = new goog.net.XhrManager();
    var context = goog.getObjectByName('document');

    var searchPage = new org.jboss.search.page.SearchPage(
        xhrManager,
        context,
        query_field, query_suggestions_div,
        date_filter_tab_div, project_filter_tab_div, author_filter_tab_div,
        date_filter_body_div, project_filter_body_div, author_filter_body_div,
        project_filter_query_field, author_filter_query_field
    );

}
