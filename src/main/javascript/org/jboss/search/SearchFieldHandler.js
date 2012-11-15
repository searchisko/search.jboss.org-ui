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
 * @fileoverview Encapsulates functionality around the search field.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.SearchFieldHandler');

goog.require('goog.async.Delay');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.InputHandler');

goog.require('goog.debug.Logger');

/**
 * Creates a new search field handler.
 *
 * @param {!HTMLInputElement} field Input field
 * @param {number} callbackDelay Delay in ms to call the callback
 * @param {!Function} callback what should happen after the delay
 * @param {!Function} blurHandler what should happen on BLUR event
 * @param {Object.<goog.events.KeyCodes, Function>} keyHandlers user defined functions per keyCode
 * @constructor
 */
org.jboss.search.SearchFieldHandler = function(field, callbackDelay, callback, blurHandler, keyHandlers) {

    var log = goog.debug.Logger.getLogger('SearchFieldHandler [' + field.id + ']');

    var delay =  new goog.async.Delay(
        function() { callback(field.value); },
        callbackDelay
    );

    var keyHandler = new goog.events.KeyHandler(field);

    // listen for key strokes
    var keyListenerId = goog.events.listen(keyHandler,
        goog.events.KeyHandler.EventType.KEY,
        function(/** @type {goog.events.Event} */ e) {

            var keyEvent = /** @type {goog.events.KeyEvent} */ (e);
            log.finest("keyEvent: " + goog.debug.expose(keyEvent));


            if (keyHandlers && keyHandlers[keyEvent.keyCode]) {
                log.info("keyEvent - custom handling");
                keyHandlers[keyEvent.keyCode](e, delay);
            }
            else if (goog.events.KeyCodes.isTextModifyingKeyEvent(e)) {
                log.info("keyEvent - TextModifyingKeyEvent");
                delay.start();
//                e.stopPropagation();
            } else {
                log.info("keyEvent - ignored");
                // ignore...
            }
        });

    goog.events.listen(field,
        goog.events.EventType.BLUR,
        function(e) {
            blurHandler();
        }
    );

    var inputHandler = new goog.events.InputHandler(field);

    // listen to content changes
    var changeListenerId = goog.events.listen(inputHandler,
        goog.events.EventType.INPUT,
        function(e) {

//            log.info("Field suddenly changed to: " + goog.debug.expose(e));
            log.info("Field suddenly changed");
            delay.start();

        });
};

///** @type {goog.async.Delay} */
//org.jboss.search.SearchFieldHandler.prototype.delay = null;

/**
 * Stops and clear internal delay.
 */
//org.jboss.search.SearchFieldHandler.dispose = function() {
//    this.delay.stop();
//};

// Just a dummy block to prevent issue with joining two scripts
// where one ends with comments and second starts with comments.
{};