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
 * @fileoverview Single list item.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */
goog.provide('org.jboss.core.widget.list.ListItem');



/**
 *
 * @param {string} id
 * @param {string} value
 * @constructor
 */
org.jboss.core.widget.list.ListItem = function(id, value) {

  /**
   * @type {string}
   * @private
   */
  this.id_ = id;

  /**
   * @type {string}
   * @private
   */
  this.value_ = value;
};


/**
 *
 * @return {string}
 */
org.jboss.core.widget.list.ListItem.prototype.getId = function() {
  return this.id_;
};


/**
 *
 * @return {string}
 */
org.jboss.core.widget.list.ListItem.prototype.getValue = function() {
  return this.value_;
};
