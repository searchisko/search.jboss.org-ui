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

goog.provide('org.jboss.core.widget.list.keyboard.KeyboardListener');
goog.provide('org.jboss.core.widget.list.keyboard.KeyboardListener.EventType');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');



/**
 * This class is expected to be used as a base class of other keyboard listener implementations.
 * This implementation can be though used in tests (because it is easy to fire the events
 * and it does not have to be tied to DOM element).
 * Other implementations are expected to extend from this class.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.core.widget.list.keyboard.KeyboardListener = function() {
  goog.events.EventTarget.call(this);

};
goog.inherits(org.jboss.core.widget.list.keyboard.KeyboardListener, goog.events.EventTarget);


/**
 * Dispatches event of type {@link org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.UP}.
 */
org.jboss.core.widget.list.keyboard.KeyboardListener.prototype.up = function() {
  this.dispatchEvent(
      new goog.events.Event(org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.UP)
  );
};


/**
 * Dispatches event of type {@link org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.DOWN}.
 */
org.jboss.core.widget.list.keyboard.KeyboardListener.prototype.down = function() {
  this.dispatchEvent(
      new goog.events.Event(org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.DOWN)
  );
};


/**
 * Dispatches event of type {@link org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.ENTER}.
 */
org.jboss.core.widget.list.keyboard.KeyboardListener.prototype.enter = function() {
  this.dispatchEvent(
      new goog.events.Event(org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.ENTER)
  );
};


/**
 * Event types dispatched by {@link KeyboardListener}.
 * @enum {string}
 */
org.jboss.core.widget.list.keyboard.KeyboardListener.EventType = {
  UP: goog.events.getUniqueId('up'),
  DOWN: goog.events.getUniqueId('down'),
  ENTER: goog.events.getUniqueId('enter')
};
