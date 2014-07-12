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

goog.require('goog.Disposable');
goog.require('goog.events');
goog.require('goog.events.Key');
goog.require('org.jboss.core.response.ProjectNameSuggestions');
goog.require('org.jboss.core.response.SearchResults');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.service.query.QueryService');
goog.require('org.jboss.core.service.query.QueryServiceEvent');
goog.require('org.jboss.core.service.query.QueryServiceEventType');
goog.require('org.jboss.core.service.query.SimpleTimeCache');



/**
 * @param {!org.jboss.core.service.query.QueryService} queryService
 * @constructor
 * @implements {org.jboss.core.service.query.QueryService}
 * @extends {goog.Disposable}
 */
org.jboss.search.service.query.QueryServiceCached = function(queryService) {
  goog.Disposable.call(this);

  /**
   * @type {!org.jboss.core.service.query.QueryService}
   * @private
   */
  this.queryService_ = queryService;

  /**
   * @type {!org.jboss.core.service.query.QueryServiceDispatcher}
   * @private
   */
  this.queryServiceDispatcher_ = org.jboss.core.service.Locator.getInstance().getLookup().getQueryServiceDispatcher();

  /**
   * Cache of previously executed "project name suggestion" queries.
   * Cache objects expire after 5 minutes (300 seconds), expired objects are removed every 10 seconds.
   *
   * @type {!org.jboss.core.service.query.SimpleTimeCache.<org.jboss.core.response.SearchResults>}
   * @private
   */
  this.userQueryCache_ = new org.jboss.core.service.query.SimpleTimeCache(300, 10);

  this.userQueryCacheUpdateKey_ = goog.events.listen(
      this.queryServiceDispatcher_,
      [
        org.jboss.core.service.query.QueryServiceEventType.SEARCH_SUCCEEDED
      ],
      goog.bind(function(e) {
        var event = /** @type {org.jboss.core.service.query.QueryServiceEvent} */ (e);
        var data = /** @type {org.jboss.core.response.SearchResults} */ (event.getMetadata());
        var key = data.query.toString();
        if (!this.userQueryCache_.containsForKey(key)) {
          this.userQueryCache_.put(key, data);
        }
      }, this));

  /**
   * Cache of previously executed "project name suggestion" queries.
   * Cache objects expire after 5 minutes (300 seconds), expired objects are removed every 10 seconds.
   *
   * @type {!org.jboss.core.service.query.SimpleTimeCache.<org.jboss.core.response.ProjectNameSuggestions>}
   * @private
   */
  this.projectNameSuggestionsCache_ = new org.jboss.core.service.query.SimpleTimeCache(300, 10);

  /**
   * Subscribing to 'PROJECT_NAME_SEARCH_SUGGESTIONS_SUCCEEDED'. Every time new data arrives
   * we check if it is in the cache, if not we put it into the cache. Since then we serve the
   * data from the cache. Once the data expires from the cache we will put it into the cache
   * as soon as a new request it executed.
   *
   * @type {goog.events.Key}
   * @private
   */
  this.projectNameSuggestionsCacheUpdateKey_ = goog.events.listen(
      this.queryServiceDispatcher_,
      [
        org.jboss.core.service.query.QueryServiceEventType.PROJECT_NAME_SEARCH_SUGGESTIONS_SUCCEEDED
      ],
      goog.bind(function(e) {
        var event = /** @type {org.jboss.core.service.query.QueryServiceEvent} */ (e);
        var data = /** @type {org.jboss.core.response.ProjectNameSuggestions} */ (event.getMetadata());
        if (!this.projectNameSuggestionsCache_.containsForKey(data.query)) {
          this.projectNameSuggestionsCache_.put(data.query, data);
        }
      }, this));
};
goog.inherits(org.jboss.search.service.query.QueryServiceCached, goog.Disposable);


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceCached.prototype.disposeInternal = function() {
  org.jboss.search.service.query.QueryServiceCached.superClass_.disposeInternal.call(this);

  goog.events.unlistenByKey(this.userQueryCacheUpdateKey_);
  goog.events.unlistenByKey(this.projectNameSuggestionsCacheUpdateKey_);

  goog.dispose(this.userQueryCache_);
  goog.dispose(this.projectNameSuggestionsCache_);

  delete this.queryServiceDispatcher_;
  delete this.queryService_;
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceCached.prototype.userQuery = function(requestParams) {
  var key = requestParams.toString();
  // in case we can get the data from cache
  if (this.userQueryCache_.containsForKey(key)) {
    var response = this.userQueryCache_.get(key);
    if (goog.isDefAndNotNull(response)) {

      // specify correct type to make type check compiler pass (this line is removed in ADVANCED compilation anyway)
      response = /** @type {org.jboss.core.response.SearchResults} */ (response);

      // fire the same events that would be fired in successful path of a service doing a real XHR
      // this is necessary to make sure all logic based on the events will not break
      this.abortUserQuery();
      this.queryServiceDispatcher_.dispatchUserQueryStart(response.query, 'mem_cache://');
      this.queryServiceDispatcher_.dispatchUserQueryFinished();

      // we must make sure this is set to lookup before the success event is dispatched (see #80)
      org.jboss.core.service.Locator.getInstance().getLookup().setRequestParams(requestParams);
      org.jboss.core.service.Locator.getInstance().getLookup().setRecentQueryResultData(response.response);

      this.queryServiceDispatcher_.dispatchUserQuerySucceeded(response);
      return;
    }
  }
  // otherwise call the query service
  this.queryService_.userQuery(requestParams);
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceCached.prototype.abortUserQuery = function() {
  this.queryService_.abortUserQuery();
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceCached.prototype.isUserQueryRunning = function() {
  return this.queryService_.isUserQueryRunning();
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceCached.prototype.userSuggestionQuery = function(query) {
  // TODO: implement caching
  this.queryService_.userSuggestionQuery(query);
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceCached.prototype.projectNameSuggestions = function(query) {
  // in case we can get the data from cache
  if (this.projectNameSuggestionsCache_.containsForKey(query)) {
    var response = this.projectNameSuggestionsCache_.get(query);
    if (goog.isDefAndNotNull(response)) {

      // specify correct type to make type check compiler pass (this line is removed in ADVANCED compilation anyway)
      response = /** @type {org.jboss.core.response.ProjectNameSuggestions} */ (response);

      // fire the same events that would be fired in successful path of a service doing a real XHR
      // this is necessary to make sure all logic based on the events will not break
      this.abortProjectNameSuggestions();
      this.queryServiceDispatcher_.dispatchProjectNameSuggestionsQueryStart(query, 'mem_cache://');
      this.queryServiceDispatcher_.dispatchProjectNameSuggestionsQueryFinished();
      this.queryServiceDispatcher_.dispatchProjectNameSuggestionsQuerySucceeded(response);
      return;
    }
  }
  // otherwise call the query service
  this.queryService_.projectNameSuggestions(query);
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceCached.prototype.isProjectNameSuggestionsRunning = function() {
  return this.queryService_.isProjectNameSuggestionsRunning();
};


/** @inheritDoc */
org.jboss.search.service.query.QueryServiceCached.prototype.abortProjectNameSuggestions = function() {
  this.queryService_.abortProjectNameSuggestions();
};
