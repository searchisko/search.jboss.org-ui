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

goog.provide("org.jboss.search.gui.test.SearchFieldHandlerTest");

goog.require('goog.testing.events');

//TestCase('SearchFieldHandlerTest', {
AsyncTestCase('SearchFieldHandlerTest', {

    /*
    testHandler : function() {

        var searchField = document.getElementById('search_field');
        assertNotNull(searchField);

        var delay = 10; //ms

        // this callback function is passed field content after specific delay
        var callback = function(value) {
            console.log(value);
        };

        var handler = new org.jboss.search.SearchFieldHandler(searchField, delay, callback);

        assertNotNull("Can not be null", handler);

        // now fire some keystrokes
        goog.testing.events.fireKeySequence(searchField, goog.events.KeyCodes.A);

    },
    */

    testAsyncHandler : function(queue) {

        /*:DOC += <input type="text" id="search_field"/> */

        var searchField = document.getElementById('search_field');
        var delay = 10; //ms
        var callbackCount = 0;

        // this callback function is passed field content after specific delay
        var callback = function(value) {
            console.log("value: ", value);
            callbackCount++;
        };

        var handler = new org.jboss.search.SearchFieldHandler(searchField, delay, callback);

        queue.call('Step 1: Fire an keystroke', function(callbacks) {

            console.log("Step 1");

            assertNotNull(searchField);
            assertNotNull(handler);

            // now fire some keystrokes
            goog.testing.events.fireKeySequence(searchField, goog.events.KeyCodes.A);

            var wait = callbacks.add(function(){
                assertEquals(1, callbackCount)
            });
            window.setTimeout(wait, delay);

        });

        queue.call('Step 2: Change content of the field', function(callbacks) {

            console.log("Step 2");

            assertNotNull(searchField);
            assertNotNull(handler);

            $(searchField).val("Ahoj");
            $(searchField).change();

            wait = callbacks.add(function(){
                assertEquals(1, callbackCount)
            });
            window.setTimeout(wait, delay+2020);

        });
    }
});
