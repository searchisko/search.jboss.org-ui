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
goog.require('org.jboss.search.suggestions.templates');
//goog.require('org.jboss.search.client.Client');

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

// Added to get rid of advanced compilation errors - Closure dependencies are broken ?
goog.require('goog.Uri');
goog.require('goog.net.XhrLite');

/**
 * @fileoverview Initialization of the Search UI.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
{
    var log = goog.debug.Logger.getLogger('init');

    /**
     * Used as an identified to abort or/and send the search suggestions request.
     * @type {string}
     * @const
     */
    var SEARCH_SUGGESTION_REQUEST_ID = "1";

    /**
     * Used as an identified to abort or/and send the search results request.
     * @type {string}
     * @const
     */
    var SEARCH_RESULTS_REQUEST_ID = "2";

    var query_field = /** @type {!HTMLInputElement} */ goog.dom.getElement('query_field');
    var query_suggestions_div = /** @type {!HTMLDivElement} */ goog.dom.getElement('search_suggestions');
    /** @type {boolean} */
    var query_suggestions_shown = false;
    var query_suggestions_model = {};

    /** @type {number} */
    var selected_option = -1;

    /** @type {goog.net.XhrManager} */
    var xhrManager = new goog.net.XhrManager();

//    var client = new org.jboss.search.client.Client();

    /**
     * Hide and clean suggestions element and empty the model.
     */
    var hideAndCleanSuggestionsElementAndModel = function() {
        xhrManager.abort(SEARCH_SUGGESTION_REQUEST_ID);
        goog.dom.classes.add(query_suggestions_div, 'hidden');
        query_suggestions_div.innerHTML = "";
        query_suggestions_model = {};
        query_suggestions_shown = false;
        selected_option = -1;
    };

    /**
     *
     * @param {!Object} model
     * @return {!Object}
     */
    var parseQuerySuggestionsModel = function(model) {
        return model;
    }

    /**
     * Generate HTML for given query suggestions
     * @param {!Object} view
     * @return {!String}
     */
    var generateQuerySuggestionsHTML = function(view) {
        var html = "";
        goog.array.forEach(goog.object.getValues(view), function(view_section) {
            html += org.jboss.search.suggestions.templates.suggestions_section(view_section);
        });
        return html;
    };

    var callback = function(query_string) {

        if (goog.string.isEmptySafe(query_string)) {

            hideAndCleanSuggestionsElementAndModel();

        } else {

            xhrManager.send(
                SEARCH_SUGGESTION_REQUEST_ID,
                "../../test/resources/suggestions_response.json",
                "GET",
                "", // post_data
                {}, // headers_map
                10, // priority

                // callback, The only param is the event object from the COMPLETE event.
                function(e) {
                    var event = /** @type goog.net.XhrManager.Event */ e;
                    var response = event.target.getResponseJson();

                    // for now replace token with actual query string
                    response.view.search.options[0] = query_string;
                    response.model.search.search.query = query_string;

                    var model = /** @type {!Object} */ (goog.object.get(response, "model", {}));
                    query_suggestions_model = parseQuerySuggestionsModel(model);

                    if (goog.object.containsKey(response, "view")) {
                        var view = /** @type {!Object} */ (goog.object.get(response, "view", {}));
                        query_suggestions_div.innerHTML = generateQuerySuggestionsHTML(view);

                        var selectable_elements = goog.dom.getElementsByClass('selectable', query_suggestions_div);
                        if (selectable_elements.length > 0) {
                            selected_option = 0;
                            goog.dom.classes.add(selectable_elements[selected_option], 'selected');
                        }

                        goog.dom.classes.remove(query_suggestions_div, 'hidden');
                        query_suggestions_shown = true;
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
        if (query_suggestions_shown) {
            var selectable_elements = goog.dom.getElementsByClass('selectable', query_suggestions_div);
            if (selected_option < (selectable_elements.length-1)) {
                if (selected_option > -1) goog.dom.classes.remove(selectable_elements[selected_option], 'selected');
                selected_option += 1;
                goog.dom.classes.add(selectable_elements[selected_option], 'selected');
            }
        }
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeUpHandler = function(event, delay) {
        event.preventDefault();
        if (query_suggestions_shown) {
            var selectable_elements = goog.dom.getElementsByClass('selectable', query_suggestions_div);
            if (selected_option > 0) {
                goog.dom.classes.remove(selectable_elements[selected_option], 'selected');
                selected_option -= 1;
                goog.dom.classes.add(selectable_elements[selected_option], 'selected');
            }
        }
    };

    /**
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
        hideAndCleanSuggestionsElementAndModel();
    };

    var fieldHandled = new org.jboss.search.SearchFieldHandler(query_field, 600, callback, blurHandler, keyHandlers);

    // quick hack to hide suggestions when clicked away
//    goog.events.listen(document, goog.events.EventType.CLICK, function(e){
//        log.info("document was clicked");
//        goog.dom.classes.add(query_suggestions, 'hidden');
//    });

}
