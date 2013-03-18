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

goog.provide('org.jboss.search.page.event.QuerySubmitted');

goog.require('org.jboss.search.page.event.EventType');
goog.require('goog.events.Event');

/**
 * @param {string} query
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.search.page.event.QuerySubmitted = function(query) {
    goog.events.Event.call(this, org.jboss.search.page.event.EventType.QUERY_SUBMITTED);

    /**
     * @type {string}
     * @private
     */
    this.query_ = query || '';
};
goog.inherits(org.jboss.search.page.event.QuerySubmitted, goog.events.Event);

/**
 * @return {string}
 */
org.jboss.search.page.event.QuerySubmitted.prototype.getQuery = function() {
    return this.query_;
};