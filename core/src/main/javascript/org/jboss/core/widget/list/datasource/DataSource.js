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
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.widget.list.datasource.DataSource');
goog.provide('org.jboss.core.widget.list.datasource.DataSourceEvent');
goog.provide('org.jboss.core.widget.list.datasource.DataSourceEventType');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('org.jboss.core.widget.list.ListItem');



/**
 *
 * @interface
 */
org.jboss.core.widget.list.datasource.DataSource = function() {};


/**
 * Dispatches {@link DataSourceEvent}.
 *
 * @param {string} query
 */
org.jboss.core.widget.list.datasource.DataSource.prototype.get = function(query) {};


/**
 * @return {boolean} if data source is active, i.e. it is processing action which leads
 *                   to firing an event (typically, this is an async request processing).
 */
org.jboss.core.widget.list.datasource.DataSource.prototype.isActive = function() {};


/**
 * Aborts processing of action, in any case this needs to prevent firing of the event.
 */
org.jboss.core.widget.list.datasource.DataSource.prototype.abort = function() {};



/**
 *
 * @param {!Array.<org.jboss.core.widget.list.ListItem>} data
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.core.widget.list.datasource.DataSourceEvent = function(data) {
  goog.events.Event.call(this, org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT);

  /**
   * @type {!Array.<org.jboss.core.widget.list.ListItem>}
   * @private
   */
  this.data_ = data;
};
goog.inherits(org.jboss.core.widget.list.datasource.DataSourceEvent, goog.events.Event);


/**
 * @return {!Array.<org.jboss.core.widget.list.ListItem>}
 */
org.jboss.core.widget.list.datasource.DataSourceEvent.prototype.getData = function() {
  return this.data_;
};


/**
 * @enum {string}
 */
org.jboss.core.widget.list.datasource.DataSourceEventType = {
  DATA_SOURCE_EVENT: goog.events.getUniqueId('data_source_event')
};
