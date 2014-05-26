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

goog.provide('org.jboss.core.widget.list.BaseListController');

goog.require('goog.Disposable');
goog.require('org.jboss.core.widget.list.ListController');
goog.require('org.jboss.core.widget.list.ListModelContainer');
goog.require('org.jboss.core.widget.list.ListViewContainer');



/**
 * Base implementation of {@link ListController}. Implementing
 * classes are expected to extend from it.
 *
 * Note: Do not forget to call superclass' disposeInternal in
 * implementing classes to get active data sources aborted and
 * disposed on lmc and lvc properly.
 *
 * @param {!org.jboss.core.widget.list.ListModelContainer} lmc
 * @param {!org.jboss.core.widget.list.ListViewContainer} lvc
 * @constructor
 * @implements {org.jboss.core.widget.list.ListController}
 * @extends {goog.Disposable}
 */
org.jboss.core.widget.list.BaseListController = function(lmc, lvc) {
  goog.Disposable.call(this);

  /**
   * @type {!org.jboss.core.widget.list.ListModelContainer}
   * @protected
   */
  this.lmc_ = lmc;

  /**
   * @type {!org.jboss.core.widget.list.ListViewContainer}
   * @protected
   */
  this.lvc_ = lvc;
};
goog.inherits(org.jboss.core.widget.list.BaseListController, goog.Disposable);


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.disposeInternal = function() {
  org.jboss.core.widget.list.BaseListController.superClass_.disposeInternal.call(this);
  // abort any active data sources first!
  this.abortActiveDataResources();
  // do regular cleanup now
  this.lmc_.dispose();
  this.lvc_.dispose();
  delete this.lmc_;
  delete this.lvc_;
};


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.input = function(query) {
  // implement in subclass
};


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.abortActiveDataResources = function() {
  // implement in subclass
};


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.getActiveDataResourcesCount = function() {
  // implement in subclass
};


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.setKeyboardListener = function() {
  // implement in subclass
};


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.setMouseListener = function() {
  // implement in subclass
};
