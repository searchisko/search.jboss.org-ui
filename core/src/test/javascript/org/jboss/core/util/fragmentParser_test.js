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

goog.require('org.jboss.core.util.fragmentParser');

goog.require('goog.testing.jsunit');

var testFragmentParserForUserQuery = function() {

  var requestParams;

  requestParams = org.jboss.core.util.fragmentParser.parse();
  assertNotNullNorUndefined('Works for undefined input', requestParams);

  requestParams = org.jboss.core.util.fragmentParser.parse(null);
  assertNotNullNorUndefined('Works for null input', requestParams);

  requestParams = org.jboss.core.util.fragmentParser.parse('1&2&3&x=foo');
  assertUndefined('No q parameter', requestParams.getQueryString());

  requestParams = org.jboss.core.util.fragmentParser.parse('q=');
  assertEquals('Empty query', '', requestParams.getQueryString());

  requestParams = org.jboss.core.util.fragmentParser.parse('q=%20%20');
  assertEquals('Reduced to a single space', ' ', requestParams.getQueryString());

  requestParams = org.jboss.core.util.fragmentParser.parse('q=%20%20x%20%20');
  assertEquals('Reduced to a single space too', 'x ', requestParams.getQueryString());

  requestParams = org.jboss.core.util.fragmentParser.parse('1&2&3&x=foo&q=first&q=second');
  assertEquals('The last parameter wins', 'second', requestParams.getQueryString());

  requestParams = org.jboss.core.util.fragmentParser.parse('1&2&3&x=foo&q=first&Q=second');
  assertEquals('Parameter key is case insensitive', 'second', requestParams.getQueryString());

  requestParams = org.jboss.core.util.fragmentParser.parse('q=%3F%20%3F%20%3F');
  assertEquals('Test URL decode', '? ? ?', requestParams.getQueryString());
};

var testFragmentParserForPageValue = function() {

  var requestParams;

  requestParams = org.jboss.core.util.fragmentParser.parse('page=');
  assertUndefined('Works for undefined input', requestParams.getPage());

  requestParams = org.jboss.core.util.fragmentParser.parse('page=x');
  assertUndefined('Works for invalid input', requestParams.getPage());

  requestParams = org.jboss.core.util.fragmentParser.parse('page=10');
  assertEquals('Works for valid input', 10, requestParams.getPage());
};

var testFragmentParserForLogValue = function() {

  var requestParams;

  requestParams = org.jboss.core.util.fragmentParser.parse('log=');
  assertUndefined('Works for undefined input', requestParams.getLog());

  requestParams = org.jboss.core.util.fragmentParser.parse('log=dummy');
  assertEquals('dummy', requestParams.getLog());
};

var testFragmentParserForContributorValues = function() {

  var requestParams;

  requestParams = org.jboss.core.util.fragmentParser.parse('people=');
  assertEquals('Works for undefined input', 0, requestParams.getContributors().length);

  requestParams = org.jboss.core.util.fragmentParser.parse('people=++John%20Doe%20%3Cjohn.doe%40domain.com%3E++');
  assertEquals('URL decode and trim input', 1, requestParams.getContributors().length);
  assertEquals('URL decode and trim input', 'John Doe <john.doe@domain.com>', requestParams.getContributors()[0]);

  requestParams = org.jboss.core.util.fragmentParser.parse('people=1&people=+&people=2');
  assertEquals('Works for fine for multiple values', 2, requestParams.getContributors().length);

  requestParams = org.jboss.core.util.fragmentParser.parse('people=1++&people=2&people=++1');
  assertEquals('Dedup multiple values', 2, requestParams.getContributors().length);
};

var testFragmentParserForContentTypeValues = function() {

  var requestParams;

  requestParams = org.jboss.core.util.fragmentParser.parse('type=');
  assertEquals('Works for undefined input', 0, requestParams.getContentTypes().length);

  requestParams = org.jboss.core.util.fragmentParser.parse('type=++xx++');
  assertEquals('URL decode and trim input', 1, requestParams.getContentTypes().length);
  assertEquals('URL decode and trim input', "xx", requestParams.getContentTypes()[0]);

  requestParams = org.jboss.core.util.fragmentParser.parse('type=1&type=+&type=2');
  assertEquals('Works for fine for multiple values', 2, requestParams.getContentTypes().length);

  requestParams = org.jboss.core.util.fragmentParser.parse('type=1++&type=2&type=++1');
  assertEquals('Dedup multiple values', 2, requestParams.getContentTypes().length);
};
