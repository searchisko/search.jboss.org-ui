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
 * @fileoverview Implementation of {@link NavigationService} that is bound to {@link goog.History}.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.service.navigation.NavigationServiceHistory');

goog.require('goog.Disposable');
goog.require('goog.History');
goog.require('goog.events');
goog.require('goog.history.Event');
goog.require('goog.history.EventType');
goog.require('org.jboss.core.service.navigation.NavigationService');



/**
 * @param {!org.jboss.core.service.navigation.NavigationServiceDispatcher} dispatcher
 * @param {!goog.History} history
 * @constructor
 * @implements {org.jboss.core.service.navigation.NavigationService}
 * @extends {goog.Disposable}
 */
org.jboss.core.service.navigation.NavigationServiceHistory = function(dispatcher, history) {
  goog.Disposable.call(this);

  /**
   * @type {!org.jboss.core.service.navigation.NavigationServiceDispatcher}
   * @private
   */
  this.dispatcher_ = dispatcher;

  /**
   * @type {!goog.History}
   * @private
   */
  this.history_ = history;

  this.historyListenerKey_ = goog.events.listen(
      this.history_,
      goog.history.EventType.NAVIGATE,
      function(e) {
        var event = /** @type {goog.history.Event} */ (e);
        this.dispatcher_.dispatchNewNavigation(event.token);
      }, false, this
      );
};
goog.inherits(org.jboss.core.service.navigation.NavigationServiceHistory, goog.Disposable);


/** @inheritDoc */
org.jboss.core.service.navigation.NavigationServiceHistory.prototype.disposeInternal = function() {
  org.jboss.core.service.navigation.NavigationServiceHistory.superClass_.disposeInternal.call(this);
  goog.events.unlistenByKey(this.historyListenerKey_);
  delete this.dispatcher_;
  delete this.history_;
};


/** @inheritDoc */
org.jboss.core.service.navigation.NavigationServiceHistory.prototype.navigate = function(token) {
  this.history_.setToken(token);
};


/** @inheritDoc */
org.jboss.core.service.navigation.NavigationServiceHistory.prototype.setEnable = function(flag) {
  this.history_.setEnabled(flag);
};
