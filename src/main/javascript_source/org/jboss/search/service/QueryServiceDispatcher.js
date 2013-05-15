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
 * @fileoverview Object that dispatches events related to QueryService. The convention is that for all '*_SUCCEEDED' events
 * the metadata contains raw (normalized) response data (JSON). For other event types it can contain different metadata (but again JSON).
 * Later, the format of 'other' event's metadata can be formalized. Right now it is not.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.service.QueryServiceDispatcher');

goog.require('org.jboss.search.service.QueryServiceEventType');
goog.require('org.jboss.search.service.QueryServiceEvent');
goog.require('goog.events.EventTarget');

/**
 * Crate a new instance.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.service.QueryServiceDispatcher = function() {
    goog.events.EventTarget.call(this);

};
goog.inherits(org.jboss.search.service.QueryServiceDispatcher, goog.events.EventTarget);

/** @inheritDoc */
org.jboss.search.service.QueryServiceDispatcher.prototype.disposeInternal = function() {
    // Call the superclass's disposeInternal() method.
    org.jboss.search.service.QueryServiceDispatcher.superClass_.disposeInternal.call(this);
};

/**
 *
 */
org.jboss.search.service.QueryServiceDispatcher.prototype.dispatchUserQueryAbort = function() {
    var event = new org.jboss.search.service.QueryServiceEvent(
        org.jboss.search.service.QueryServiceEventType.SEARCH_ABORTED
    );
    this.dispatchEvent(event);
};

/**
 *
 * @param {string} query_string
 * @param {string} query_url_string
 */
org.jboss.search.service.QueryServiceDispatcher.prototype.dispatchUserQueryStart = function(query_string, query_url_string) {
    var event = new org.jboss.search.service.QueryServiceEvent(
        org.jboss.search.service.QueryServiceEventType.SEARCH_START,
        {
            query_string: query_string,
            url: query_url_string
        }
    );
    this.dispatchEvent(event);
};

/**
 *
 */
org.jboss.search.service.QueryServiceDispatcher.prototype.dispatchUserQueryFinished = function() {
    var event = new org.jboss.search.service.QueryServiceEvent(
        org.jboss.search.service.QueryServiceEventType.SEARCH_FINISHED
    );
    this.dispatchEvent(event);
};

/**
 *
 * @param {Object|undefined} responseData normalized response data
 */
org.jboss.search.service.QueryServiceDispatcher.prototype.dispatchUserQuerySucceeded = function(responseData) {
    var event = new org.jboss.search.service.QueryServiceEvent(
        org.jboss.search.service.QueryServiceEventType.SEARCH_SUCCEEDED,
        responseData
    );
    this.dispatchEvent(event);
};

/**
 * @param {string} query_string
 * @param {Object} error
 */
org.jboss.search.service.QueryServiceDispatcher.prototype.dispatchUserQueryError = function(query_string, error) {
    var event = new org.jboss.search.service.QueryServiceEvent(
        org.jboss.search.service.QueryServiceEventType.SEARCH_ERROR,
        {
            query_string: query_string,
            error: error
        }
    );
    this.dispatchEvent(event);
};

/**
 *
 */
org.jboss.search.service.QueryServiceDispatcher.prototype.dispatchUserSuggestionsQueryAbort = function() {
    var event = new org.jboss.search.service.QueryServiceEvent(
        org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_ABORTED
    );
    this.dispatchEvent(event);
};

/**
 * @param {string} query_string
 * @param {string} query_url_string
 */
org.jboss.search.service.QueryServiceDispatcher.prototype.dispatchUserSuggestionsQueryStart = function(query_string, query_url_string) {
    var event = new org.jboss.search.service.QueryServiceEvent(
        org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_START,
        {
            query_string: query_string,
            url: query_url_string
        }
    );
    this.dispatchEvent(event);
};

/**
 *
 */
org.jboss.search.service.QueryServiceDispatcher.prototype.dispatchUserSuggestionsQueryFinished = function() {
    var event = new org.jboss.search.service.QueryServiceEvent(
        org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_FINISHED
    );
    this.dispatchEvent(event);
};

/**
 * @param {{ model: Object, view: Object}|undefined} responseData response data (model and view data)
 */
org.jboss.search.service.QueryServiceDispatcher.prototype.dispatchUserSuggestionsQuerySucceeded = function(responseData) {
    var event = new org.jboss.search.service.QueryServiceEvent(
        org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_SUCCEEDED,
        responseData
    );
    this.dispatchEvent(event);
};

/**
 * @param {string} query_string
 * @param {Object} error
 */
org.jboss.search.service.QueryServiceDispatcher.prototype.dispatchUserSuggestionsQueryError = function(query_string, error) {
    var event = new org.jboss.search.service.QueryServiceEvent(
        org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_ERROR,
        {
            query_string: query_string,
            error: error
        }
    );
    this.dispatchEvent(event);
};