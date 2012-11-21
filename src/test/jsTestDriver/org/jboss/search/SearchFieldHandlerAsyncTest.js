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

goog.provide("test.org.jboss.search.SearchFieldHandlerAsyncTest");

goog.require('goog.testing.events');

AsyncTestCase('SearchFieldHandlerAsyncTest', {

    /**
     * Test that callback function gets called if field value is modified.
     * Also test that if custom handler is defined for specific key then
     * it is called as well.
     *
     * @param queue
     */
    testFieldHandler : function(queue) {

        /*:DOC += <input type="text" id="search_field"/> */

        var searchField = /** @type {!HTMLInputElement} */ document.getElementById('search_field');
        var delay = 10; //ms
        var callbackCount = 0;
        var customKeyHandlerCount = 0;
        var keyHandlers = {};

        /**
         * Defined custom key handler for 'X' keystroke
         * @param {goog.events.KeyEvent} event
         * @param {goog.async.Delay} delay
         */
        keyHandlers[goog.events.KeyCodes.X] = function(event, delay) {
            customKeyHandlerCount++;
        };

        /**
         * Callback is passed value from the field
         * @param {!String} query_string
         */
        var callback = function(query_string) {
            callbackCount++;
        };

        var handler = new org.jboss.search.SearchFieldHandler(searchField, delay, callback, function(){}, keyHandlers);

        queue.call('Step 1: Fire an A keystroke', function(callbacks) {

            assertNotNull(searchField);
            assertNotNull(handler);

            var wait = callbacks.add(function(){
                assertEquals(1, callbackCount);
//                assertEquals("Should be 'A'", "A", valueFromCallback);
            });

            // We must explicitly set the value for the test to work.
//            searchField.value = "A";

            // now fire keystroke
            assertTrue(goog.testing.events.fireKeySequence(searchField, goog.events.KeyCodes.A));

            // right after the keystroke event the callback is not get called
            assertEquals(0, callbackCount);

            // not after some delay test that callback got called
            window.setTimeout(wait, delay);

        });

        queue.call('Step 2: Fire an X keystroke, there is a custom key handler defined for X key', function(callbacks) {

            assertNotNull(searchField);
            assertNotNull(handler);

            var wait = callbacks.add(function(){
                assertEquals(1, callbackCount)
                assertEquals(1, customKeyHandlerCount)
            });

            // now fire keystroke
            assertTrue(goog.testing.events.fireKeySequence(searchField, goog.events.KeyCodes.X));

            // right after the keystroke event the callback is not get called
            assertEquals(1, callbackCount);

            // note  custom handlers are called ASAP (without delay)
            window.setTimeout(wait, 0);

        });

    },

    /**
     * Test SearchFieldHandler goog.Disposable implementation.
     * Once the goog.dispose() is called on it then the callback
     * is not executed.
     *
     * @param queue
     */
    testDispose : function(queue) {

        /*:DOC += <input type="text" id="search_field"/> */

        var searchField = document.getElementById('search_field');
        var delay = 10; //ms
        var callbackCount = 0;

        assertNotNull(searchField);

        /**
         * Callback is passed value from the field
         * @param {!String} query_string
         */
        var callback = function(query_string) {
            callbackCount++;
        };

        var field = new org.jboss.search.SearchFieldHandler(searchField, delay, callback);

        assertNotNull("Can not be null", field);

        goog.dispose(field);

        queue.call('Step 1: Fire an A keystroke', function(callbacks) {

            assertNotNull(searchField);
            assertNotNull(field);

            var wait = callbacks.add(function(){
                assertEquals(0, callbackCount);
            });

            // now fire keystroke
            assertTrue(goog.testing.events.fireKeySequence(searchField, goog.events.KeyCodes.A));

            // right after the keystroke event the callback is not get called
            assertEquals(0, callbackCount);

            // not after some delay test that callback is still NOT called (because of dispose)
            window.setTimeout(wait, delay);
        });
    }
});
