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
 * @fileoverview Caching decorator of QueryService.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.service.query.QueryServiceCached');

goog.require('org.jboss.core.service.query.QueryService');



/**
 * @param {!org.jboss.core.service.query.QueryService} queryService
 * @constructor
 * @implements {org.jboss.core.service.query.QueryService}
 */
org.jboss.search.service.query.QueryServiceCached = function(queryService) {
  /**
   * @type {org.jboss.core.service.query.QueryService}
   * @private
   */
  this.queryService_ = queryService;
};


/** @override */
org.jboss.search.service.query.QueryServiceCached.prototype.userQuery = function(requestParams) {
  // TODO: implement caching
  this.queryService_.userQuery(requestParams);
};


/** @override */
org.jboss.search.service.query.QueryServiceCached.prototype.userSuggestionQuery = function(query) {
  // TODO: implement caching
  this.queryService_.userSuggestionQuery(query);
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceCached.prototype.projectNameSuggestions = function(query) {
  // TODO: implement caching
  this.queryService_.projectNameSuggestions(query);
};
