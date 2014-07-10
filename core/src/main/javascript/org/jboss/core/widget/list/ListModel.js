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
goog.provide('org.jboss.core.widget.list.ListModel');

goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('org.jboss.core.widget.list.ListItem');
goog.require('org.jboss.core.widget.list.ListItemId');
goog.require('org.jboss.core.widget.list.event.ListModelEvent');
goog.require('org.jboss.core.widget.list.event.ListModelEventType');



/**
 * A model representing simple list of items.  The list has id and can have a caption.
 *
 * @param {string} id
 * @param {?string} caption
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.core.widget.list.ListModel = function(id, caption) {
  goog.events.EventTarget.call(this);

  /**
   * @type {string}
   * @private
   */
  this.id_ = id;

  /**
   * @type {?string}
   * @private
   */
  this.caption_ = caption;

  /**
   * @type {!Array.<org.jboss.core.widget.list.ListItem>}
   * @private
   */
  this.data_ = [];
};
goog.inherits(org.jboss.core.widget.list.ListModel, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.core.widget.list.ListModel.prototype.disposeInternal = function() {
  org.jboss.core.widget.list.ListModel.superClass_.disposeInternal.call(this);
  delete this.data_;
};


/**
 * Return {@link ListModel} id.
 *
 * @return {string} id
 */
org.jboss.core.widget.list.ListModel.prototype.getId = function() {
  return this.id_;
};


/**
 * Return {@link ListModel} caption.  Can be <code>null</code>.
 *
 * @return {?string}
 */
org.jboss.core.widget.list.ListModel.prototype.getCaption = function() {
  return this.caption_;
};


/**
 * Sets new data to the model. It update list of selected items and silently
 * drops those that are not found in the new data.
 *
 * Dispatches {@link NEW_DATA_SET} upon successful operation.
 *
 * @param {!Array.<org.jboss.core.widget.list.ListItem>} data
 * @param {boolean=} opt_omitFireEvent if true then no event is fired upon data set.
 */
org.jboss.core.widget.list.ListModel.prototype.setData = function(data, opt_omitFireEvent) {

  // shall we make a deep clone of the data first (is it worth?)
  this.data_ = data;

  if (goog.isDef(opt_omitFireEvent) && opt_omitFireEvent == true) { return; }
  this.dispatchEvent(
      new org.jboss.core.widget.list.event.ListModelEvent(
          org.jboss.core.widget.list.event.ListModelEventType.NEW_DATA_SET,
          this)
  );
};


/**
 * @param {!org.jboss.core.widget.list.ListItemId} itemId
 * @return {boolean} true if item is selected
 */
org.jboss.core.widget.list.ListModel.prototype.isItemSelected = function(itemId) {
  var index = goog.array.findIndex(this.data_, function(item) {
    return itemId == item.getId();
  });
  return index > -1 ? (this.data_[index].isSelected()) : false;
};


/**
 * Toggle selected on list item for given index position.
 *
 * Dispatches {@link LIST_ITEM_SELECTED} or {@link LIST_ITEM_DESELECTED} upon successful operation.
 *
 * @param {number} index
 */
org.jboss.core.widget.list.ListModel.prototype.toggleSelectedItemIndex = function(index) {
  var item = this.getListItem(index);
  if (goog.isDefAndNotNull(item)) {
    if (item.isSelected()) {
      item.setSelected(false);
      this.dispatchEvent(
          new org.jboss.core.widget.list.event.ListModelEvent(
              org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED,
              this, index)
      );
    } else {
      item.setSelected(true);
      this.dispatchEvent(
          new org.jboss.core.widget.list.event.ListModelEvent(
              org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED,
              this, index)
      );
    }
  }
};


/**
 * Return data.
 *
 * @return {!Array.<org.jboss.core.widget.list.ListItem>}
 */
org.jboss.core.widget.list.ListModel.prototype.getData = function() {
  return this.data_;
};


/**
 * Get number of items in the list.
 *
 * @return {number}
 */
org.jboss.core.widget.list.ListModel.prototype.getSize = function() {
  return this.data_.length;
};


/**
 * Get number of selected items in the list.
 *
 * @return {number}
 */
org.jboss.core.widget.list.ListModel.prototype.getSelectedSize = function() {
  return goog.array.reduce(this.data_, function(r, v) { return r + (v.isSelected() ? 1 : 0); }, 0);
};


/**
 * Get item at specified index.
 * Index value has the same convention as an array index (starting at 0 for the first item).
 * Returns <code>null</code> if index value is out of the array bounds.
 *
 * @param {number} index
 * @return {?org.jboss.core.widget.list.ListItem}
 */
org.jboss.core.widget.list.ListModel.prototype.getListItem = function(index) {
  return (!goog.isNumber(index) || index < 0 || this.getSize() < (index + 1)) ? null : this.data_[index];
};


/**
 * Try to find and return {@link ListItem} having given id.  Returns <code>null</code> if not found.
 *
 * @param {org.jboss.core.widget.list.ListItemId} itemId
 * @return {?org.jboss.core.widget.list.ListItem}
 */
org.jboss.core.widget.list.ListModel.prototype.getListItemById = function(itemId) {
  return goog.array.find(
      this.data_,
      function(listItem) {
        return listItem.getId() == itemId;
      }
  );
};


/**
 * Returns index of {@link ListItem} having given id within internal data structure.
 * Returns null if not found.
 *
 * @param {org.jboss.core.widget.list.ListItemId} itemId
 * @return {?number}
 */
org.jboss.core.widget.list.ListModel.prototype.getListItemIndexById = function(itemId) {
  var id = itemId.toString();
  if (id.length > 0 && goog.string.startsWith(id, this.id_)) {
    var listItemId = id.slice(this.id_.length);
    var index = goog.array.findIndex(
        this.data_,
        function(listItem) {
          return listItem.getId() == listItemId;
        }
        );
    return (index > -1 ? index : null);
  }
  return null;
};
