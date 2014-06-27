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
 * @fileoverview BaseListController can be extended by classes that
 * implement {@link ListController}.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.widget.list.BaseListController');

goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('org.jboss.core.widget.list.ListController');
goog.require('org.jboss.core.widget.list.ListModelContainer');
goog.require('org.jboss.core.widget.list.ListViewContainer');
goog.require('org.jboss.core.widget.list.datasource.DataSource');



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
 * @extends {goog.events.EventTarget}
 */
org.jboss.core.widget.list.BaseListController = function(lmc, lvc) {
  goog.events.EventTarget.call(this);

  /**
   * @type {!org.jboss.core.widget.list.ListModelContainer}
   * @private
   */
  this.lmc_ = lmc;

  /**
   * @type {!org.jboss.core.widget.list.ListViewContainer}
   * @private
   */
  this.lvc_ = lvc;
};
goog.inherits(org.jboss.core.widget.list.BaseListController, goog.events.EventTarget);


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


/**
 * Method for subclasses to get access to {@link ListModelContainer}.
 *
 * @return {!org.jboss.core.widget.list.ListModelContainer}
 * @protected
 */
org.jboss.core.widget.list.BaseListController.prototype.getListModelContainer = function() {
  return this.lmc_;
};


/**
 * Method for subclasses to get access to {@link ListViewContainer}.
 *
 * @return {!org.jboss.core.widget.list.ListViewContainer}
 * @protected
 */
org.jboss.core.widget.list.BaseListController.prototype.getListViewContainer = function() {
  return this.lvc_;
};


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.input = function(query) {
  throw new Error('Method not implemented!');
};


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.abortActiveDataResources = function() {
  throw new Error('Method not implemented!');
};


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.getActiveDataResourcesCount = function() {
  throw new Error('Method not implemented!');
};


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.setKeyboardListener = function() {
  throw new Error('Method not implemented!');
};


/** @inheritDoc */
org.jboss.core.widget.list.BaseListController.prototype.setMouseListener = function() {
  throw new Error('Method not implemented!');
};


/**
 * Returns number of active data sources.
 * @param {!Array.<org.jboss.core.widget.list.datasource.DataSource>} dataSources
 * @return {number}
 * @protected
 */
org.jboss.core.widget.list.BaseListController.prototype.getActiveDataResourcesCountInternal = function(dataSources) {
  return goog.array.reduce(dataSources, function(r, v) {
    return (r += v.isActive() ? 1 : 0);
  }, 0);
};


/**
 * Abort all provided {@link DataSource}s is they are active.
 * @param {!Array.<org.jboss.core.widget.list.datasource.DataSource>} dataSources
 * @protected
 */
org.jboss.core.widget.list.BaseListController.prototype.abortActiveDataResourcesInternal = function(dataSources) {
  goog.array.forEach(dataSources, function(item) {
    var ds = /** @type {org.jboss.core.widget.list.datasource.DataSource} */ (item);
    if (ds.isActive()) {
      ds.abort();
    }
  });
};
