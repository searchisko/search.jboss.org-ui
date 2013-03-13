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

goog.require('org.jboss.search.util.fragmentParser');
goog.require('org.jboss.search.util.fragmentParser.INTERNAL_param');

goog.require('goog.testing.jsunit');

var testFragmentParserForUserQuery = function() {

    var p_ = org.jboss.search.util.fragmentParser.INTERNAL_param;
    var output;

    output = org.jboss.search.util.fragmentParser.parse();
    assertNotNullNorUndefined('Works for undefined input', output);

    output = org.jboss.search.util.fragmentParser.parse(null);
    assertNotNullNorUndefined('Works for null input', output);

    output = org.jboss.search.util.fragmentParser.parse('1&2&3&x=foo');
    assertUndefined('No q parameter', output[p_.QUERY]);

    output = org.jboss.search.util.fragmentParser.parse('q=');
    assertEquals('Empty query', '', output[p_.QUERY]);

    output = org.jboss.search.util.fragmentParser.parse('q=%20%20');
    assertEquals('Still empty query', '', output[p_.QUERY]);

    output = org.jboss.search.util.fragmentParser.parse('1&2&3&x=foo&q=first&q=second');
    assertEquals('The last parameter wins', 'second', output[p_.QUERY]);

    output = org.jboss.search.util.fragmentParser.parse('1&2&3&x=foo&q=first&Q=second');
    assertEquals('Parameter key is case insensitive', 'second', output[p_.QUERY]);

    output = org.jboss.search.util.fragmentParser.parse('q=%3F%20%3F%20%3F');
    assertEquals('Test URL decode', '? ? ?', output[p_.QUERY]);
};

var testFragmentParserForPageValue = function() {

    var p_ = org.jboss.search.util.fragmentParser.INTERNAL_param;
    var output;

    output = org.jboss.search.util.fragmentParser.parse('page=');
    assertUndefined('Works for undefined input', output[p_.PAGE]);

    output = org.jboss.search.util.fragmentParser.parse('page=x');
    assertUndefined('Works for invalid input', output[p_.PAGE]);

    output = org.jboss.search.util.fragmentParser.parse('page=10');
    assertEquals('Works for invalid input', 10, output[p_.PAGE]);
};

var testFragmentParserForLogValue = function() {

    var p_ = org.jboss.search.util.fragmentParser.INTERNAL_param;
    var output;

    output = org.jboss.search.util.fragmentParser.parse('log=');
    assertUndefined('Works for undefined input', output[p_.LOG]);

    output = org.jboss.search.util.fragmentParser.parse('log=dummy');
    assertEquals('dummy', output[p_.LOG]);
};