/*
 * JBoss, Home of Professional Open Source
 * Copyright 2014 Red Hat Inc. and/or its affiliates and other contributors
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
 * @fileoverview Object that dispatches events related to {@link NavigationService}.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.service.navigation.NavigationServiceDispatcher');
goog.provide('org.jboss.core.service.navigation.NavigationServiceEvent');
goog.provide('org.jboss.core.service.navigation.NavigationServiceEventType');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');


/**
 * Event types for NavigationService.
 * @enum {string}
 */
org.jboss.core.service.navigation.NavigationServiceEventType = {
  NEW_NAVIGATION: goog.events.getUniqueId('new_navigation')
};



/**
 * Crate a new instance.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.core.service.navigation.NavigationServiceDispatcher = function() {
  goog.events.EventTarget.call(this);
};
goog.inherits(org.jboss.core.service.navigation.NavigationServiceDispatcher, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.core.service.navigation.NavigationServiceDispatcher.prototype.disposeInternal = function() {
  org.jboss.core.service.navigation.NavigationServiceDispatcher.superClass_.disposeInternal.call(this);
};


/**
 * Dispatches {@link NavigationServiceEvent}.
 * @param {string} token
 */
org.jboss.core.service.navigation.NavigationServiceDispatcher.prototype.dispatchNewNavigation = function(token) {
  this.dispatchEvent(
      new org.jboss.core.service.navigation.NavigationServiceEvent(
          org.jboss.core.service.navigation.NavigationServiceEventType.NEW_NAVIGATION, token
      )
  );
};



/**
 * @param {org.jboss.core.service.navigation.NavigationServiceEventType} type
 * @param {string} token
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.core.service.navigation.NavigationServiceEvent = function(type, token) {
  goog.events.Event.call(this, type);

  /**
   * @type {string}
   * @private
   */
  this.token_ = token;
};
goog.inherits(org.jboss.core.service.navigation.NavigationServiceEvent, goog.events.Event);


/**
 * Return event token.
 * @return {string}
 */
org.jboss.core.service.navigation.NavigationServiceEvent.prototype.getToken = function() {
  return this.token_;
};
