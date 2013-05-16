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

/**
 * @fileoverview
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.service.QueryService');

/**
 * @param {!org.jboss.search.service.QueryServiceDispatcher} dispatcher
 * @interface
 */
org.jboss.search.service.QueryService = function(dispatcher) {};

/**
 * Execute user query. This is used for the main search field that can contain any user input.
 * @param {string} query_string user query
 * @param {number=} opt_page search results page number [1..x]
 * @param {number=} opt_from specify search results interval: from [1..x]
 * @param {number=} opt_to specify search results interval: to [1..x]
 * @param {string=} opt_log type of logging windows that is used
 */
org.jboss.search.service.QueryService.prototype.userQuery;

/**
 * Execute user suggestion query. This is fired for type ahead queries while user types in a query into the main search field.
 * @param {string} query_string user query
 */
org.jboss.search.service.QueryService.prototype.userSuggestionQuery;