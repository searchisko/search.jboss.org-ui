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
 * @fileoverview Basic implementation of LookUp interface.  It is assumed that other modules will
 * extend this class and add more services according to their needs.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.service.LookUpImpl');

goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeParse');
goog.require('goog.net.XhrManager');
goog.require('org.jboss.core.Variables');
goog.require('org.jboss.core.service.LookUp');
goog.require('org.jboss.core.service.navigation.NavigationService');
goog.require('org.jboss.core.service.navigation.NavigationServiceDispatcher');
goog.require('org.jboss.core.service.query.QueryService');
goog.require('org.jboss.core.service.query.QueryServiceDispatcher');
goog.require('org.jboss.core.util.ImageLoader');
goog.require('org.jboss.core.util.ImageLoaderNoop');



/**
 * LookUp implementation that provides just basic services (XhrManager, History and ImageLoader).
 * Extend this class to add more services.
 * @constructor
 * @implements {org.jboss.core.service.LookUp}
 */
org.jboss.core.service.LookUpImpl = function() {

  /**
   * @type {goog.net.XhrManager}
   * @private
   */
  this.xhrManager_;

  /**
   * @type {org.jboss.core.service.navigation.NavigationService}
   * @private
   */
  this.navigationService_;

  /**
   * @type {org.jboss.core.service.navigation.NavigationServiceDispatcher}
   * @private
   */
  this.navigationServiceDispatcher_;

  /**
   * @type {org.jboss.core.util.ImageLoader}
   * @private
   */
  this.imageLoader_;

  /**
   * @type {goog.i18n.DateTimeFormat}
   * @private
   */
  this.shortDateFormatter_;

  /**
   * @type {goog.i18n.DateTimeFormat}
   * @private
   */
  this.mediumDateFormatter_;

  /**
   * @type {goog.i18n.DateTimeParse}
   * @private
   */
  this.shortDateParser_;

  /**
   * @type {org.jboss.core.service.query.QueryService}
   * @private
   */
  this.queryService_;

  /**
   * @type {org.jboss.core.service.query.QueryServiceDispatcher}
   * @private
   */
  this.queryServiceDispatcher_;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getShortDateFormatter = function() {
  if (!goog.isDefAndNotNull(this.shortDateFormatter_)) {
    this.shortDateFormatter_ = new goog.i18n.DateTimeFormat(org.jboss.core.Variables.SHORT_DATE_FORMAT);
  }
  return this.shortDateFormatter_;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getMediumDateFormatter = function() {
  if (!goog.isDefAndNotNull(this.mediumDateFormatter_)) {
    this.mediumDateFormatter_ = new goog.i18n.DateTimeFormat(org.jboss.core.Variables.MEDIUM_DATE_FORMAT);
  }
  return this.mediumDateFormatter_;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getXhrManager = function() {
  if (!goog.isDefAndNotNull(this.xhrManager_)) {
    this.xhrManager_ = new goog.net.XhrManager();
  }
  return this.xhrManager_;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.setNavigationService = function (navigationService) {
  this.navigationService_ = navigationService;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getNavigationService = function() {
  if (goog.isDefAndNotNull(this.navigationService_)) { return this.navigationService_; }
  throw Error('NavigationService has not been set yet!');
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getNavigationServiceDispatcher = function() {
  if (!goog.isDefAndNotNull(this.navigationServiceDispatcher_)) {
    this.navigationServiceDispatcher_ = new org.jboss.core.service.navigation.NavigationServiceDispatcher();
  }
  return this.navigationServiceDispatcher_;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getImageLoader = function() {
  if (!goog.isDefAndNotNull(this.imageLoader_)) {
    this.imageLoader_ = new org.jboss.core.util.ImageLoaderNoop();
  }
  return this.imageLoader_;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.setImageLoader = function(imageLoader) {
  // TODO: make sure to dispose all resources kept by imageLoader_ if it is already set.
  this.imageLoader_ = imageLoader;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getShortDateParser = function() {
  if (!goog.isDefAndNotNull(this.shortDateParser_)) {
    this.shortDateParser_ = new goog.i18n.DateTimeParse(org.jboss.core.Variables.SHORT_DATE_FORMAT);
  }
  return this.shortDateParser_;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.setQueryService = function(queryService) {
  this.queryService_ = queryService;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getQueryService = function() {
  return this.queryService_;
};


/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getQueryServiceDispatcher = function() {
  if (!goog.isDefAndNotNull(this.queryServiceDispatcher_)) {
    this.queryServiceDispatcher_ = new org.jboss.core.service.query.QueryServiceDispatcher();
  }
  return this.queryServiceDispatcher_;
};
