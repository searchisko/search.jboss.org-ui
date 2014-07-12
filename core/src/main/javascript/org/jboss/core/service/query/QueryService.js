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
 * TODO: I think we can completely get rid of goog.require and goog.provide in this interface.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.service.query.QueryService');

goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.service.query.QueryServiceDispatcher');



/**
 * @param {!org.jboss.core.service.query.QueryServiceDispatcher} dispatcher
 * @interface
 */
org.jboss.core.service.query.QueryService = function(dispatcher) {};


/**
 * Execute user query. This is used for the main search field that can contain any user input.
 *
 * @param {!org.jboss.core.context.RequestParams} requestParams
 */
org.jboss.core.service.query.QueryService.prototype.userQuery = function(requestParams) {};


/**
 * Returns true if there is running 'user query' request.
 *
 * @return {boolean}
 */
org.jboss.core.service.query.QueryService.prototype.isUserQueryRunning = function() {};


/**
 * If there are running 'user query' request, abort it immediately.
 */
org.jboss.core.service.query.QueryService.prototype.abortUserQuery = function() {};


/**
 * Execute user suggestion query. This is fired for type ahead queries while user types in a query into the main
 * search field.
 *
 * @param {string} query user query
 */
org.jboss.core.service.query.QueryService.prototype.userSuggestionQuery = function(query) {};


/**
 * [Suggestions API - project name]{@link http://docs.jbossorg.apiary.io/#suggestionsapiprojectname}
 *
 * @param {string} query
 */
org.jboss.core.service.query.QueryService.prototype.projectNameSuggestions = function(query) {};


/**
 * Returns true if there is running 'project name suggestions' request.
 *
 * @return {boolean}
 */
org.jboss.core.service.query.QueryService.prototype.isProjectNameSuggestionsRunning = function() {};


/**
 * If there are running 'project name suggestions' request, abort it immediately.
 */
org.jboss.core.service.query.QueryService.prototype.abortProjectNameSuggestions = function() {};
