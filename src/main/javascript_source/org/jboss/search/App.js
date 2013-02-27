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

goog.provide('org.jboss.search.App');

goog.require('org.jboss.search.page.filter.ProjectFilter');
goog.require('org.jboss.search.list.project.Project');
goog.require('org.jboss.search.page.element.Status');
goog.require('org.jboss.search.page.SearchPage');
goog.require('org.jboss.search.util.FragmentParser');
goog.require('org.jboss.search.suggestions.event.EventType');
goog.require('org.jboss.search.Constants');

goog.require('goog.async.Deferred');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.net.XhrManager');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.net.XhrManager.Request');
goog.require('goog.Disposable');
goog.require('goog.History');
goog.require('goog.Uri');

goog.require('goog.debug.Logger');

// Added to get rid of advanced compilation errors - Closure dependencies are broken ?
goog.require('goog.net.XhrLite');
/*
 If LoggingWindow.js is not included in the compilation then
 the following require() is used to get rid of compilation error
 [Goog.ERROR]: JSC_TYPE_PARSE_ERROR. Bad type annotation. Unknown type goog.debug.ErrorHandle ...
 ... closure-library/closure/goog/events/events.js line 896 : 11

 Correct solution is described here:
 http://code.google.com/p/closure-library/wiki/FrequentlyAskedQuestions
 */
goog.require('goog.debug.ErrorHandler');

/**
 * Constructor of the JBoss Search Application.
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.App = function() {

    goog.Disposable.call(this);

    // init Status window (consider doing it earlier)
    var status_window = /** @type {!HTMLDivElement} */ (goog.dom.getElement('status_window'))
    var status = new org.jboss.search.page.element.Status(status_window);
    status.show('Initialization...');

    var log = goog.debug.Logger.getLogger('org.jboss.search.App');
    log.info("Search App initialization...");

    // ================================================================
    // A shortcut
    // ================================================================
    var const_ = org.jboss.search.Constants;

    // ================================================================
    // Get necessary HTML elements
    // ================================================================

    var query_field = /** @type {!HTMLInputElement} */ (goog.dom.getElement('query_field'));
    var spinner_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('query_field_div_spinner'));
    var clear_query_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('query_field_div_x'));
    var query_suggestions_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('search_suggestions'));

    var date_filter_body_div    = /** @type {!HTMLDivElement} */ (goog.dom.getElement('date_filter'));
    var project_filter_body_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('project_filter'));
    var author_filter_body_div  = /** @type {!HTMLDivElement} */ (goog.dom.getElement('author_filter'));

    var project_filter_query_field = /** @type {!HTMLInputElement} */ (goog.dom.getElement('project_filter_query_field'));
    var author_filter_query_field  = /** @type {!HTMLInputElement} */ (goog.dom.getElement('author_filter_query_field'));

    var second_filters_row_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('second_filters_row'));

    var date_filter_tab_div    = /** @type {!HTMLDivElement} */ (goog.dom.getElementByClass('date', second_filters_row_div));
    var author_filter_tab_div  = /** @type {!HTMLDivElement} */ (goog.dom.getElementByClass('author', second_filters_row_div));
    var project_filter_tab_div = /** @type {!HTMLDivElement} */ (goog.dom.getElementByClass('project', second_filters_row_div));

    var search_results_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('search_results'));

    status.setProgressValue(0.5);

    // ================================================================
    // Define internal variables and objects
    // ================================================================

    // get our window
//    var window_ = window || goog.dom.getWindow(goog.dom.getOwnerDocument(query_field));
    var history = new goog.History();

    var fragmentParser = new org.jboss.search.util.FragmentParser();

    /** @type {!goog.net.XhrManager} */
    var xhrManager = new goog.net.XhrManager();
    var searchPageContext = goog.getObjectByName('document');

    /**
     * Sets given query string to URL fragment.
     * Basically, this function is called by the search page; whenever user selects or input search query this function
     * gets called. It changes URL fragment and thus calls navigatorController.
     *
     * @param query_string value to be set to URL fragment, the value is encoded first!
     */
    var urlSetFragmentFunction = function(query_string) {
        history.setToken("q=" + goog.string.urlEncode(query_string));
    };

    status.setProgressValue(0.8);

    var searchPageElements = new org.jboss.search.page.SearchPageElements(
        query_field, spinner_div, clear_query_div, query_suggestions_div,
        date_filter_tab_div, project_filter_tab_div, author_filter_tab_div,
        date_filter_body_div, project_filter_body_div, author_filter_body_div,
        project_filter_query_field, author_filter_query_field,
        search_results_div
    );

    if (!searchPageElements.isValid()) {
        throw new Error('Missing some HTML elements!');
    }

    var searchPage = new org.jboss.search.page.SearchPage(
        xhrManager,
        searchPageContext,
        urlSetFragmentFunction,
        searchPageElements
    );

    // navigation controller
    var navigationController = function (e) {
        // e.isNavigate (true if value in browser address bar is changed manually)
        log.info('Navigated to state "' + e.token + '"');
        var query = fragmentParser.getUserQuery(e.token);
        if (goog.isDef(query)) {
            searchPage.runSearch(query);
        }
    };

    var projectFilter;

    // activate URL History manager
    this.historyListenerId_ = goog.events.listen(history, goog.history.EventType.NAVIGATE, navigationController);

    var deferred = new goog.async.Deferred();
    var projectList = new org.jboss.search.list.project.Project(deferred);
    deferred
        .addCallback(function(){
            status.setProgressValue(1);
        })
        .addCallback(function(){
            projectFilter = new org.jboss.search.page.filter.ProjectFilter(searchPageElements.getProject_filter_body_div());
            projectFilter.replaceItems(projectList.getArray());
        })
        .addCallback(function(){
            setTimeout(function(){
                status.hide();
                status.setProgressValue(0);
            },200);
        })
        .addCallback(function(){
            // start history pooling loop after initialization of lists is finished
            history.setEnabled(true);
        });

    // load project list
    xhrManager.send(
        org.jboss.search.Constants.LOAD_PROJECT_LIST_REQUEST_ID,
        goog.Uri.parse(org.jboss.search.Constants.API_URL_PROJECT_LIST_QUERY).toString(),
        org.jboss.search.Constants.GET,
        "", // post_data
        {}, // headers_map
        org.jboss.search.Constants.LOAD_LIST_PRIORITY,
        // callback, The only param is the event object from the COMPLETE event.
        function(e) {
            var event = /** @type goog.net.XhrManager.Event */ (e);
            var response = event.target.getResponseJson();
            deferred.callback(response);
        }
    );


    // TODO experiment
    this.finish_ = goog.events.listen(searchPage, org.jboss.search.suggestions.event.EventType.SEARCH_FINISH, function(){
        goog.dom.classes.add(spinner_div, const_.HIDDEN);
    });

    this.start_ = goog.events.listen(searchPage, org.jboss.search.suggestions.event.EventType.SEARCH_START, function(){
        goog.dom.classes.remove(spinner_div, const_.HIDDEN);
    });

};
goog.inherits(org.jboss.search.App, goog.Disposable);

/** @inheritDoc */
org.jboss.search.App.prototype.disposeInternal = function() {
    org.jboss.search.App.superClass_.disposeInternal.call(this);
    goog.events.unlistenByKey(this.historyListenerId_);
    goog.events.unlistenByKey(this.finish_);
    goog.events.unlistenByKey(this.start_);
};
