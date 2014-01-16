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

goog.require('org.jboss.search.page.element.Status');

goog.require('goog.dom');

goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.jsunit');

// ---- taken from continuationtestcase_test.html
var original_timeout = goog.testing.ContinuationTestCase.MAX_TIMEOUT;
goog.testing.ContinuationTestCase.MAX_TIMEOUT = 20 * 1000; // prolong default timeout

var testCase = new goog.testing.ContinuationTestCase('Continuation Test Case');
testCase.autoDiscoverTests();

// Standalone Closure Test Runner.
if (typeof G_testRunner != 'undefined') {
    G_testRunner.initialize(testCase);
}

var div;

var setUp = function() {
    div = goog.dom.createElement('div');
    goog.dom.setProperties(div,{ 'id': 'status_window'});
    var container = goog.dom.getElement('body');
    if (goog.isDefAndNotNull(container)) {
        // if running in browser append element to the body so we can actually see it
        goog.dom.append(container, [div]);
    }
}

var tearDown = function() {
    goog.dom.removeNode(div);
};

function testStatus() {

    setUp();

    var status =new  org.jboss.search.page.element.Status(div, 5);

    assertTrue(status != null);

    var status1 = 'Loading...';
    var status2 = 'Initialization...';

    status.show(status1);

    var interval = 300;
    var iv = setInterval(function(){
        status.increaseProgress();
    },300);
    var animationFinished = false;
    var testCheck = false;

    setInterval(function(){ testCheck = true }, ((1/0.2)*interval)+interval+100 /* 100 = safety */);

    /*
    waifForCondition(
        function(){
            return false;
            return status != null && status.getProgressValue() > 0.5 && status.getStatus() == status1
        },
        function() {
            status.setStatus(status2);
        }
    );
    */

    waitForCondition(
        function(){
            if (status != null && status.getProgressValue() > 0.5 && status.getStatus() == status1) {
                return true;
            } else {
                return false;
            }
        },
        function(){
            if (status != null) {
                status.setStatus(status2);
            }
        }
    );

    waitForCondition(
        function() { return status.getProgressValue() == 1 },
        function() {
            assertEquals(status2, status.getStatus());
            clearInterval(iv);
            setTimeout(function(){
                animationFinished = true;
                status.hide();
                status.dispose();
            }, interval);
        }
    );

    waitForCondition(
        function() { return animationFinished },
        function() {
            assertTrue(status.isDisposed());
            assertEquals('parent div is empty',0, goog.dom.getChildren(div).length);
        }
    );

    // if any of the previous checks haven't been tested yet this will catch it
    waitForCondition(
        function() { return testCheck },
        function () {
            assertTrue(animationFinished);
            assertTrue(status.isDisposed());

            // set timeout to original value (in case more tests are run in one session)
            goog.testing.ContinuationTestCase.MAX_TIMEOUT = original_timeout;
        }
    );

};