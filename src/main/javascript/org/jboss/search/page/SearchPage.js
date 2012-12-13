/*
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

/**
 *  @fileoverview Object represents the main search page.
 *
 *  @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.SearchPage');

goog.require('org.jboss.search.Constants');
goog.require('org.jboss.search.SearchFieldHandler');
goog.require('org.jboss.search.suggestions.query.view.View');
goog.require('org.jboss.search.suggestions.event.EventType');

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
 * @param {!HTMLInputElement} query_field
 * @param {!HTMLDivElement} spinner_div
 * @param {!HTMLDivElement} clear_query_div
 * @param {!HTMLDivElement} query_suggestions_div
 * @param {!HTMLDivElement} date_filter_tab_div
 * @param {!HTMLDivElement} author_filter_tab_div
 * @param {!HTMLDivElement} project_filter_tab_div
 * @param {!HTMLDivElement} date_filter_body_div
 * @param {!HTMLDivElement} project_filter_body_div
 * @param {!HTMLDivElement} author_filter_body_div
 * @param {!HTMLInputElement} project_filter_query_field
 * @param {!HTMLInputElement} author_filter_query_field
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.SearchPage = function(
        xhrManager,
        context,
        querySelected,
        query_field, spinner_div, clear_query_div, query_suggestions_div,
        date_filter_tab_div, author_filter_tab_div, project_filter_tab_div,
        date_filter_body_div, project_filter_body_div, author_filter_body_div,
        project_filter_query_field, author_filter_query_field
    ) {

    goog.events.EventTarget.call(this);

    var thiz_ = this;

    /** @private */ this.log = goog.debug.Logger.getLogger('SearchPage');

    /** @private */ this.xhrManager = xhrManager;
    /** @private */ this.context = context;
    /** @private */ this.querySelected = querySelected;

    /** @private */ this.query_field = query_field;
    /** @private */ this.spinner_div = spinner_div;
    /** @private */ this.clear_query_div = clear_query_div;
    /** @private */ this.query_suggestions_div = query_suggestions_div;

    /** @private */ this.date_filter_body_div = date_filter_body_div;
    /** @private */ this.project_filter_body_div = project_filter_body_div;
    /** @private */ this.author_filter_body_div = author_filter_body_div;

    /** @private */ this.date_filter_tab_div = date_filter_tab_div;
    /** @private */ this.author_filter_tab_div = author_filter_tab_div;
    /** @private */ this.project_filter_tab_div = project_filter_tab_div;

    /** @private */ this.project_filter_query_field = project_filter_query_field;
    /** @private */ this.author_filter_query_field = author_filter_query_field;

    /** @private */ this.query_suggestions_view = new org.jboss.search.suggestions.query.view.View(this.query_suggestions_div);
    /** @private */ this.query_suggestions_model = {};

    /**
     * @private
     * @type {goog.Uri}
     */
    this.suggestionsUri = goog.Uri.parse(org.jboss.search.Constants.API_URL_SUGGESTIONS_QUERY);

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
            thiz_.query_field.focus();

            (function(selectedIndex) {
                // TODO get query_string from model at the selectedIndex position
                thiz_.querySelected("option was selected by pointer (index: "+selectedIndex+")");

            })(selectedIndex);
        }
    );

    var callback = function(query_string) {

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
                thiz_.suggestionsUri.setParameterValue("q",query_string).toString(),
                org.jboss.search.Constants.GET,
                "", // post_data
                {}, // headers_map
                org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_PRIORITY,

                // callback, The only param is the event object from the COMPLETE event.
                function(e) {
                    var event = /** @type goog.net.XhrManager.Event */ e;
                    var response = event.target.getResponseJson();

                    // TODO: temporary - for now replace token with actual query string
                    response.view.search.options[0] = query_string;
                    response.model.search.search.query = query_string;

                    var model = /** @type {!Object} */ (goog.object.get(response, "model", {}));
                    thiz_.query_suggestions_model = thiz_.parseQuerySuggestionsModel(model);

                    if (goog.object.containsKey(response, "view")) {
                        var view = /** @type {!Object} */ (goog.object.get(response, "view", {}));

                        thiz_.query_suggestions_view.update(view);
                        thiz_.query_suggestions_view.show();

                    } else {
                        thiz_.hideAndCleanSuggestionsElementAndModel();
                    }

                }
            );
        }
    };

    /** @private */
    this.dateClickListenerId_ = goog.events.listen(this.date_filter_tab_div,
        goog.events.EventType.CLICK,
        function() {
            thiz_.isDateFilterVisible() ? thiz_.hideDateFilter() : thiz_.showDateFilter()
        }
    );

    /** @private */
    this.projectClickListenerId_ = goog.events.listen(this.project_filter_tab_div,
        goog.events.EventType.CLICK,
        function() {
            thiz_.isProjectFilterVisible() ? thiz_.hideProjectFilter() : thiz_.showProjectFilter()
        }
    );

    /** @private */
    this.authorClickListenerId_ = goog.events.listen(this.author_filter_tab_div,
        goog.events.EventType.CLICK,
        function() {
            thiz_.isAuthorFilterVisible() ? thiz_.hideAuthorFilter() : thiz_.showAuthorFilter()
        }
    );

    /** @private */
    this.contextClickListenerId_ = goog.events.listen(
        thiz_.context,
        goog.events.EventType.CLICK,
        function(/** @type {goog.events.Event} */ e) {

//            log.info("Context clicked: " + goog.debug.expose(e));

            // if search field is clicked then do not hide search suggestions
            if (e.target !== thiz_.query_field) {
                thiz_.hideAndCleanSuggestionsElementAndModel();
            }

            // if date filter (sub)element is clicked do not hide date filter
            if (e.target !== thiz_.date_filter_tab_div &&
                !goog.dom.contains(thiz_.date_filter_body_div, e.target)) {
                thiz_.hideDateFilter();
            }

            // if project filter (sub)element is clicked do not hide project filter
            if (e.target !== thiz_.project_filter_tab_div &&
                !goog.dom.contains(thiz_.project_filter_body_div, e.target)) {
                thiz_.hideProjectFilter();
            }

            // if author filter (sub)element is clicked do not hide author filter
            if (e.target !== thiz_.author_filter_tab_div &&
                !goog.dom.contains(thiz_.author_filter_body_div, e.target)) {
                thiz_.hideAuthorFilter();
            }

        });

    /** @private */
    this.userQuerySearchField = new org.jboss.search.SearchFieldHandler(query_field, 100, callback, null, this.getPresetKeyHandlers());

};

goog.inherits(org.jboss.search.page.SearchPage, goog.events.EventTarget);

/** @inheritDoc */
org.jboss.search.page.SearchPage.prototype.disposeInternal = function() {

    // Call the superclass's disposeInternal() method.
    org.jboss.search.page.SearchPage.superClass_.disposeInternal.call(this);

    // Dispose of all Disposable objects owned by this class.
    goog.dispose(this.userQuerySearchField);
    goog.dispose(this.query_suggestions_view);

    // Remove listeners added by this class.
    goog.events.unlistenByKey(this.dateClickListenerId_);
    goog.events.unlistenByKey(this.projectClickListenerId_);
    goog.events.unlistenByKey(this.authorClickListenerId_);
    goog.events.unlistenByKey(this.contextClickListenerId_);
    goog.events.unlistenByKey(this.xhrReadyListenerId_);
    goog.events.unlistenByKey(this.xhrCompleteListenerId_);
    goog.events.unlistenByKey(this.xhrErrorListenerId_);
    goog.events.unlistenByKey(this.xhrAbortListenerId_);

    // Remove references to COM objects.

    // Remove references to DOM nodes, which are COM objects in IE.
    delete this.log;

    delete this.xhrManager;
    delete this.context;
    delete this.querySelected;

    delete this.query_field;
    delete this.spinner_div;
    delete this.clear_query_div;
    delete this.query_suggestions_div;

    delete this.date_filter_body_div;
    delete this.project_filter_body_div;
    delete this.author_filter_body_div;

    delete this.date_filter_tab_div;
    delete this.author_filter_tab_div;
    delete this.project_filter_tab_div;

    delete this.project_filter_query_field;
    delete this.author_filter_query_field;

    delete this.suggestionsUri;

    delete this.query_suggestions_model;

};

/**
 * Set value of query field.
 * @param {?string} query
 */
org.jboss.search.page.SearchPage.prototype.setUserQuery = function(query) {

    var newValue = "";
    if (!goog.string.isEmptySafe(query)) {
        newValue = query.trim();
    }

    this.query_field.value = newValue;

};

/**
 * Set user query and execute the query.
 * @param {?string} query
 */
org.jboss.search.page.SearchPage.prototype.runSearch = function(query) {

    this.setUserQuery(query);

    // TODO run the search...
    this.log.info("Run search for [" + query + "]");
};

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
            // TODO get query_string from model at the selectedIndex position
            thiz_.querySelected("option was selected by keys (index: "+selectedIndex+")");

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
org.jboss.search.page.SearchPage.prototype.isDateFilterVisible = function() {
    return !goog.dom.classes.has(this.date_filter_body_div, org.jboss.search.Constants.HIDDEN);
};

/**
 * @private
 * @return {boolean}
 */
org.jboss.search.page.SearchPage.prototype.isProjectFilterVisible = function() {
    return !goog.dom.classes.has(this.project_filter_body_div, org.jboss.search.Constants.HIDDEN);
};

/**
 * @private
 * @return {boolean}
 */
org.jboss.search.page.SearchPage.prototype.isAuthorFilterVisible = function() {
    return !goog.dom.classes.has(this.author_filter_body_div, org.jboss.search.Constants.HIDDEN);
};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.showDateFilter = function() {

    goog.dom.classes.add(this.date_filter_tab_div, org.jboss.search.Constants.SELECTED);
    goog.dom.classes.remove(this.project_filter_tab_div, org.jboss.search.Constants.SELECTED);
    goog.dom.classes.remove(this.author_filter_tab_div, org.jboss.search.Constants.SELECTED);

    goog.dom.classes.remove(this.date_filter_body_div, org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.add(this.project_filter_body_div, org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.add(this.author_filter_body_div, org.jboss.search.Constants.HIDDEN);

    this.project_filter_query_field.blur();
    this.author_filter_query_field.blur();

};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.showAuthorFilter = function() {

    goog.dom.classes.remove(this.date_filter_tab_div, org.jboss.search.Constants.SELECTED);
    goog.dom.classes.remove(this.project_filter_tab_div, org.jboss.search.Constants.SELECTED);
    goog.dom.classes.add(this.author_filter_tab_div, org.jboss.search.Constants.SELECTED);

    goog.dom.classes.add(this.date_filter_body_div, org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.add(this.project_filter_body_div, org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.remove(this.author_filter_body_div, org.jboss.search.Constants.HIDDEN);

    this.project_filter_query_field.blur();
    this.author_filter_query_field.focus();

};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.showProjectFilter = function() {

    goog.dom.classes.remove(this.date_filter_tab_div, org.jboss.search.Constants.SELECTED);
    goog.dom.classes.add(this.project_filter_tab_div, org.jboss.search.Constants.SELECTED);
    goog.dom.classes.remove(this.author_filter_tab_div, org.jboss.search.Constants.SELECTED);

    goog.dom.classes.remove(this.project_filter_body_div, org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.add(this.date_filter_body_div, org.jboss.search.Constants.HIDDEN);
    goog.dom.classes.add(this.author_filter_body_div, org.jboss.search.Constants.HIDDEN);

    this.project_filter_query_field.focus();
    this.author_filter_query_field.blur();

};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.hideDateFilter = function() {

    goog.dom.classes.remove(this.date_filter_tab_div, org.jboss.search.Constants.SELECTED);
    goog.dom.classes.add(this.date_filter_body_div, org.jboss.search.Constants.HIDDEN);
    // blur not needed now
};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.hideProjectFilter = function() {

    goog.dom.classes.remove(this.project_filter_tab_div, org.jboss.search.Constants.SELECTED);
    goog.dom.classes.add(this.project_filter_body_div, org.jboss.search.Constants.HIDDEN);
    this.project_filter_query_field.blur();

};

/**
 * @private
 */
org.jboss.search.page.SearchPage.prototype.hideAuthorFilter = function() {

    goog.dom.classes.remove(this.author_filter_tab_div, org.jboss.search.Constants.SELECTED);
    goog.dom.classes.add(this.author_filter_body_div, org.jboss.search.Constants.HIDDEN);
    this.author_filter_query_field.blur();

};