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

goog.require('goog.array');
goog.require('goog.json');
goog.require('goog.async.Deferred');
goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.jsunit');


var testCase = new goog.testing.ContinuationTestCase('Continuation Test Case');
testCase.autoDiscoverTests();

// Standalone Closure Test Runner.
if (typeof G_testRunner != 'undefined') {
    G_testRunner.initialize(testCase);
}

var sample_response_data = {
    "uuid":"3bbc2b06-fb01-47f3-a8cf-fd0bac0f80d6",
    "took":112,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},
    "hits":{
        "total":108,"max_score":1.0,
        "hits":[
            {"_index":"data_project_info","_type":"jbossorg_project_info","_id":"jbossorg_project_info-jbosscache","_score":1.0,"fields":{"dcp_project":"cdi","dcp_project_name":"CDI","dcp_type":"project_info"}},
            {"_index":"data_project_info","_type":"jbossorg_project_info","_id":"jbossorg_project_info-jbosscache","_score":1.0,"fields":{"dcp_project":"jrunit","dcp_project_name":"","dcp_type":"project_info"}},
            {"_index":"data_project_info","_type":"jbossorg_project_info","_id":"jbossorg_project_info-jbosscache","_score":1.0,"fields":{"dcp_project":"jbosscache","dcp_project_name":"JBoss Cache","dcp_type":"project_info"}},
            {"_index":"data_project_info","_type":"jbossorg_project_info","_id":"jbossorg_project_info-jbossesb","_score":1.0,"fields":{"dcp_project":"jbossesb","dcp_project_name":"JBoss ESB","dcp_type":"project_info"}},
            {"_index":"data_project_info","_type":"jbossorg_project_info","_id":"jbossorg_project_info-jbossforums","_score":1.0,"fields":{"dcp_project":"jbossforums","dcp_project_name":"JBoss Forums","dcp_type":"project_info"}},
            {"_index":"data_project_info","_type":"jbossorg_project_info","_id":"jbossorg_project_info-jbossidentity","_score":1.0,"fields":{"dcp_project":"jbossidentity","dcp_project_name":"JBoss Identity","dcp_type":"project_info"}}
        ]}};

function testProject() {

    var json = sample_response_data;

    var deferred = new goog.async.Deferred();
    var project = new org.jboss.search.list.project.Project(deferred);

    project
        .addCallback(function(){

            // data available now
            assertEquals('CDI', project.getDcpProjectName('cdi'));
            assertEquals('jrunit does not have name', '', project.getDcpProjectName('jrunit'));

            // we can also get all the values as an array (used for initialization)
            var array = project.getArray();
            assertEquals(6, array.length);
            assertTrue(
                goog.array.some(array, function(element) {
                    return (element.name == 'JBoss Cache' && element.code == 'jbosscache') ? true : false;
                })
            );
            assertTrue(
                goog.array.some(array, function(element) {
                    return (element.name == 'JBoss Identity' && element.code == 'jbossidentity') ? true : false;
                })
            );
            // when getArray() is used then entities with missing name value are sanitized
            assertTrue(
                goog.array.some(array, function(element) {
                    return (element.name == 'jrunit' && element.code == 'jrunit') ? true : false;
                })
            );
        });

    setTimeout(function(){deferred.callback(json)}, 20);

    waitForCondition(
        function() {
            return project.hasFired();
        },
        function() {
            // noop, tests happen in project.addCallback()
        }
    );

};