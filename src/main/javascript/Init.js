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

goog.provide('Init');

goog.require('org.jboss.search.SearchFieldHandler');
goog.require('org.jboss.search.suggestions.templates');
goog.require('org.jboss.search.client.Client');

goog.require('goog.array');

goog.require('goog.events');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.events.EventType');

goog.require('goog.dom');
goog.require('goog.dom.classes');

goog.require('goog.debug.Logger');

/**
 * @fileoverview Initialization of the Search UI.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
{
    var log = goog.debug.Logger.getLogger('init');

    var query_field = /** @type {!HTMLInputElement} */ goog.dom.getElement('query_field');
    var query_suggestions_div = /** @type {!HTMLInputElement} */ goog.dom.getElement('search_suggestions');

    var client = new org.jboss.search.client.Client();

    /**
     *
     * @param data {!Object}
     * @return {String}
     */
    var generateSuggestionsHTML = function(data) {
        var html = "";
        if (data && /** @type {!Array.<Object>} */ data.sections) {
            goog.array.forEach(data.sections, function(section){
                html += org.jboss.search.suggestions.templates.suggestions_section(section);
            });
        }
        return html;
    };

    var callback = function(query_string) {
        query_suggestions_div.innerHTML = "";
        var suggestions = client.getSearchSuggestions(query_string);
        if (suggestions.sections) {
            query_suggestions_div.innerHTML = generateSuggestionsHTML(suggestions);
            goog.dom.classes.remove(query_suggestions_div, 'hidden');
        } else {
            goog.dom.classes.add(query_suggestions_div, 'hidden');
        }

    };

    // prepare keyHandlers for the main search field
    var keyHandlers = {};

    keyHandlers[goog.events.KeyCodes.ESC] = function(/** @type {goog.events.KeyEvent} */ event, /** @type {goog.async.Delay} */ delay) {
        delay.stop();
        goog.dom.classes.add(query_suggestions_div, 'hidden');
        query_suggestions_div.innerHTML = "";
    };

    keyHandlers[goog.events.KeyCodes.UP] = function(/** @type {goog.events.KeyEvent} */ event, /** @type {goog.async.Delay} */ delay) {
        event.preventDefault();
    };

    keyHandlers[goog.events.KeyCodes.DOWN] = function(/** @type {goog.events.KeyEvent} */ event, /** @type {goog.async.Delay} */ delay) {
        event.preventDefault();
    };

    keyHandlers[goog.events.KeyCodes.RIGHT] = function(/** @type {goog.events.KeyEvent} */ event, /** @type {goog.async.Delay} */ delay) {
        // will do something later...
    };

    // TAB key does not seem to yield true in @see {goog.events.KeyCodes.isTextModifyingKeyEvent}
    // thus we have to handle it
    keyHandlers[goog.events.KeyCodes.TAB] = function(/** @type {goog.events.KeyEvent} */ event, /** @type {goog.async.Delay} */ delay) {
        delay.stop();
        goog.dom.classes.add(query_suggestions_div, 'hidden');
        query_suggestions_div.innerHTML = "";
    };

    keyHandlers[goog.events.KeyCodes.ENTER] = function(/** @type {goog.events.KeyEvent} */ event, /** @type {goog.async.Delay} */ delay) {
        // just fake for now...
        goog.dom.classes.add(query_suggestions_div, 'hidden');
        query_suggestions_div.innerHTML = "";
        event.preventDefault();
    };

    var blurHandler = function() {
        log.info("BLUR happend!");
        goog.dom.classes.add(query_suggestions_div, 'hidden');
        query_suggestions_div.innerHTML = "";
    };

    var fieldHandled = new org.jboss.search.SearchFieldHandler(query_field, 600, callback, blurHandler, keyHandlers);

    // quick hack to hide suggestions when clicked away
//    goog.events.listen(document, goog.events.EventType.CLICK, function(e){
//        log.info("document was clicked");
//        goog.dom.classes.add(query_suggestions, 'hidden');
//    });

}
