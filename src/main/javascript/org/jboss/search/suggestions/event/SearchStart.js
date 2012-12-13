/*
    JBoss, Home of Professional Open Source
    Copyright 2012 Red Hat Inc. and/or its affiliates and other contributors
    as indicated by the @authors tag. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/**
 *  @fileoverview Event to represent 'search suggestions' search request has started.
 *
 *  @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.suggestions.event.SearchStart');

goog.require('org.jboss.search.suggestions.event.EventType');

goog.require('goog.events.Event');

/**
 *
 * @param {string} query_string
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.search.suggestions.event.SearchStart = function(query_string) {

    goog.events.Event.call(this, org.jboss.search.suggestions.event.EventType.SEARCH_START, "");

    /**
     * @type {string}
     * @private
     */
    this.query_string_ = query_string;
};
goog.inherits(org.jboss.search.suggestions.event.SearchStart, goog.events.Event);

/** @return {string} */
org.jboss.search.suggestions.event.SearchStart.prototype.getQueryString = function() {
    return this.query_string_;
};

