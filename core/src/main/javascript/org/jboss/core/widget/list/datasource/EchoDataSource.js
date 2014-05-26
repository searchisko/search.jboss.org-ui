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
 * @fileoverview Echo data source echoes input to output.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.widget.list.datasource.EchoDataSource');

goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('org.jboss.core.widget.list.ListItem');
goog.require('org.jboss.core.widget.list.datasource.DataSource');
goog.require('org.jboss.core.widget.list.datasource.DataSourceEvent');



/**
 * <ul>
 *   <li> opt_delay: number delay of firing the event in millis. By default the event is fired asap.
 *   <li> opt_repFactor: number how many records to produce. Default value is 1.
 * </ul>
 *
 * @param {{
 *          delay: number,
 *          repFactor: number
 *        }=} opt_conf
 * @constructor
 * @implements {org.jboss.core.widget.list.datasource.DataSource}
 * @extends {goog.events.EventTarget}
 */
org.jboss.core.widget.list.datasource.EchoDataSource = function(opt_conf) {
  goog.events.EventTarget.call(this);

  /**
   * @type {number}
   * @private
   */
  this.delay_ = (opt_conf && opt_conf.delay) ? opt_conf.delay : 0;

  /**
   * @type {number}
   * @private
   */
  this.replication_ = (opt_conf && opt_conf.repFactor) ? opt_conf.repFactor : 1;

  /**
   * @type {number|undefined}
   * @private
   */
  this.delayId_ = undefined;
};
goog.inherits(org.jboss.core.widget.list.datasource.EchoDataSource, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.core.widget.list.datasource.EchoDataSource.prototype.disposeInternal = function() {
  org.jboss.core.widget.list.datasource.EchoDataSource.superClass_.disposeInternal.call(this);
};


/** @inheritDoc */
org.jboss.core.widget.list.datasource.EchoDataSource.prototype.get = function(query) {
  var fnt = goog.bind(function() {
    /** @type {!Array.<org.jboss.core.widget.list.ListItem>} */
    var data = [];
    // ignore replication factor if query is empty
    if (!goog.string.isEmptySafe(query)) {
      for (var i = 0; i < this.replication_; i++) {
        data.push(new org.jboss.core.widget.list.ListItem('echo' + i, query));
      }
    }
    this.dispatchEvent(
        new org.jboss.core.widget.list.datasource.DataSourceEvent(data)
    );
    this.delayId_ = undefined;
  }, this);
  // execute immediately if query is empty, otherwise set defined timeout
  this.delayId_ = setTimeout(fnt, goog.string.isEmptySafe(query) ? 0 : this.delay_);
};


/** @inheritDoc */
org.jboss.core.widget.list.datasource.EchoDataSource.prototype.abort = function() {
  if (goog.isDef(this.delayId_)) {
    clearTimeout(this.delayId_);
    this.delayId_ = undefined;
  }
};


/** @inheritDoc */
org.jboss.core.widget.list.datasource.EchoDataSource.prototype.isActive = function() {
  return goog.isDef(this.delayId_);
};
