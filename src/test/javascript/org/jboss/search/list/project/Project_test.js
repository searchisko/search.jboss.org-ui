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

goog.require('org.jboss.search.list.project.Project');

goog.require('goog.async.Deferred');
goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.jsunit');


var testCase = new goog.testing.ContinuationTestCase('Continuation Test Case');
testCase.autoDiscoverTests();

// Standalone Closure Test Runner.
if (typeof G_testRunner != 'undefined') {
    G_testRunner.initialize(testCase);
}


function testProject() {

    var deferred = new goog.async.Deferred();
    var project = new org.jboss.search.list.project.Project(deferred);

    project
        .addCallback(function(){
            console.log('data available', project.getMap());
        });

    setTimeout(function(){deferred.callback({sample: "data"})}, 10);

    waitForCondition(
        function() {
            return project.hasFired();
        },
        function() {
            assertTrue(project.hasFired());
            assertEquals('Let\'s check the data', project.getMap().sample, 'data');
        }
    );

};