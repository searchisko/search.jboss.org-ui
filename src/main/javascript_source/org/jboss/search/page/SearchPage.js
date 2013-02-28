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
 *  @fileoverview Object represents the main search page.
 *
 *  @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.SearchPage');

goog.require('org.jboss.search.util.urlGenerator');
goog.require('org.jboss.search.response');
goog.require('org.jboss.search.page.templates');
goog.require('org.jboss.search.page.SearchPageElements');
goog.require('org.jboss.search.page.UserIdle');
goog.require('org.jboss.search.Constants');
goog.require('org.jboss.search.SearchFieldHandler');
goog.require('org.jboss.search.suggestions.query.view.View');
goog.require('org.jboss.search.suggestions.event.EventType');

goog.require('goog.async.Delay');

goog.require('goog.dom');
goog.require('goog.dom.classes');

goog.require('goog.events');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.events.EventType');
goog.require('goog.events.EventTarget');

goog.require('goog.net.XhrManager');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.net.XhrManager.Request');

goog.require('goog.object');

goog.require('goog.string');

goog.require('goog.Uri');

goog.require('goog.debug.Logger');

/**
 * @param {!goog.net.XhrManager} xhrManager
 * @param {EventTarget|goog.events.EventTarget} context element to catch click events and control behaviour of the UI. Typically, this is the document.
 * @param {!function(string)} querySelected Once a query is selected then call this function to notify outer controller.
 * @param {!org.jboss.search.page.SearchPageElements} elements HTML elements required by the search page
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.SearchPage = function(
        xhrManager,
        context,
        querySelected,
        elements
    ) {

    goog.events.EventTarget.call(this);

    var thiz_ = this;

    /** @private */ this.log = goog.debug.Logger.getLogger('SearchPage');

    /**
     * @private
     * @type {org.jboss.search.page.SearchPageElements} */
    this.elements = elements

    /** @private */ this.xhrManager = xhrManager;
    /** @private */ this.context = context;
    /** @private */ this.querySelected = querySelected;

    /** @private */ this.query_suggestions_view = new org.jboss.search.suggestions.query.view.View(this.elements.getQuery_suggestions_div());
    /** @private */ this.query_suggestions_model = {};


    /** @private */
    this.xhrReadyListenerId_ = goog.events.listen(this.xhrManager, goog.net.EventType.READY, function(e) {
        thiz_.dispatchEvent(org.jboss.search.suggestions.event.EventType.SEARCH_START);
    });

    /** @private */
    this.xhrCompleteListenerId_ = goog.events.listen(this.xhrManager, goog.net.EventType.COMPLETE, function(e) {
        thiz_.dispatchEvent(org.jboss.search.suggestions.event.EventType.SEARCH_FINISH);
    });

    /** @private */
    this.xhrErrorListenerId_ = goog.events.listen(this.xhrManager, goog.net.EventType.ERROR, function(e) {
        thiz_.dispatchEvent(org.jboss.search.suggestions.event.EventType.SEARCH_FINISH);
    });

    /** @private */
    this.xhrAbortListenerId_ = goog.events.listen(this.xhrManager, goog.net.EventType.ABORT, function(e) {
        thiz_.dispatchEvent(org.jboss.search.suggestions.event.EventType.SEARCH_FINISH);
    });

    this.query_suggestions_view.setClickCallbackFunction(
        function() {
            var selectedIndex = thiz_.query_suggestions_view.getSelectedIndex();
            thiz_.hideAndCleanSuggestionsElementAndModel();
            thiz_.elements.getQuery_field().focus();

            (function(selectedIndex) {
                // TODO get query_string from model at the selectedIndex position
                thiz_.querySelected("option was selected by pointer (index: "+selectedIndex+")");

            })(selectedIndex);
        }
    );

    var suggestionsCallback = function(query_string) {

        if (goog.string.isEmptySafe(query_string)) {

            thiz_.hideAndCleanSuggestionsElementAndModel();

        } else {

            // Abort does not send any event (because of the 'true')
            // so technically, we should fire our own SEARCH_FINISH event but because
            // we are immediately starting a new search we do not do it.
            thiz_.xhrManager.abort(org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_ID, true);
            thiz_.xhrManager.send(
                org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_ID,
//                "../../test/resources/suggestions_response.json",
                // setting the parameter value clears previously set value (that is what we want!)
                thiz_.getSuggestionsUri().setParameterValue("q",query_string).toString(),
                org.jboss.search.Constants.GET,
                "", // post_data
                {}, // headers_map
                org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_PRIORITY,

                // callback, The only param is the event object from the COMPLETE event.
                function(e) {
                    var event = /** @type goog.net.XhrManager.Event */ (e);
                    if (event.target.isSuccess()) {
                        var response = event.target.getResponseJson();
                        // We are taking the response from the mock server for now,
                        // just replace the token with an actual query string.
                        response['view']['search']['options'] = [query_string];
                        response['model']['search']['search']['query'] = query_string;

                        var model = /** @type {!Object} */ (goog.object.get(response, "model", {}));
                        thiz_.query_suggestions_model = thiz_.parseQuerySuggestionsModel(model);

                        if (goog.object.containsKey(response, "view")) {
                            var view = /** @type {!Object} */ (goog.object.get(response, "view", {}));

                            thiz_.query_suggestions_view.update(view);
                            thiz_.query_suggestions_view.show();

                        } else {
                            thiz_.hideAndCleanSuggestionsElementAndModel();
                        }
                    } else {
                        // We failed getting query suggestions
                        thiz_.hideAndCleanSuggestionsElementAndModel();
                    }

                }
            );
        }
    };

    /** @private */
    this.dateClickListenerId_ = goog.events.listen(this.elements.getDate_filter_tab_div(),
        goog.events.EventType.CLICK,
        function() {
            thiz_.isDateFilterExpanded() ? thiz_.collapseDateFilter() : thiz_.expandDateFilter()
        }
    );

    /** @private */
    this.projectClickListenerId_ = goog.events.listen(this.elements.getProject_filter_tab_div(),
        goog.events.EventType.CLICK,
        function() {
            thiz_.isProjectFilterExpanded() ? thiz_.collapseProjectFilter() : thiz_.expandProjectFilter()
        }
    );

    /** @private */
    this.authorClickListenerId_ = goog.events.listen(this.elements.getAuthor_filter_tab_div(),
        goog.events.EventType.CLICK,
        function() {
            thiz_.isAuthorFilterExpanded() ? thiz_.collapseAuthorFilter() : thiz_.expandAuthorFilter()
        }
    );

    /** @private */
    this.contextClickListenerId_ = goog.events.listen(
        thiz_.context,
        goog.events.EventType.CLICK,
        function(/** @type {goog.events.Event} */ e) {

//            log.info("Context clicked: " + goog.debug.expose(e));

            // if search field is clicked then do not hide search suggestions
            if (e.target !== thiz_.elements.getQuery_field()) {
                thiz_.hideAndCleanSuggestionsElementAndModel();
            }

            // if date filter (sub)element is clicked do not hide date filter
            if (e.target !== thiz_.elements.getDate_filter_tab_div() &&
                !goog.dom.contains(thiz_.elements.getDate_filter_body_div(), e.target)) {
                thiz_.collapseDateFilter();
            }

            // if project filter (sub)element is clicked do not hide project filter
            if (e.target !== thiz_.elements.getProject_filter_tab_div() &&
                !goog.dom.contains(thiz_.elements.getProject_filter_body_div(), e.target)) {
                thiz_.collapseProjectFilter();
            }

            // if author filter (sub)element is clicked do not hide author filter
            if (e.target !== thiz_.elements.getAuthor_filter_tab_div() &&
                !goog.dom.contains(thiz_.elements.getAuthor_filter_body_div(), e.target)) {
                thiz_.collapseAuthorFilter();
            }

        });

    /**
     * This listener can catch events when the user navigates to the query field by other means then clicking,
     * for example by TAB key or by selecting text in the field by cursor (does not fire click event).
     * We want to hide filter tabs in such case.
     * @private
     */
    this.query_field_focus_id_ = goog.events.listen(this.elements.getQuery_field(),
        goog.events.EventType.INPUT,
        function(){
            thiz_.collapseAllFilters();
        }
    );

    /** @private */
    this.userQuerySearchField = new org.jboss.search.SearchFieldHandler(
        this.elements.getQuery_field(),
        100,
        suggestionsCallback,
        null,
        this.getPresetKeyHandlers()
    );

    this.userIdle = new org.jboss.search.page.UserIdle(xhrManager, elements.getSearch_results_div());
    this.userIdleDelay = new goog.async.Delay(
        goog.bind(this.userIdle.start,this.userIdle),
        org.jboss.search.Constants.USER_IDLE_INTERVAL
    );
    this.userIdleDelay.start();

};
goog.inherits(org.jboss.search.page.SearchPage, goog.events.EventTarget);

/** @inheritDoc */
org.jboss.search.page.SearchPage.prototype.disposeInternal = function() {

    // Call the superclass's disposeInternal() method.
    org.jboss.search.page.SearchPage.superClass_.disposeInternal.call(this);

    // Dispose of all Disposable objects owned by this class.
    goog.dispose(this.elements);
    goog.dispose(this.userQuerySearchField);
    goog.dispose(this.query_suggestions_view);
    goog.dispose(this.userIdle);
    goog.dispose(this.userIdleDelay);

    // Remove listeners added by this class.
    goog.events.unlistenByKey(this.dateClickListenerId_);
    goog.events.unlistenByKey(this.projectClickListenerId_);
    goog.events.unlistenByKey(this.authorClickListenerId_);
    goog.events.unlistenByKey(this.contextClickListenerId_);
    goog.events.unlistenByKey(this.xhrReadyListenerId_);
    goog.events.unlistenByKey(this.xhrCompleteListenerId_);
    goog.events.unlistenByKey(this.xhrErrorListenerId_);
    goog.events.unlistenByKey(this.xhrAbortListenerId_);
    goog.events.unlistenByKey(this.query_field_focus_id_);

    // Remove references to COM objects.

    // Remove references to DOM nodes, which are COM objects in IE.
    delete this.log;

    delete this.xhrManager;
    delete this.context;
    delete this.querySelected;

    delete this.query_suggestions_model;

};


/**
 * Prototype URI
 * @private
 * @type {goog.Uri}
 * @const
 */
org.jboss.search.page.SearchPage.prototype.SUGGESTIONS_URI = goog.Uri.parse(org.jboss.search.Constants.API_URL_SUGGESTIONS_QUERY);

/**
 * @return {goog.Uri} Search Suggestions Service URI
 */
org.jboss.search.page.SearchPage.prototype.getSuggestionsUri = function() {
    return this.SUGGESTIONS_URI.clone();
};

/**
 * Stop and release (dispose) all resources related to user entertainment.
 */
org.jboss.search.page.SearchPage.prototype.disposeUserEntertainment = function() {
    this.userIdleDelay.stop();
    goog.dispose(this.userIdle);
};

/**
 * @private
 * @type {goog.Uri}
 * @const
 */
org.jboss.search.page.SearchPage.prototype.SEARCH_URI = goog.Uri.parse(org.jboss.search.Constants.API_URL_SEARCH_QUERY);

/**
 * Prototype URI
 * @return {goog.Uri} Query Search Service URI
 */
org.jboss.search.page.SearchPage.prototype.getSearchUri = function() {
    return this.SEARCH_URI.clone();
}
// current: http://search.jboss.org/search?query=Hibernate&filters%5Binterval%5D=month
// upcoming: https://dcpapi-libor.rhcloud.com/v1/rest/search?type=jbossorg_blog&filters%5Bcount%5D=10&sortBy=new

/**
 * Set value of query field.
 * @param {?string} query
 */
org.jboss.search.page.SearchPage.prototype.setUserQuery = function(query) {
    var newValue = "";
    if (!goog.string.isEmptySafe(query)) {
        newValue = query.trim();
    }
    this.elements.getQuery_field().value = newValue;
};

/**
 * Set user query and execute the query.
 * @param {!string} query_string
 * @param {number=} opt_page
 */
org.jboss.search.page.SearchPage.prototype.runSearch = function(query_string, opt_page) {

    this.disposeUserEntertainment();
    this.setUserQuery(query_string);

    this.log.info("User query [" + query_string + "]");

    this.xhrManager.abort(org.jboss.search.Constants.SEARCH_QUERY_REQUEST_ID, true);
    this.disableSearchResults();

    var query_url_string = org.jboss.search.util.urlGenerator.searchUrl(this.getSearchUri(), query_string, undefined, undefined, opt_page);

    if (query_url_string != null) {
        this.xhrManager.send(
            org.jboss.search.Constants.SEARCH_QUERY_REQUEST_ID,
            // setting the parameter value clears previously set value (that is what we want!)
            query_url_string,
            org.jboss.search.Constants.GET,
            "", // post_data
            {}, // headers_map
            org.jboss.search.Constants.SEARCH_QUERY_REQUEST_PRIORITY,

            // callback, The only param is the event object from the COMPLETE event.
            goog.bind(
                function(e) {
                    var event = /** @type goog.net.XhrManager.Event */ (e);
                    if (event.target.isSuccess()) {
                        var response = event.target.getResponseJson();
    //                    console.log(response);
                        var data = org.jboss.search.response.normalize(response, query_string, opt_page);
            //            console.log(data);
                        try {
                            var html = org.jboss.search.page.templates.search_results(data);
                            this.elements.getSearch_results_div().innerHTML = html;
                        } catch(error) {
                            // Something went wrong when generating search results
                            // TODO fire event (with error)
                            this.log.severe("Something went wrong",error);
                        }
                    } else {
                        // We failed getting search results data
                        var html = org.jboss.search.page.templates.request_error({
                            'user_query':query_string,
                            'error':event.target.getLastError()
                        });
                        this.elements.getSearch_results_div().innerHTML = html;
                    }
                    this.enableSearchResults();
                },
            this)
        );
    }
};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.disableSearchResults = function () {
    goog.dom.classes.add(this.elements.getSearch_results_div(), org.jboss.search.Constants.DISABLED);
}

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.enableSearchResults = function () {
    goog.dom.classes.remove(this.elements.getSearch_results_div(), org.jboss.search.Constants.DISABLED);
}

/**
 * @private
 * @return {!Object.<(goog.events.KeyCodes|number), function(goog.events.KeyEvent, goog.async.Delay)>}
 */
org.jboss.search.page.SearchPage.prototype.getPresetKeyHandlers = function() {

    var thiz_ = this;

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeEscHandler = function(event, delay) {
        delay.stop();
        thiz_.hideAndCleanSuggestionsElementAndModel();
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeDownHandler = function(event, delay) {
        event.preventDefault();
        if (thiz_.query_suggestions_view.isVisible()) {
            thiz_.query_suggestions_view.selectNext();
        }
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeUpHandler = function(event, delay) {
        event.preventDefault();
        if (thiz_.query_suggestions_view.isVisible()) {
            thiz_.query_suggestions_view.selectPrevious();
        }
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeRightHandler = function(event, delay) {
        // will do something later...
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeTabHandler = function(event, delay) {
        delay.stop();
        thiz_.hideAndCleanSuggestionsElementAndModel();
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeEnterHandler = function(event, delay) {
        var selectedIndex = thiz_.query_suggestions_view.getSelectedIndex();
        thiz_.hideAndCleanSuggestionsElementAndModel();
        event.preventDefault();

        (function(selectedIndex) {
            delay.stop();
            if (selectedIndex < 0) {
                // user hit enter and no suggestions are displayed (yet) use content of query field
                var query = thiz_.elements.getQuery_field().value;
                thiz_.querySelected(query);
            } else if (selectedIndex == 0) {
                // suggestions are displayed, user selected the first one (use what is in query field)
                var query = thiz_.elements.getQuery_field().value;
                thiz_.querySelected(query);
            } else if (selectedIndex > 0) {
                // user selected from suggestions, use what is in model
                // TODO get query_string from model at the selectedIndex position
                thiz_.querySelected("option was selected by keys (index: "+selectedIndex+")");
            }
        })(selectedIndex);
    };

    // prepare keyHandlers for the main search field
    var keyHandlers = {};

    keyHandlers[goog.events.KeyCodes.ESC] = keyCodeEscHandler;
    keyHandlers[goog.events.KeyCodes.UP] = keyCodeUpHandler;
    keyHandlers[goog.events.KeyCodes.DOWN] = keyCodeDownHandler;
    keyHandlers[goog.events.KeyCodes.RIGHT] = keyCodeRightHandler;
    keyHandlers[goog.events.KeyCodes.ENTER] = keyCodeEnterHandler;

    // TAB key does not seem to yield true in @see {goog.events.KeyCodes.isTextModifyingKeyEvent}
    // thus we have to handle it
    keyHandlers[goog.events.KeyCodes.TAB] = keyCodeTabHandler;

    return keyHandlers;
};

/**
 * Hide and clean suggestions element and empty the model.
 * @private
 */
org.jboss.search.page.SearchPage.prototype.hideAndCleanSuggestionsElementAndModel = function() {

    this.xhrManager.abort(org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_ID, true);
    // abort with 'true' does not fire any event, thus we have to fire our own event
    this.dispatchEvent(org.jboss.search.suggestions.event.EventType.SEARCH_FINISH);

    this.query_suggestions_view.hide();
    this.query_suggestions_model = {};
};

/**
 * TODO
 * @private
 * @param {!Object} model
 * @return {!Object}
 */
org.jboss.search.page.SearchPage.prototype.parseQuerySuggestionsModel = function(model) {
    return model;
};

/**
 * @private
 * @return {boolean}
 */
org.jboss.search.page.SearchPage.prototype.isDateFilterExpanded = function () {
    return !goog.dom.classes.has(this.elements.getDate_filter_body_div(), org.jboss.search.Constants.HIDDEN);
};

/**
 * @private
 * @return {boolean}
 */
org.jboss.search.page.SearchPage.prototype.isProjectFilterExpanded = function () {
    return !goog.dom.classes.has(this.elements.getProject_filter_body_div(), org.jboss.search.Constants.HIDDEN);
};

/**
 * @private
 * @return {boolean}
 */
org.jboss.search.page.SearchPage.prototype.isAuthorFilterExpanded = function () {
    return !goog.dom.classes.has(this.elements.getAuthor_filter_body_div(), org.jboss.search.Constants.HIDDEN);
};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.expandDateFilter = function () {

    goog.dom.classes.add(this.elements.getDate_filter_tab_div(), org.jboss.search.Constants.SELECTED);
    goog.dom.classes.remove(this.elements.getProject_filter_tab_div(), org.jboss.search.Constants.SELECTED);
    goog.dom.classes.remove(this.elements.getAuthor_filter_tab_div(), org.jboss.search.Constants.SELECTED);

    goog.dom.classes.remove(this.elements.getDate_filter_body_div(), org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.add(this.elements.getProject_filter_body_div(), org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.add(this.elements.getAuthor_filter_body_div(), org.jboss.search.Constants.HIDDEN);

    this.elements.getProject_filter_query_field().blur();
    this.elements.getAuthor_filter_query_field().blur();
};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.expandAuthorFilter = function () {

    goog.dom.classes.remove(this.elements.getDate_filter_tab_div(), org.jboss.search.Constants.SELECTED);
    goog.dom.classes.remove(this.elements.getProject_filter_tab_div(), org.jboss.search.Constants.SELECTED);
    goog.dom.classes.add(this.elements.getAuthor_filter_tab_div(), org.jboss.search.Constants.SELECTED);

    goog.dom.classes.add(this.elements.getDate_filter_body_div(), org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.add(this.elements.getProject_filter_body_div(), org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.remove(this.elements.getAuthor_filter_body_div(), org.jboss.search.Constants.HIDDEN);

    this.elements.getProject_filter_query_field().blur();
    this.elements.getAuthor_filter_query_field().focus();
};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.expandProjectFilter = function () {

    goog.dom.classes.remove(this.elements.getDate_filter_tab_div(), org.jboss.search.Constants.SELECTED);
    goog.dom.classes.add(this.elements.getProject_filter_tab_div(), org.jboss.search.Constants.SELECTED);
    goog.dom.classes.remove(this.elements.getAuthor_filter_tab_div(), org.jboss.search.Constants.SELECTED);

    goog.dom.classes.remove(this.elements.getProject_filter_body_div(), org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.add(this.elements.getDate_filter_body_div(), org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.add(this.elements.getAuthor_filter_body_div(), org.jboss.search.Constants.HIDDEN);

    this.elements.getProject_filter_query_field().focus();
    this.elements.getAuthor_filter_query_field().blur();
};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.collapseDateFilter = function () {
    goog.dom.classes.remove(this.elements.getDate_filter_tab_div(), org.jboss.search.Constants.SELECTED);
    goog.dom.classes.add(this.elements.getDate_filter_body_div(), org.jboss.search.Constants.HIDDEN);
    // blur not needed now
};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.collapseProjectFilter = function () {
    goog.dom.classes.remove(this.elements.getProject_filter_tab_div(), org.jboss.search.Constants.SELECTED);
    goog.dom.classes.add(this.elements.getProject_filter_body_div(), org.jboss.search.Constants.HIDDEN);
    this.elements.getProject_filter_query_field().blur();
};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.collapseAuthorFilter = function () {
    goog.dom.classes.remove(this.elements.getAuthor_filter_tab_div(), org.jboss.search.Constants.SELECTED);
    goog.dom.classes.add(this.elements.getAuthor_filter_body_div(), org.jboss.search.Constants.HIDDEN);
    this.elements.getAuthor_filter_query_field().blur();
};

/**
 * Collapse all filter tabs.
 * @private
 */
org.jboss.search.page.SearchPage.prototype.collapseAllFilters = function() {
    if (this.isAuthorFilterExpanded()) this.collapseAuthorFilter();
    if (this.isProjectFilterExpanded()) this.collapseProjectFilter();
    if (this.isDateFilterExpanded()) this.collapseDateFilter();
};