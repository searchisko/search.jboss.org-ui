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

goog.require('org.jboss.search.SearchFieldHandler');
goog.require('org.jboss.search.suggestions.query.view.View');

goog.require('goog.array');

goog.require('goog.events');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.events.EventType');

goog.require('goog.dom');
goog.require('goog.dom.classes');

goog.require('goog.object');

goog.require('goog.string');

goog.require('goog.net.XhrManager');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.net.XhrManager.Request');

goog.require('goog.debug.Logger');

goog.require('goog.Uri');

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
    // Constants
    // ================================================================

    /**
     * Used as an identified to abort or/and send the search suggestions request.
     * @type {string}
     * @const
     */
    var SEARCH_SUGGESTIONS_REQUEST_ID = "1";

    /**
     * Priority of search suggestions requests. If should be higher then search requests.
     * @type {number}
     * @const
     */
    var SEARCH_SUGGESTIONS_REQUEST_PRIORITY = 10;

    /**
     * Used as an identified to abort or/and send the search results request.
     * @type {string}
     * @const
     */
    var SEARCH_RESULTS_REQUEST_ID = "2";

    /**
     * Temporary: URL of Apiary Mock Server
     * @type {string}
     * @const
     */
    var API_URL_SUGGESTIONS_QUERY = "http://private-5ebf-jbossorg.apiary.io/v1/rest/suggestions/query_string";

    // ================================================================
    // Get necessary HTML elements
    // ================================================================

    var query_field = /** @type {!HTMLInputElement} */ goog.dom.getElement('query_field');
    var query_suggestions_div = /** @type {!HTMLDivElement} */ goog.dom.getElement('search_suggestions');

    var date_filter_tab_div    = /** @type {!HTMLDivElement} */ goog.dom.getElement('date_filter');
    var project_filter_tab_div = /** @type {!HTMLDivElement} */ goog.dom.getElement('project_filter');
    var author_filter_tab_div  = /** @type {!HTMLDivElement} */ goog.dom.getElement('author_filter');

    var project_filter_query_field = /** @type {!HTMLInputElement} */ goog.dom.getElement('project_filter_query_field');
    var author_filter_query_field = /** @type {!HTMLInputElement} */ goog.dom.getElement('author_filter_query_field');

    // ================================================================
    // Define internal variables and objects
    // ================================================================

    /** @type {HTMLDivElement} */
    var selected_filter_tab_div = null;

    var query_suggestions_view = new org.jboss.search.suggestions.query.view.View(query_suggestions_div);
    var query_suggestions_model = {};

    /** @type {goog.net.XhrManager} */
    var xhrManager = new goog.net.XhrManager();

    /**
     * Hide and clean suggestions element and empty the model.
     */
    var hideAndCleanSuggestionsElementAndModel = function() {
        xhrManager.abort(SEARCH_SUGGESTIONS_REQUEST_ID, true);
        query_suggestions_view.hide();
        query_suggestions_model = {};
    };

    query_suggestions_view.setClickCallbackFunction(
        function() {
            hideAndCleanSuggestionsElementAndModel();
            query_field.focus();
        }
    );

    /**
     * TODO: TBD
     * @param {!Object} model
     * @return {!Object}
     */
    var parseQuerySuggestionsModel = function(model) {
        return model;
    }

    /**
     * @type {goog.Uri}
     */
    var suggestionsUri = goog.Uri.parse(API_URL_SUGGESTIONS_QUERY);

    var callback = function(query_string) {

        if (goog.string.isEmptySafe(query_string)) {

            hideAndCleanSuggestionsElementAndModel();

        } else {

            xhrManager.abort(SEARCH_SUGGESTIONS_REQUEST_ID, true);
            xhrManager.send(
                SEARCH_SUGGESTIONS_REQUEST_ID,
//                "../../test/resources/suggestions_response.json",
                // setting the parameter value clears previously set value (that is what we want!)
                suggestionsUri.setParameterValue("q",query_string).toString(),
                "GET",
                "", // post_data
                {}, // headers_map
                SEARCH_SUGGESTIONS_REQUEST_PRIORITY,

                // callback, The only param is the event object from the COMPLETE event.
                function(e) {
                    var event = /** @type goog.net.XhrManager.Event */ e;
                    var response = event.target.getResponseJson();

                    // TODO: temporary - for now replace token with actual query string
                    response.view.search.options[0] = query_string;
                    response.model.search.search.query = query_string;

                    var model = /** @type {!Object} */ (goog.object.get(response, "model", {}));
                    query_suggestions_model = parseQuerySuggestionsModel(model);

                    if (goog.object.containsKey(response, "view")) {
                        var view = /** @type {!Object} */ (goog.object.get(response, "view", {}));

                        query_suggestions_view.update(view);
                        query_suggestions_view.show();

                    } else {
                        hideAndCleanSuggestionsElementAndModel();
                    }

                }
            );
        }
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeEscHandler = function(event, delay) {
        delay.stop();
        hideAndCleanSuggestionsElementAndModel();
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeDownHandler = function(event, delay) {
        event.preventDefault();
        if (query_suggestions_view.isVisible()) {
            query_suggestions_view.selectNext();
        }
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeUpHandler = function(event, delay) {
        event.preventDefault();
        if (query_suggestions_view.isVisible()) {
            query_suggestions_view.selectPrevious();
        }
    };

    /**
     * Just generic key handler placeholder.
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
//    var keyCodePreventDefaultHandler = function(event, delay) {
//        event.preventDefault();
//    };

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
        hideAndCleanSuggestionsElementAndModel();
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeEnterHandler = function(event, delay) {
//        just fake for now...
        hideAndCleanSuggestionsElementAndModel();
        event.preventDefault();
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

    var blurHandler = function() {
//        hideAndCleanSuggestionsElementAndModel();
    };

    // Catch click to the top most element
    // TODO: unlisten
    this.documentClickListenerId_ = goog.events.listen(
        goog.getObjectByName('document'),
        goog.events.EventType.CLICK,
        function(/** @type {goog.events.Event} */ e) {
//            log.info("Document clicked: " + goog.debug.expose(e));
            hideAndCleanSuggestionsElementAndModel();
        });

    // TODO: dispose
    var fieldHandled = new org.jboss.search.SearchFieldHandler(query_field, 300, callback, blurHandler, keyHandlers);

    // quick hack to hide suggestions when clicked away
//    goog.events.listen(document, goog.events.EventType.CLICK, function(e){
//        log.info("document was clicked");
//        goog.dom.classes.add(query_suggestions, 'hidden');
//    });


    // TODO: move to different part of the code
    var second_filters_row_div = goog.dom.getElement('second_filters_row');

    var date_filter_div = goog.dom.getElementByClass('date', second_filters_row_div);
    var author_filter_div = goog.dom.getElementByClass('author', second_filters_row_div);
    var project_filter_div = goog.dom.getElementByClass('project', second_filters_row_div);

    var dateClickListenerId_ = goog.events.listen(date_filter_div,
        goog.events.EventType.CLICK,
        function(/** @type {goog.events.Event} */ e) {
            if (goog.dom.classes.has(date_filter_tab_div, 'hidden')) {
                goog.dom.classes.remove(date_filter_tab_div, 'hidden');
            } else {
                goog.dom.classes.add(date_filter_tab_div, 'hidden');
            }
            goog.dom.classes.add(author_filter_tab_div, 'hidden');
            goog.dom.classes.add(project_filter_tab_div, 'hidden');
            project_filter_query_field.blur();
            author_filter_query_field.blur();
        }
    );

    var authorClickListenerId_ = goog.events.listen(author_filter_div,
        goog.events.EventType.CLICK,
        function(/** @type {goog.events.Event} */ e) {
            if (goog.dom.classes.has(author_filter_tab_div, 'hidden')) {
                goog.dom.classes.remove(author_filter_tab_div, 'hidden');
            } else {
                goog.dom.classes.add(author_filter_tab_div, 'hidden');
            }
            goog.dom.classes.add(date_filter_tab_div, 'hidden');
            goog.dom.classes.add(project_filter_tab_div, 'hidden');
            project_filter_query_field.blur();
            author_filter_query_field.focus();
        }
    );

    var projectClickListenerId_ = goog.events.listen(project_filter_div,
        goog.events.EventType.CLICK,
        function(/** @type {goog.events.Event} */ e) {
            if (goog.dom.classes.has(project_filter_tab_div, 'hidden')) {
                goog.dom.classes.remove(project_filter_tab_div, 'hidden');
            } else {
                goog.dom.classes.add(project_filter_tab_div, 'hidden');
            }
            goog.dom.classes.add(date_filter_tab_div, 'hidden');
            goog.dom.classes.add(author_filter_tab_div, 'hidden');
            project_filter_query_field.focus();
            author_filter_query_field.blur();
        }
    );
}
