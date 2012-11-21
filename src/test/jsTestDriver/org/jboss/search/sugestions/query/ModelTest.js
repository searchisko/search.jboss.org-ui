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

goog.provide("test.org.jboss.search.suggestions.query.ModelTest");

goog.require('org.jboss.search.suggestions.query.Model');
goog.require('org.jboss.search.suggestions.query.Search');
goog.require('org.jboss.search.suggestions.query.Suggestion');

TestCase('ModelTest', {

    testSeachModel: function() {

        var model = new org.jboss.search.suggestions.query.Model();

        // query is empty string after initialization
        assertEquals("Should be empty", "", model.getSearch().query_string);

        var source = { foo : { bar : { } } };
        model.update(source);

        // query is empty if source does not follow expected taxonomy
        assertEquals("Should be empty", "", model.getSearch().query_string);

        var source = {
            search : {
                search : { query : "Hello"}
            }
        };
        model.update(source);

        // query is extracted correctly
        assertEquals("Should be 'Hello'", "Hello", model.getSearch().query_string);

    }
});