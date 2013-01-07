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

goog.provide("test.org.jboss.search.util.FragmentParserTest");

goog.require('org.jboss.search.util.FragmentParser');

TestCase('FragmentParserTest', {

    testQueryParser: function() {

        var fp = new org.jboss.search.util.FragmentParser();

        assertEquals("Works for undefined", undefined, fp.getUserQuery());
        assertEquals("Works for null", undefined, fp.getUserQuery(null));
        assertEquals("Query part not present", undefined, fp.getUserQuery("1&2&3&x=foo"));
        assertEquals("Takes the first 'q' value", "first", fp.getUserQuery("1&2&3&x=foo&q=first&q=second"));
        assertEquals("Case insensitive 'Q' value", "first", fp.getUserQuery("1&2&3&x=foo&Q=first&q=second"));

        // let's test just spaces and question marks, testing diacritics is possible once
        // http://code.google.com/p/js-test-driver/issues/detail?id=85 is fixed in jsTestDriver
        assertEquals("Value is encoded", "? ? ?", fp.getUserQuery("q=%3F%20%3F%20%3F"));

    }

});