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
goog.require('goog.dom.query');
goog.require('org.jboss.core.Constants');
goog.require('org.jboss.core.widget.list.ListModel');



/**
 * A view representing a single {@link ListModel}. But it is not strictly tied to the {@link ListModel},
 * see {@link #constructNewDOM()}.
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
 * The DOM for {@link ListModel} is represented by enclosing DIV with nested DIVs, one for each {@link ListItem}.
 * Each {@link ListItem} DIV has generated ID attribute, value of the ID is "${ListView.id}"+"${ListItem.id}".
 * This assumes the ID value of {@link ListView} must be distinct enough.
 * There is also one DIV for the list caption in the beginning of the list, it has no ID attribute.
 * If the data is empty then it generates just the enclosing list DIV, the caption is not generated too in this case.
 *
 * See ListViewContainer_test.js.
 *
 * @param {org.jboss.core.widget.list.ListModel=} opt_listModel
 * @return {!Element}
 */
org.jboss.core.widget.list.ListView.prototype.constructNewDOM = function(opt_listModel) {
  // Soy template could be used instead...
  var element = goog.dom.createDom(goog.dom.TagName.DIV, 'list'); // TODO: create new Constant
  if (goog.isDefAndNotNull(opt_listModel)) {
    var data = opt_listModel.getData();
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
            if (opt_listModel.isItemSelected(listItem.getId())) {
              goog.dom.classes.add(item, org.jboss.core.Constants.SELECTED);
            }
            // goog.dom.appendChild(item, goog.dom.createTextNode(listItem.getValue()));
            // TODO: we need to be careful about XSS and catching click event with nested elements!
            goog.dom.appendChild(item, goog.dom.htmlToDocumentFragment(listItem.getValue()));
            goog.dom.appendChild(element, item);
          },
          this
      );
    }
  }
  return element;
};


/**
 * Add selected class into list item at 'index' position within provided DOM.
 *
 * @param {!Element} element
 * @param {number} index
 * @suppress {deprecated}
 */
org.jboss.core.widget.list.ListView.prototype.pointInDOM = function(element, index) {
  var candidates = goog.dom.query('.li', element);
  if (candidates.length > index) {
    goog.dom.classes.add(candidates[index], org.jboss.core.Constants.POINTED);
  }
};


/**
 * Deselect all selected items in provided DOM.
 *
 * @param {!Element} element
 */
org.jboss.core.widget.list.ListView.prototype.depointInDOM = function(element) {
  var found = goog.dom.findNodes(element, function(node) {
    return goog.dom.classes.has(node, org.jboss.core.Constants.POINTED);
  });
  goog.array.forEach(found, function(node) {
    goog.dom.classes.remove(node, org.jboss.core.Constants.POINTED);
  });
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
