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
goog.provide('org.jboss.core.widget.list.ListView');
goog.provide('org.jboss.core.widget.list.ListView.Constants');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('org.jboss.core.Constants');
goog.require('org.jboss.core.widget.list.ListItem');



/**
 * A view representing a single {@link ListModel}. But it is not strictly tied to the {@link ListModel},
 * see {@link #constructDOM()}.
 *
 * @param {string} id
 * @param {?string} caption
 * @constructor
 */
org.jboss.core.widget.list.ListView = function(id, caption) {

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
};


/**
 * Return {@link ListView} id.
 *
 * @return {string}
 */
org.jboss.core.widget.list.ListView.prototype.getId = function() {
  return this.id_;
};


/**
 * Return {@link ListView} caption.  Can be <code>null</code>.
 *
 * @return {?string}
 */
org.jboss.core.widget.list.ListView.prototype.getCaption = function() {
  return this.caption_;
};


/**
 * Constructs DOM from the data.
 * The DOM for {@link ListView} is represented by enclosing DIV with nested DIVs, one for each {@link ListItem}.
 * Each {@link ListItem} DIV has generated ID attribute, value of the ID is "${ListView.id}"+"${ListItem.id}".
 * This assumes the ID value of {@link ListView} must be distinct enough.
 * There is also one DIV for the list caption in the beginning of the list, it has no ID attribute.
 * If the data is empty then it generates just the enclosing list DIV, the caption is not generated too in this case.
 *
 * See ListViewContainer_test.js.
 *
 * @param {!Array.<org.jboss.core.widget.list.ListItem>} data
 * @param {number=} opt_selectedIndex
 * @return {!Element}
 */
org.jboss.core.widget.list.ListView.prototype.constructDOM = function(data, opt_selectedIndex) {
  // Soy template could be used instead...
  var element = goog.dom.createDom(goog.dom.TagName.DIV, 'list'); // TODO: create new Constant
  if (!goog.array.isEmpty(data)) {
    if (this.caption_ != null) {
      var caption = goog.dom.createDom(goog.dom.TagName.DIV, 'caption'); // TODO: create new Constant
      goog.dom.appendChild(caption, goog.dom.createTextNode(this.caption_));
      goog.dom.appendChild(element, caption);
    }
    goog.array.forEach(
        data,
        function(listItem, index) {
          var item = goog.dom.createDom(goog.dom.TagName.DIV,
              {
                'id': this.constructElementId_(listItem),
                'class': org.jboss.core.widget.list.ListView.Constants.LIST_ITEM_CLASS
              }
              );
          if (goog.isDef(opt_selectedIndex) && index == opt_selectedIndex) {
            goog.dom.classes.add(item, org.jboss.core.Constants.SELECTED);
          }
          goog.dom.appendChild(item, goog.dom.createTextNode(listItem.getValue()));
          goog.dom.appendChild(element, item);
        },
        this
    );
  }
  return element;
};


/**
 *
 * @param {org.jboss.core.widget.list.ListItem} listItem
 * @return {string}
 * @private
 */
org.jboss.core.widget.list.ListView.prototype.constructElementId_ = function(listItem) {
  return this.id_ + listItem.getId();
};


/**
 * Class name used by list items.
 */
org.jboss.core.widget.list.ListView.Constants = {
  /**
   * Class name used on "pointable" list items.
   * @type {string}
   * @const
   */
  LIST_ITEM_CLASS: 'li'
};
