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
 * @fileoverview Example of controller used in tests.
 * It is stripped out from code during advanced compilation.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.widget.list.EchoListControllerTest');
goog.provide('org.jboss.core.widget.list.EchoListControllerTest.KEYS');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.Key');
goog.require('org.jboss.core.widget.list.BaseListController');
goog.require('org.jboss.core.widget.list.ListController');
goog.require('org.jboss.core.widget.list.ListModelContainer');
goog.require('org.jboss.core.widget.list.ListViewContainer');
goog.require('org.jboss.core.widget.list.datasource.DataSourceEvent');
goog.require('org.jboss.core.widget.list.datasource.DataSourceEventType');
goog.require('org.jboss.core.widget.list.datasource.EchoDataSource');
goog.require('org.jboss.core.widget.list.event.ListModelEvent');
goog.require('org.jboss.core.widget.list.event.ListModelEventType');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener.EventType');
goog.require('org.jboss.core.widget.list.mouse.MouseListener');
goog.require('org.jboss.core.widget.list.mouse.MouseListener.EventType');

goog.setTestOnly('org.jboss.core.widget.list.EchoListControllerTest should be used in tests only');



/**
 * Constructor of controller that use {@link EchoDataSource}s to populate
 * view model.  It is used for tests and provides a very simple example
 * of how controllers should be implemented.
 *
 * It assumes two model views in input list containers and uses dedicated {@link EchoDataSource}
 * for each model. It allows to specify response delays of data sources via additional
 * constructor parameters.
 *
 * @param {!org.jboss.core.widget.list.ListModelContainer} lmc
 * @param {!org.jboss.core.widget.list.ListViewContainer} lvc
 * @param {{delay: number, repFactor: number}} conf1 config of the first {@link EchoDataSource}
 * @param {{delay: number, repFactor: number}} conf2 config of the second {@link EchoDataSource}
 * @constructor
 * @implements {org.jboss.core.widget.list.ListController}
 * @extends {org.jboss.core.widget.list.BaseListController}
 */
org.jboss.core.widget.list.EchoListControllerTest = function(lmc, lvc, conf1, conf2) {
  org.jboss.core.widget.list.BaseListController.call(this, lmc, lvc);

  /**
   * @type {?org.jboss.core.widget.list.keyboard.KeyboardListener}
   * @private
   */
  this.keyboardListener_ = null;

  /**
   * Keyboard listener key.
   * @type {?goog.events.Key}
   * @private
   */
  this.keyboardListenerId_ = null;

  /**
   * @type {?org.jboss.core.widget.list.mouse.MouseListener}
   * @private
   */
  this.mouseListener_ = null;

  /**
   * Mouse listener key.
   * @type {?goog.events.Key}
   * @private
   */
  this.mouseListenerId_ = null;

  /**
   * @type {org.jboss.core.widget.list.datasource.EchoDataSource}
   * @private
   */
  this.echoDS1_ = new org.jboss.core.widget.list.datasource.EchoDataSource(conf1);

  /**
   * @type {org.jboss.core.widget.list.datasource.EchoDataSource}
   * @private
   */
  this.echoDS2_ = new org.jboss.core.widget.list.datasource.EchoDataSource(conf2);

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.echoDSlistenerId1_ = goog.events.listen(
      this.echoDS1_,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      function(event) {
        var e = /** @type {org.jboss.core.widget.list.datasource.DataSourceEvent} */ (event);
        var model1 = this.getListModelContainer().getListModelById(
            org.jboss.core.widget.list.EchoListControllerTest.KEYS.KEY1
            );
        if (model1 != null) {
          model1.setData(e.getData());
        }
      },
      false, this
      );

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.echoDSlistenerId2_ = goog.events.listen(
      this.echoDS2_,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      goog.bind(function(event) {
        var e = /** @type {org.jboss.core.widget.list.datasource.DataSourceEvent} */ (event);
        var model2 = this.getListModelContainer().getListModelById(
            org.jboss.core.widget.list.EchoListControllerTest.KEYS.KEY2
            );
        if (model2 != null) {
          model2.setData(e.getData());
        }
      }, this));

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.listItemSelectedId_ = goog.events.listen(
      this.getListModelContainer(),
      [
        org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED,
        org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED
      ],
      goog.bind(function(e) {
        var event = /** @type {org.jboss.core.widget.list.event.ListModelEvent} */ (e);
        var data = event.target.getData();
        var index = event.getItemIndex();

        if (index < data.length) {
          switch (event.type) {
            case org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED:
              // console.log('selected', event);
              break;

            case org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED:
              // console.log('deselected', event);
              break;
          }
        }
      }, this));
};
goog.inherits(org.jboss.core.widget.list.EchoListControllerTest, org.jboss.core.widget.list.BaseListController);


/** @inheritDoc */
org.jboss.core.widget.list.EchoListControllerTest.prototype.disposeInternal = function() {
  org.jboss.core.widget.list.EchoListControllerTest.superClass_.disposeInternal.call(this);
  goog.events.unlistenByKey(this.echoDSlistenerId1_);
  goog.events.unlistenByKey(this.echoDSlistenerId2_);
  goog.events.unlistenByKey(this.listItemSelectedId_);
  goog.dispose(this.echoDS1_);
  goog.dispose(this.echoDS2_);
  this.unlistenKeyboardListenerId_();
  this.keyboardListener_ = null;
  this.unlistenMouseListenerId_();
  this.mouseListener_ = null;
};


/** @inheritDoc */
org.jboss.core.widget.list.EchoListControllerTest.prototype.input = function(query) {
  this.abortActiveDataResources();
  this.getListModelContainer().depointPointedListItem();
  this.echoDS1_.get(query);
  this.echoDS2_.get(query);
};


/** @inheritDoc */
org.jboss.core.widget.list.EchoListControllerTest.prototype.abortActiveDataResources = function() {
  this.abortActiveDataResourcesInternal([this.echoDS1_, this.echoDS2_]);
};


/** @inheritDoc */
org.jboss.core.widget.list.EchoListControllerTest.prototype.getActiveDataResourcesCount = function() {
  return this.getActiveDataResourcesCountInternal([this.echoDS1_, this.echoDS2_]);
};


/**
 * Unlisten keyboard listener ID and set it to null.
 * @private
 */
org.jboss.core.widget.list.EchoListControllerTest.prototype.unlistenKeyboardListenerId_ = function() {
  if (this.keyboardListenerId_ != null) {
    goog.events.unlistenByKey(this.keyboardListenerId_);
    this.keyboardListenerId_ = null;
  }
};


/**
 * Unlisten mouse listener ID and set it to null.
 * @private
 */
org.jboss.core.widget.list.EchoListControllerTest.prototype.unlistenMouseListenerId_ = function() {
  if (this.mouseListenerId_ != null) {
    goog.events.unlistenByKey(this.mouseListenerId_);
    this.mouseListenerId_ = null;
  }
};


/** @inheritDoc */
org.jboss.core.widget.list.EchoListControllerTest.prototype.setKeyboardListener = function(opt_keyboardListener) {

  // unlisten keyboard listeners
  this.unlistenKeyboardListenerId_();
  this.keyboardListener_ = null;

  // setup new keyboard listener and subscribe to UP, DOWN and ENTER events
  if (goog.isDefAndNotNull(opt_keyboardListener)) {
    this.keyboardListener_ = opt_keyboardListener;

    this.keyboardListenerId_ = goog.events.listen(
        this.keyboardListener_,
        [
          org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.UP,
          org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.DOWN,
          org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.ENTER
        ],
        goog.bind(function(e) {
          var event = /** @type {goog.events.Event} */ (e);
          switch (event.type) {
            case org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.UP:
              this.getListModelContainer().pointPreviousListItem();
              break;
            case org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.DOWN:
              this.getListModelContainer().pointNextListItem();
              break;
            case org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.ENTER:
              this.getListModelContainer().toggleSelectedPointedListItem();
              break;
          }
        }, this));
  }
};


/** @inheritDoc */
org.jboss.core.widget.list.EchoListControllerTest.prototype.setMouseListener = function(opt_mouseListener) {

  // unlisten mouse listeners
  this.unlistenMouseListenerId_();
  this.mouseListener_ = null;

  // setup new mouse listener and subscribe to events
  if (goog.isDefAndNotNull(opt_mouseListener)) {
    this.mouseListener_ = opt_mouseListener;

    this.mouseListenerId_ = goog.events.listen(
        this.mouseListener_,
        [
          org.jboss.core.widget.list.mouse.MouseListener.EventType.CLICK,
          org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSEENTER,
          org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSELEAVE
        ],
        goog.bind(function(e) {
          var event = /** @type {goog.events.Event} */ (e);
          switch (event.type) {
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSEENTER:
              this.getListModelContainer().pointListItemById(event.target.id);
              break;
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSELEAVE:
              this.getListModelContainer().depointPointedListItem();
              break;
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.CLICK:
              this.getListModelContainer().pointListItemById(event.target.id);
              this.getListModelContainer().toggleSelectedPointedListItem();
              break;
          }
        }, this));
  }
};


/**
 * Item list keys used in tests. This is demonstration that
 * it can be useful to introduce constants for list keys.
 *
 * @enum {string}
 */
org.jboss.core.widget.list.EchoListControllerTest.KEYS = {
  KEY1: 'c1',
  KEY2: 'c2'
};
