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
 * @fileoverview Single list item.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */
goog.provide('org.jboss.core.widget.list.ListItem');
goog.provide('org.jboss.core.widget.list.ListItemId');


/**
 * Type alias for {@link ListItem} id. In fact it is just a string but
 * having distinct type for it allows us to make sure we do not pass arbitrary
 * values to methods that expect parameter of type of "list item id".
 * This makes the code a little bit more robust (providing Closure Compiler is used of course).
 *
 * @typedef {string}
 */
org.jboss.core.widget.list.ListItemId;



/**
 * Represents a single item in the {@link ListModel}.
 *
 * @param {org.jboss.core.widget.list.ListItemId} id
 * @param {string} value
 * @param {boolean=} opt_selected true if the item is selected
 * @constructor
 */
org.jboss.core.widget.list.ListItem = function(id, value, opt_selected) {

  /**
   * @type {org.jboss.core.widget.list.ListItemId}
   * @private
   */
  this.id_ = id;

  /**
   * @type {string}
   * @private
   */
  this.value_ = value;

  /**
   * @type {boolean}
   * @private
   */
  this.selected_ = opt_selected || false;
};


/**
 * @return {org.jboss.core.widget.list.ListItemId}
 */
org.jboss.core.widget.list.ListItem.prototype.getId = function() {
  return this.id_;
};


/**
 * @return {string}
 */
org.jboss.core.widget.list.ListItem.prototype.getValue = function() {
  return this.value_;
};


/**
 * @return {boolean}
 */
org.jboss.core.widget.list.ListItem.prototype.isSelected = function() {
  return this.selected_;
};


/**
 * @param {boolean} selected
 */
org.jboss.core.widget.list.ListItem.prototype.setSelected = function(selected) {
  this.selected_ = selected;
};
