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

goog.provide('org.jboss.core.widget.list.event.ListModelEvent');
goog.provide('org.jboss.core.widget.list.event.ListModelEventType');

//goog.require('org.jboss.core.widget.list.ListModel'); // not required for annotation, causes circular dependency
goog.require('goog.events');
goog.require('goog.events.Event');


/**
 * Type of ListModelEvent.
 *
 * @enum {string}
 */
org.jboss.core.widget.list.event.ListModelEventType = {
  NEW_DATA_SET: goog.events.getUniqueId('new_date_set'),
  LIST_ITEM_SELECTED: goog.events.getUniqueId('list_item_selected'),
  LIST_ITEM_DESELECTED: goog.events.getUniqueId('list_item_deselected'),
  ALL_LIST_ITEMS_DESELECTED: goog.events.getUniqueId('all_list_items_deselected')
};



/**
 * ListModelEvent constructor.
 *
 * @param {org.jboss.core.widget.list.event.ListModelEventType} type
 * @param {org.jboss.core.widget.list.ListModel} listModel target of the event
 * @param {number=} opt_itemIndex index of relevant list item
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.core.widget.list.event.ListModelEvent = function(type, listModel, opt_itemIndex) {
  goog.events.Event.call(this, type, listModel);

  /**
   * @type {org.jboss.core.widget.list.event.ListModelEventType}
   * @private
   */
  this.type_ = type;

  /**
   * @type {?number}
   * @private
   */
  this.itemIndex_ = goog.isDefAndNotNull(opt_itemIndex) ? opt_itemIndex : null;

};
goog.inherits(org.jboss.core.widget.list.event.ListModelEvent, goog.events.Event);


/**
 * Return type of the event.
 *
 * @return {org.jboss.core.widget.list.event.ListModelEventType}
 */
org.jboss.core.widget.list.event.ListModelEvent.prototype.getType = function() {
  return this.type_;
};


/**
 * Return index of list item relevant to this event. Some events are not related
 * to individual items, in such case this function returns null.
 *
 * @return {?number}
 */
org.jboss.core.widget.list.event.ListModelEvent.prototype.getItemIndex = function() {
  return this.itemIndex_;
};

