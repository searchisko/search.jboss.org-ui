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
 * @fileoverview Container that can hold several {@link ListModel}s. It has several functions:
 *
 *   1/ It represents a single model that is composed of several underlying list models.
 *   2/ Dispatches all events thrown by underlying list models. This means a view layer can listen to a single
 *      EventTarget to learn about all the changes of model.
 *   3/ Keeps track of all selected {@link ListItem}s by client.
 *   4/ Keeps track of pointed {@link ListItem} by client. There should be only up to one selected item at a time
 *      across all underlying list models.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */
goog.provide('org.jboss.core.widget.list.ListModelContainer');
goog.provide('org.jboss.core.widget.list.ListModelContainerEvent');
goog.provide('org.jboss.core.widget.list.ListModelContainerEventType');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.Key');
goog.require('goog.string');
goog.require('org.jboss.core.widget.list.ListModel');
goog.require('org.jboss.core.widget.list.event.ListModelEvent');
goog.require('org.jboss.core.widget.list.event.ListModelEventType');


/**
 * Types of events originated by {@link ListModelContainer}.
 * @enum {string}
 */
org.jboss.core.widget.list.ListModelContainerEventType = {
  LIST_ITEM_POINTED: goog.events.getUniqueId('list_item_pointed'),
  LIST_ITEM_DEPOINTED: goog.events.getUniqueId('list_item_depointed')
};



/**
 * ListModelContainerEvent constructor.
 *
 * @param {org.jboss.core.widget.list.ListModelContainerEventType} type
 * @param {org.jboss.core.widget.list.ListModel} listModel is set as event target
 * @param {number} itemIndex index of item
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.core.widget.list.ListModelContainerEvent = function(type, listModel, itemIndex) {
  goog.events.Event.call(this, type, listModel);

  /**
   * @type {number}
   * @private
   */
  this.itemIndex_ = itemIndex;

  /**
   * @type {org.jboss.core.widget.list.ListModelContainerEventType}
   * @private
   */
  this.type_ = type;
};
goog.inherits(org.jboss.core.widget.list.ListModelContainerEvent, goog.events.Event);


/**
 * @return {number}
 */
org.jboss.core.widget.list.ListModelContainerEvent.prototype.getItemIndex = function() {
  return this.itemIndex_;
};


/**
 * @return {org.jboss.core.widget.list.ListModelContainerEventType}
 */
org.jboss.core.widget.list.ListModelContainerEvent.prototype.getType = function() {
  return this.type_;
};



/**
 * Dispatches specific {@link ListModelEvent}s fired by all underlying models.
 * TODO: Document which particular event types are fired.
 *
 * Container keeps track of selected items and the item which pointer is pointing at ATM:
 * - Selected items represent all items that were selected (for example by client) in the past.
 * - Pointer on the other hand is interactive pointer (typically controlled by client) and
 *   is meant to be used for (de)selecting individual items.
 *
 * The idea of pointer is to allow (de)selection by both keyboard and pointing device.
 *
 * @param {!Array.<org.jboss.core.widget.list.ListModel>} models
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.core.widget.list.ListModelContainer = function(models) {
  goog.events.EventTarget.call(this);

  /**
   * @type {!Array.<org.jboss.core.widget.list.ListModel>}
   * @private
   */
  this.models_ = models;

  /**
   * Pointer is pointing at some {@link ListItem} inside {@link ListModel} having this index.
   *
   * @type {?number}
   * @private
   */
  this.pointedModelIndex_ = null;

  /**
   * Index of {@link ListItem} pointer is pointing at.
   *
   * @type {?number}
   * @private
   */
  this.pointedListItemIndex_ = null;

  // TODO: Consider creating a single custom type instead of two private variables ^^
  // pointedModelIndex_ and pointedListItemIndex_. Something that would represent tuple (ListModel, ListItem).

  /**
   * Model listeners.
   *
   * @type {!Array.<goog.events.Key>}
   * @private
   */
  this.modelListenersKeys_ = [];

  // subscribe to all provided models
  goog.array.forEach(this.models_, function(model) {
    var key = goog.events.listen(
        model,
        [
          org.jboss.core.widget.list.event.ListModelEventType.NEW_DATA_SET,
          org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED,
          org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED
        ],
        function(event) {
          var e = /** @type {org.jboss.core.widget.list.event.ListModelEvent} */ (event);
          // re-dispatch events from each list model
          this.dispatchEvent(e);

          switch (event.type) {
            case org.jboss.core.widget.list.event.ListModelEventType.NEW_DATA_SET:
              // update pointed {@link ListModel} accordingly (if needed) and fire event
              if (this.pointedModelIndex_ != null && this.pointedListItemIndex_ != null)
              {
                var listModel = /** @type {org.jboss.core.widget.list.ListModel} */ (e.target);
                if (listModel != null) {
                  var changedListModelIndex = this.findListModelIndex_(listModel.getId());
                  if (changedListModelIndex != null && changedListModelIndex == this.pointedModelIndex_) {
                    // list is empty, let's deselect item for now
                    if (listModel.getSize() == 0) {
                      this.pointedModelIndex_ = null;
                      this.pointedListItemIndex_ = null;
                      // org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED
                    } else if ((this.pointedListItemIndex_ + 1) > listModel.getSize()) {
                      // the new list is shorter and pointed index position falls out
                      this.pointedModelIndex_ = null;
                      this.pointedListItemIndex_ = null;
                      // org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED
                    }
                    // org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED
                  }
                }
              }
              break;

            // case org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED:
              // nothing needed here now ...
              // break;

            // case org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED:
              // nothing needed here now ...
              // break;
          }
        },
        false, this
        );
    this.modelListenersKeys_.push(key);
  }, this);

};
goog.inherits(org.jboss.core.widget.list.ListModelContainer, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.core.widget.list.ListModelContainer.prototype.disposeInternal = function() {
  org.jboss.core.widget.list.ListModelContainer.superClass_.disposeInternal.call(this);
  delete this.models_;
  this.pointedListItemIndex_ = null;
  this.pointedModelIndex_ = null;
  goog.array.forEach(this.modelListenersKeys_, function(key) {
    goog.events.unlistenByKey(key);
  });
};


/**
 * Return true if any item is pointed.
 *
 * @return {boolean}
 */
org.jboss.core.widget.list.ListModelContainer.prototype.isAnyItemPointed = function() {
  return !!(this.pointedModelIndex_ != null && this.pointedListItemIndex_ != null);
};


/**
 * Get {@link ListModel} by given id. Returns null if not found.
 *
 * @param {string} id
 * @return {?org.jboss.core.widget.list.ListModel}
 */
org.jboss.core.widget.list.ListModelContainer.prototype.getListModelById = function(id) {
  return goog.array.find(
      this.models_,
      function(model) {
        return goog.string.startsWith(id, model.getId());
      }, this);
};


/**
 * Acknowledge that particular {@link ListItem} is being pointed at by pointing device.
 *
 * @param {?string} id
 */
org.jboss.core.widget.list.ListModelContainer.prototype.pointListItemById = function(id) {
  if (id != null) {
    // depoint if needed
    if (this.pointedModelIndex_ != null && this.pointedListItemIndex_ != null) {
      this.depointPointedListItem();
    }
    var lm = this.getListModelById(id);
    if (lm != null) {
      var listItemIndex = lm.getListItemIndexById(id);
      if (listItemIndex != null) {
        this.pointedModelIndex_ = this.findListModelIndex_(id);
        this.pointedListItemIndex_ = listItemIndex;
        if (this.pointedListItemIndex_ != null && this.pointedModelIndex_ != null) {
          this.dispatchPointed_(lm, listItemIndex);
        } else {
          // failed pointing item, clean up ...
          this.pointedListItemIndex_ = null;
          this.pointedModelIndex_ = null;
        }
      }
    }
  }
};


/**
 * Forget which list item is being pointed by pointing device.  If there is any pointed list item
 * then appropriate event (depointed) is fired as well. Event dispatching can be suppressed
 * by passing 'true' as the value of optional parameter.
 *
 * @param {boolean=} opt_suppressDispatchEvent defaults to 'true'
 * @this {org.jboss.core.widget.list.ListModelContainer}
 */
org.jboss.core.widget.list.ListModelContainer.prototype.depointPointedListItem = function(opt_suppressDispatchEvent) {
  var suppressed = opt_suppressDispatchEvent || false;
  if (this.pointedListItemIndex_ != null && this.pointedModelIndex_ != null) {
    if (!suppressed) {
      this.dispatchDepointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
    }
    this.pointedListItemIndex_ = null;
    this.pointedModelIndex_ = null;
  }
};


/**
 * Selects previous list item in actual {@link ListModel}. If the first list item is already selected
 * then it selects the last list item from previous {@link ListModel}. If there is no previous list item
 * to select (i.e. the very first list item in the first {@link ListModel} is already selected) then
 * no new list item is selected.
 *
 * @this {org.jboss.core.widget.list.ListModelContainer}
 */
org.jboss.core.widget.list.ListModelContainer.prototype.pointPreviousListItem = function() {
  var i;
  if (this.pointedModelIndex_ != null && this.pointedListItemIndex_ != null) {
    if (this.pointedListItemIndex_ > 0) {
      this.dispatchDepointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
      this.pointedListItemIndex_ -= 1;
      this.dispatchPointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
    } else {
      if (this.pointedModelIndex_ > 0) {
        i = this.getPreviousNonEmptyListModelStartingFrom_(this.pointedModelIndex_ - 1);
        if (i != null) {
          this.dispatchDepointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
          this.pointedModelIndex_ = i;
          this.pointedListItemIndex_ = this.getPointedListModel_().getSize() - 1;
          // select the last list item in the list model
          this.dispatchPointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
        }
      }
    }
  } else {
    // no item has been selected yet, select the last one (allowing quick jump to the end of the list)
    // try to select the last {@link ListItem} in the last non-empty {@link ListModel}
    i = this.getPreviousNonEmptyListModelStartingFrom_(this.models_.length);
    if (i != null && this.models_.length > i) {
      // this.dispatchDepointed_(this.pointedModelIndex_, this.pointedListItemIndex_);
      this.pointedModelIndex_ = i;
      this.pointedListItemIndex_ = (this.models_[i].getSize() - 1);
      this.dispatchPointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
    }
  }
  // console.log("select previous: ", this.pointedModelIndex_, this.pointedListItemIndex_);
};


/**
 * Selects next list item in actual {@link ListModel}. If the last list item is already selected
 * then it selects the first list item from next {@link ListModel}. If there is no next list item
 * to select (i.e. the very last list item in the last {@link ListModel} is already selected) then
 * no new list item is selected.
 *
 * @this {org.jboss.core.widget.list.ListModelContainer}
 */
org.jboss.core.widget.list.ListModelContainer.prototype.pointNextListItem = function() {
  var i;
  if (this.pointedModelIndex_ != null && this.pointedListItemIndex_ != null) {
    if (this.getPointedListModel_() != null &&
        ((this.pointedListItemIndex_ + 1) < this.getPointedListModel_().getSize())) {
      this.dispatchDepointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
      this.pointedListItemIndex_ += 1;
      this.dispatchPointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
    } else {
      i = this.getNextNonEmptyListModelStartingFrom_(this.pointedModelIndex_ + 1);
      if (i != null && i < this.models_.length) {
        this.dispatchDepointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
        this.pointedListItemIndex_ = 0;
        this.pointedModelIndex_ = i;
        // select the first list item in the list model
        this.dispatchPointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
      }
    }
  } else {
    // no item has been selected yet
    // try to select the first {@link ListItem} in the first non-empty {@link ListModel}
    i = this.getNextNonEmptyListModelStartingFrom_(0);
    if (i != null && i < this.models_.length) {
      // this.dispatchDepointed_(this.pointedModelIndex_, this.pointedListItemIndex_);
      this.pointedModelIndex_ = i;
      this.pointedListItemIndex_ = 0;
      this.dispatchPointed_(this.getPointedListModel_(), this.pointedListItemIndex_);
    }
  }
  // console.log("select next: ", this.pointedModelIndex_, this.pointedListItemIndex_);
};


/**
 * Find the {@link ListModel} who owns pointed list item and let it know that
 * particular item has been selected. If the item in already selected then this
 * deselect the item.
 */
org.jboss.core.widget.list.ListModelContainer.prototype.toggleSelectedPointedListItem = function() {
  var pointedListItemIndex = this.pointedListItemIndex_;
  var lm = this.getPointedListModel_();
  if (lm != null && pointedListItemIndex != null) {
    lm.toggleSelectedItemIndex(pointedListItemIndex);
  }
};


/**
 * Dispatches an event about pointer move to new position.
 *
 * @param {?org.jboss.core.widget.list.ListModel} listModel
 * @param {number} listItemIndex
 * @this {org.jboss.core.widget.list.ListModelContainer}
 * @private
 */
org.jboss.core.widget.list.ListModelContainer.prototype.dispatchPointed_ = function(listModel, listItemIndex) {
  if (listModel != null) {
    this.dispatchEvent(
        new org.jboss.core.widget.list.ListModelContainerEvent(
            org.jboss.core.widget.list.ListModelContainerEventType.LIST_ITEM_POINTED,
            listModel,
            listItemIndex
        )
    );
  }
};


/**
 * Dispatches an event about pointer remove from old position.
 *
 * @param {?org.jboss.core.widget.list.ListModel} listModel
 * @param {number} listItemIndex
 * @this {org.jboss.core.widget.list.ListModelContainer}
 * @private
 */
org.jboss.core.widget.list.ListModelContainer.prototype.dispatchDepointed_ = function(listModel, listItemIndex) {
  if (listModel != null) {
    this.dispatchEvent(
        new org.jboss.core.widget.list.ListModelContainerEvent(
            org.jboss.core.widget.list.ListModelContainerEventType.LIST_ITEM_DEPOINTED,
            listModel,
            listItemIndex
        )
    );
  }
};


/**
 * Returns index of the first non-empty {@link ListModel} after given index of {@link ListModel} including.
 * Returns null if not found.
 *
 * @param {number} index
 * @return {?number}
 * @this {org.jboss.core.widget.list.ListModelContainer}
 * @private
 */
org.jboss.core.widget.list.ListModelContainer.prototype.getNextNonEmptyListModelStartingFrom_ = function(index) {
  var r = goog.array.findIndex(this.models_, function(model, i) {
    return (i >= index && model.getSize() > 0);
  });
  return (r === -1 ? null : r);
};


/**
 * Returns index of the last non-empty {@link ListModel} before given index of {@link ListModel} including.
 * Returns null if not found.
 *
 * @param {number} index
 * @return {?number}
 * @this {org.jboss.core.widget.list.ListModelContainer}
 * @private
 */
org.jboss.core.widget.list.ListModelContainer.prototype.getPreviousNonEmptyListModelStartingFrom_ = function(index) {
  var r = goog.array.findIndexRight(this.models_, function(model, i) {
    return (i <= index && model.getSize() > 0);
  });
  return (r === -1 ? null : r);
};


/**
 * @return {?org.jboss.core.widget.list.ListModel}
 * @this {org.jboss.core.widget.list.ListModelContainer}
 * @private
 */
org.jboss.core.widget.list.ListModelContainer.prototype.getPointedListModel_ = function() {
  if (this.pointedModelIndex_ != null) {
    return this.models_[this.pointedModelIndex_];
  }
  return null;
};


/**
 * Returns index of {@link ListModel} within internal data structure containing {@link ListItem} having given id.
 *
 * @param {string} id
 * @return {?number}
 * @this {org.jboss.core.widget.list.ListModelContainer}
 * @private
 */
org.jboss.core.widget.list.ListModelContainer.prototype.findListModelIndex_ = function(id) {
  var index = goog.array.findIndex(
      this.models_,
      function(model) {
        return goog.string.startsWith(id, model.getId());
      }, this);
  return (index > -1 ? index : null);
};


/**
 * Returns index of {@link ListItem} having given id within internal data structure. If second optional
 * parameter is passed then the {@link ListItem} is searched only within this {@link ListModel}. Otherwise
 * appropriate {@link ListModel} is search first using the id parameter.
 *
 * TODO: remove if not used.
 *
 * @param {string} id
 * @param {org.jboss.core.widget.list.ListModel=} opt_listModel
 * @return {?number}
 * @private
 */
org.jboss.core.widget.list.ListModelContainer.prototype.findListItemIndex_ = function(id, opt_listModel) {
  var listModel = opt_listModel || this.getListModelById(id);
  if (listModel != null && goog.string.startsWith(id, listModel.getId())) {
    var listItemId = id.substr(listModel.getId().length);
    return listModel.getListItemIndexById(listItemId);
  }
  return null;
};


/**
 * Clear all internal {@link ListModel}s.  Clearing models does not cause an event to be fired.
 * TODO: remove if not used.
 * @this {org.jboss.core.widget.list.ListModelContainer}
 */
org.jboss.core.widget.list.ListModelContainer.prototype.clearModels = function() {
  goog.array.forEach(this.models_, function(model) {
    model.setData([], true);
  }, this);
};
