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
 * @fileoverview Data source list items repeater.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.widget.list.datasource.RepeaterDataSource');

goog.require('goog.events.EventTarget');
goog.require('org.jboss.core.widget.list.ListItem');
goog.require('org.jboss.core.widget.list.datasource.DataSource');
goog.require('org.jboss.core.widget.list.datasource.DataSourceEvent');



/**
 * {@link RepeaterDataSource} is similar to {@link EchoDataSource} except that
 * it does not react to client query but immediately emits (repeat) given {@link ListItem}s.
 *
 * @constructor
 * @implements {org.jboss.core.widget.list.datasource.DataSource}
 * @extends {goog.events.EventTarget}
 */
org.jboss.core.widget.list.datasource.RepeaterDataSource = function() {
  goog.events.EventTarget.call(this);

};
goog.inherits(org.jboss.core.widget.list.datasource.RepeaterDataSource, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.core.widget.list.datasource.RepeaterDataSource.prototype.disposeInternal = function() {
  org.jboss.core.widget.list.datasource.RepeaterDataSource.superClass_.disposeInternal.call(this);
};


/**
 * Dispatches given items immediately.
 *
 * @param {!Array.<org.jboss.core.widget.list.ListItem>} items
 */
org.jboss.core.widget.list.datasource.RepeaterDataSource.prototype.repeat = function(items) {
  this.dispatchEvent(
      new org.jboss.core.widget.list.datasource.DataSourceEvent(items)
  );
};


/** @inheritDoc */
org.jboss.core.widget.list.datasource.RepeaterDataSource.prototype.get = function() {
  // no-op
};


/** @inheritDoc */
org.jboss.core.widget.list.datasource.RepeaterDataSource.prototype.abort = function() {
  // no-op
};


/** @inheritDoc */
org.jboss.core.widget.list.datasource.RepeaterDataSource.prototype.isActive = function() {
  return false;
};
