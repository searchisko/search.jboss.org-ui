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

goog.provide('org.jboss.search.service.QueryServiceEvent');

goog.require('org.jboss.search.service.QueryServiceEventType');

/**
 * @param {org.jboss.search.service.QueryServiceEventType} type Event type
 * @param {Object=} opt_metadata Event metadata
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.search.service.QueryServiceEvent = function(type, opt_metadata) {
    goog.events.Event.call(this, type);

    /**
     * @type {org.jboss.search.service.QueryServiceEventType}
     * @private
     */
    this.type_ = type;

    /**
     * @type {Object|undefined}
     * @private
     */
    this.metadata_ = opt_metadata;
};
goog.inherits(org.jboss.search.service.QueryServiceEvent, goog.events.Event);

/**
 * @return {org.jboss.search.service.QueryServiceEventType}
 */
org.jboss.search.service.QueryServiceEvent.prototype.getType = function() {
    return this.type_;
};

/**
 * @return {Object|undefined}
 */
org.jboss.search.service.QueryServiceEvent.prototype.getMetadata = function() {
    return this.metadata_;
};