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
 * @fileoverview Object that dispatches events related to {@link QueryService}.
 * The convention is that for all '*_SUCCEEDED' events the metadata contains raw (normalized) response data (JSON).
 * For other event types it can contain different metadata (but again JSON). Later, the format of 'other'
 * event's metadata can be formalized. Right now it is not.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.response.ProjectNameSuggestions');
goog.provide('org.jboss.core.response.SearchResults');
goog.provide('org.jboss.core.service.query.QueryServiceDispatcher');

goog.require('goog.events.EventTarget');
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.service.query.QueryServiceEvent');
goog.require('org.jboss.core.service.query.QueryServiceEventType');


/**
 * Expected structure of JSON response from "project name suggestions" service call.
 * TODO: move all typedefs 'org.jboss.core.response.*' to separated file in the future
 *       we can expect that this type will be used without direct connection to query dispatcher
 *
 * @typedef {{ query: !string, matching_items: !Array.<string>, did_you_mean_items: !Array.<string> }}
 */
org.jboss.core.response.ProjectNameSuggestions;


/**
 * @typedef {{ query: !org.jboss.core.context.RequestParams, response: !Object }}
 */
org.jboss.core.response.SearchResults;



/**
 * Crate a new instance.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.core.service.query.QueryServiceDispatcher = function() {
  goog.events.EventTarget.call(this);
};
goog.inherits(org.jboss.core.service.query.QueryServiceDispatcher, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.disposeInternal = function() {
  org.jboss.core.service.query.QueryServiceDispatcher.superClass_.disposeInternal.call(this);
};


/**
 * Dispatches SEARCH_ABORTED event.
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchUserQueryAbort = function() {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_ABORTED
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches SEARCH_START event.
 * Event metadata format:
 * {
 *   requestParams: {!org.jboss.core.context.RequestParams},
 *   url: "Request URL"
 * }
 *
 * @param {!org.jboss.core.context.RequestParams} requestParams
 * @param {string} query_url_string
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchUserQueryStart = function(requestParams,
                                                                                                query_url_string) {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_START,
      {
        requestParams: requestParams,
        url: query_url_string
      }
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches SEARCH_FINISHED event.
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchUserQueryFinished = function() {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_FINISHED
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches SEARCH_SUCCEEDED event.
 * Metadata contains response JSON data.
 *
 * @param {!org.jboss.core.response.SearchResults} responseData normalized response data
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchUserQuerySucceeded = function(responseData) {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_SUCCEEDED,
      responseData
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches SEARCH_ERROR event.
 * Event metadata format:
 * {
 *   query_string: "client query",
 *   error: {...}
 * }
 *
 * @param {?string} query_string
 * @param {Object} error
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchUserQueryError = function(query_string, error) {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_ERROR,
      {
        query_string: query_string,
        error: error
      }
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches SEARCH_SUGGESTIONS_ABORTED event.
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchUserSuggestionsQueryAbort = function() {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_SUGGESTIONS_ABORTED
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches SEARCH_SUGGESTIONS_START event.
 * Event metadata format:
 * {
 *   query_string: "client query",
 *   url: "Request URL"
 * }
 *
 * @param {string} query_string
 * @param {string} query_url_string
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchUserSuggestionsQueryStart = function(query_string,
                                                                                                           query_url_string) {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_SUGGESTIONS_START,
      {
        query_string: query_string,
        url: query_url_string
      }
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches SEARCH_SUGGESTIONS_FINISHED event.
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchUserSuggestionsQueryFinished = function() {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_SUGGESTIONS_FINISHED
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches SEARCH_SUGGESTIONS_SUCCEEDED event.
 *
 * @param {{ model: Object, view: Object}|undefined} responseData response data (model and view data)
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchUserSuggestionsQuerySucceeded = function(responseData) {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_SUGGESTIONS_SUCCEEDED,
      responseData
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches SEARCH_SUGGESTIONS_ERROR event.
 * Event metadata format:
 * {
 *   query_string: "client query",
 *   error: {...}
 * }
 *
 * @param {string} query
 * @param {Object} error
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchUserSuggestionsQueryError = function(query, error) {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_SUGGESTIONS_ERROR,
      {
        query_string: query,
        error: error
      }
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches PROJECT_NAME_SEARCH_SUGGESTIONS_ABORTED event.
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchProjectNameSuggestionsQueryAbort = function() {
  // TODO:
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.PROJECT_NAME_SEARCH_SUGGESTIONS_ABORTED
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches PROJECT_NAME_SEARCH_SUGGESTIONS_START event.
 * Event metadata format:
 * {
 *   query_string: "client query",
 *   url: "Request URL"
 * }
 *
 * @param {string} query
 * @param {string} query_url_string
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchProjectNameSuggestionsQueryStart = function(query, query_url_string) {
  // TODO:
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.PROJECT_NAME_SEARCH_SUGGESTIONS_START,
      {
        query_string: query,
        url: query_url_string
      }
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches PROJECT_NAME_SEARCH_SUGGESTIONS_FINISHED event.
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchProjectNameSuggestionsQueryFinished = function() {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.PROJECT_NAME_SEARCH_SUGGESTIONS_FINISHED
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches PROJECT_NAME_SEARCH_SUGGESTIONS_SUCCEEDED event.
 * Metadata contains modified response JSON data.
 *
 * @param {org.jboss.core.response.ProjectNameSuggestions} responseData normalized response data
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchProjectNameSuggestionsQuerySucceeded = function(responseData) {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.PROJECT_NAME_SEARCH_SUGGESTIONS_SUCCEEDED,
      responseData
      );
  this.dispatchEvent(event);
};


/**
 * Dispatches PROJECT_NAME_SEARCH_SUGGESTIONS_ERROR event.
 * Event metadata format:
 * {
 *   query_string: "client query",
 *   error: {...}
 * }
 *
 * @param {string} query
 * @param {Object} error
 */
org.jboss.core.service.query.QueryServiceDispatcher.prototype.dispatchProjectNameSuggestionsQueryError = function(query, error) {
  var event = new org.jboss.core.service.query.QueryServiceEvent(
      org.jboss.core.service.query.QueryServiceEventType.PROJECT_NAME_SEARCH_SUGGESTIONS_ERROR,
      {
        query_string: query,
        error: error
      }
      );
  this.dispatchEvent(event);
};
