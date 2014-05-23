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

goog.require('org.jboss.search.util.paginationGenerator');
goog.require('org.jboss.search.Variables');
goog.require('goog.Uri');
goog.require('goog.testing.jsunit');

var testPaginationGenerator = function() {

  var g_ = org.jboss.search.util.paginationGenerator;
  var pagination;

  pagination = g_.generate(2, 43);
  assertEquals(5, pagination.total_pages);
  assertEquals(5, pagination.array.length);
  assertEquals(1, pagination.array[0].page);
  assertEquals('1', pagination.array[0].symbol);

  pagination = g_.generate(2, 143);
  assertEquals(15, pagination.total_pages);
  assertEquals(org.jboss.search.Variables.PAGINATION_MAX_ITEMS_COUNT, pagination.array.length);
  assertEquals(1, pagination.array[0].page);
  assertEquals('1', pagination.array[0].symbol);

  pagination = g_.generate(6, 143);
  assertEquals(15, pagination.total_pages);
  assertEquals(org.jboss.search.Variables.PAGINATION_MAX_ITEMS_COUNT, pagination.array.length);
  assertEquals(2, pagination.array[0].page);
  assertEquals(11, pagination.array[org.jboss.search.Variables.PAGINATION_MAX_ITEMS_COUNT - 1].page);
};

var testPaginationGeneratorInfiniteLoop = function() {

  if (org.jboss.search.Variables.SEARCH_RESULTS_PER_PAGE < 2) {
    fail('Can not execute the test!');
  }

  var g_ = org.jboss.search.util.paginationGenerator;
  var pagination;

  pagination = g_.generate(1, org.jboss.search.Variables.SEARCH_RESULTS_PER_PAGE);
  assertEquals(1, pagination.total_pages);
  assertEquals(0, pagination.array.length);
};

var testPaginationGeneratorLogParameter = function() {

  var g_ = org.jboss.search.util.paginationGenerator;
  var pagination;

  // make sure pagination is generated, thus SEARCH_RESULTS_PER_PAGE + 1
  pagination = g_.generate(1, org.jboss.search.Variables.SEARCH_RESULTS_PER_PAGE + 1);
  assertEquals(2, pagination.total_pages);
  assertEquals(2, pagination.array.length);
};
