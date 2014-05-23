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

goog.provide('test.org.jboss.search.suggestions.query.model.ModelTest');

goog.require('org.jboss.search.suggestions.query.model.Model');
goog.require('org.jboss.search.suggestions.query.model.Search');
goog.require('org.jboss.search.suggestions.query.model.Suggestion');

TestCase('ModelTest', {

  /**
   * Test that 'search' section of query suggestions response can be parsed.
   */
  testSearchModel: function () {

    var source;

    // query is empty string after initialization
    var model = new org.jboss.search.suggestions.query.model.Model();

    assertEquals('Should be empty', '', model.getSearch().query_string);

    // query is empty if source does not follow expected taxonomy
    source = { foo: { bar: { } } };
    model.parse(source);

    assertEquals('Should be empty', '', model.getSearch().query_string);

    // query is extracted correctly
    source = {
      search: {
        search: { query: 'Hello'}
      }
    };
    model.parse(source);

    assertEquals('Should be \'Hello\'', 'Hello', model.getSearch().query_string);
  },

  /**
   * Test that 'suggestions' section of query suggestions response can be parsed.
   */
  testSuggestionModel: function() {

    var source;

    // suggestions section in empty array after initialization
    var model = new org.jboss.search.suggestions.query.model.Model();

    assertEquals('Should be empty array', [], model.getSuggestions());

    // invalid suggestions
    source = { foo: [] };
    model.parse(source);

    assertEquals(0, model.getSuggestions().length);

    // valid suggestions
    source = { suggestions: [
      { suggestion: { value: 'Hibernate' }, search: { query: 'Hibernate' } },
      { suggestion: { value: 'Hibernate query' }, search: { query: 'Hibernate query' } },
      { suggestion: { value: 'Hibernate session' }, search: { query: 'Hibernate session' } }
    ]};

    model.parse(source);

    assertEquals('There should be 3 suggestions', 3, model.getSuggestions().length);

    assertEquals('Hibernate', model.getSuggestions()[0].value);
    assertEquals('Hibernate query', model.getSuggestions()[1].value);
    assertEquals('Hibernate session', model.getSuggestions()[2].value);

    assertEquals('Hibernate', model.getSuggestions()[0].query_string);
    assertEquals('Hibernate query', model.getSuggestions()[1].query_string);
    assertEquals('Hibernate session', model.getSuggestions()[2].query_string);
  }
});
