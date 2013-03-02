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
goog.require('org.jboss.search.Constants');
goog.require('goog.Uri');
goog.require('goog.testing.jsunit');

var testPaginationGenerator = function() {

    var g_ = org.jboss.search.util.paginationGenerator;
    var pagination;

    pagination = g_.generate("test", 2, 43);
    assertEquals(5, pagination.total_pages);
    assertEquals(5, pagination.array.length);
    assertEquals(1, pagination.array[0].page);
    assertEquals("1", pagination.array[0].symbol);
    assertEquals("#q=test&page=1", pagination.array[0].fragment);

    pagination = g_.generate("test", 2, 143);
    assertEquals(15, pagination.total_pages);
    assertEquals(org.jboss.search.Constants.PAGINATION_MAX_ITEMS_COUNT, pagination.array.length);
    assertEquals(1, pagination.array[0].page);
    assertEquals("1", pagination.array[0].symbol);
    assertEquals("#q=test&page=1", pagination.array[0].fragment);

    pagination = g_.generate("test", 6, 143);
    assertEquals(15, pagination.total_pages);
    assertEquals(org.jboss.search.Constants.PAGINATION_MAX_ITEMS_COUNT, pagination.array.length);
    assertEquals(2, pagination.array[0].page);
    assertEquals(11, pagination.array[org.jboss.search.Constants.PAGINATION_MAX_ITEMS_COUNT-1].page);
};
