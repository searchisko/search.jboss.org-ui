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

goog.provide('org.jboss.core.widget.list.event.ListViewEvent');
goog.provide('org.jboss.core.widget.list.event.ListViewEventType');

//goog.require("org.jboss.core.widget.list.ListView");
goog.require('goog.events');
goog.require('goog.events.Event');


/**
 * Type of ListViewEvent.
 *
 * @enum {string}
 */
org.jboss.core.widget.list.event.ListViewEventType = {
  VIEW_UPDATE: goog.events.getUniqueId('view_updated')
};



/**
 * ListViewEvent constructor.
 *
 * @param {org.jboss.core.widget.list.ListView} listView target of the event
 * @param {org.jboss.core.widget.list.event.ListViewEventType} type
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.core.widget.list.event.ListViewEvent = function(listView, type) {
  goog.events.Event.call(this, type, listView);

  /**
   * TODO: the 'type' property and getter can be removed (it is in Event by default)
   * @type {org.jboss.core.widget.list.event.ListViewEventType}
   * @private
   */
  this.type_ = type;

};
goog.inherits(org.jboss.core.widget.list.event.ListViewEvent, goog.events.Event);


/**
 * Return type of the event.
 *
 * @return {org.jboss.core.widget.list.event.ListViewEventType}
 */
org.jboss.core.widget.list.event.ListViewEvent.prototype.getType = function() {
  return this.type_;
};
