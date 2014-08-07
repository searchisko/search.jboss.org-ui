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
goog.provide('org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.events.Key');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener.EventType');



/**
 * Implementation of {@link KeyboardListener} that catches KEY_UP, KEY_DOWN and KEY_ENTER events from given
 * {@link HTMLInputElement} and translates them to respective
 * {@link org.jboss.core.widget.list.keyboard.KeyboardListener.EventType}s.
 *
 * @param {!HTMLInputElement} inputField
 * @constructor
 * @extends {org.jboss.core.widget.list.keyboard.KeyboardListener}
 */
org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener = function(inputField) {
  org.jboss.core.widget.list.keyboard.KeyboardListener.call(this);

  /**
   * @type {!HTMLInputElement}
   * @private
   */
  this.input_ = inputField;

  /**
   * @type {goog.events.KeyHandler}
   * @private
   */
  this.keyHandler_ = new goog.events.KeyHandler(this.input_);

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.listenerId_ = goog.events.listen(
      this.keyHandler_,
      goog.events.KeyHandler.EventType.KEY,
      goog.bind(function(e) {
        var keyEvent = /** @type {goog.events.KeyEvent} */ (e);
        switch (keyEvent.keyCode) {
          case goog.events.KeyCodes.DOWN:
            keyEvent.preventDefault();
            this.dispatchEvent(
                new goog.events.Event(org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.DOWN)
            );
            break;
          case goog.events.KeyCodes.UP:
            keyEvent.preventDefault();
            this.dispatchEvent(
                new goog.events.Event(org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.UP)
            );
            break;
          case goog.events.KeyCodes.ENTER:
            keyEvent.preventDefault();
            this.dispatchEvent(
                new goog.events.Event(org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.ENTER)
            );
            break;
        }
      }, this));
};
goog.inherits(org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener,
    org.jboss.core.widget.list.keyboard.KeyboardListener);


/** @inheritDoc */
org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener.prototype.disposeInternal = function() {
  org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener.superClass_.disposeInternal.call(this);
  goog.events.unlistenByKey(this.listenerId_);
  goog.dispose(this.keyHandler_);
  delete this.input_;
};
