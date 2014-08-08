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
goog.provide('org.jboss.core.widget.list.mouse.MouseListener');
goog.provide('org.jboss.core.widget.list.mouse.MouseListener.EventType');

goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.events.Key');
goog.require('org.jboss.core.widget.list.ListView.Constants');



/**
 * Mouse listener listens on 'mouseenter', 'mouseleave' and 'click' events on given {@link HTMLElement}
 * and re-dispatches them wrapped in custom events. It is however possible to dispatch custom events
 * also by making call to respective methods. This implementation can be used in tests (because it is easy
 * to fire Up and Down events and it does not have to be tied to DOM element).
 *
 * @param {!HTMLElement} element the DOM element which is listened for mouse events
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.core.widget.list.mouse.MouseListener = function(element) {
  goog.events.EventTarget.call(this);

  /**
   * @type {!HTMLElement}
   * @private
   */
  this.element_ = element;

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.divListener_ = goog.events.listen(
      this.element_,
      [
        goog.events.EventType.CLICK,
        goog.events.EventType.MOUSEENTER,
        goog.events.EventType.MOUSELEAVE
      ],
      goog.bind(function(e) {
        var event = /** @type {goog.events.BrowserEvent} */ (e);
        if (event.target) {
          if (!goog.dom.classes.has(event.target, org.jboss.core.widget.list.ListView.Constants.LIST_ITEM_CLASS)) {
            event.stopPropagation();
            return;
          }
          switch (event.type) {
            case goog.events.EventType.MOUSEENTER:
              this.mouseenter(event.target);
              break;
            case goog.events.EventType.MOUSELEAVE:
              this.mouseleave(event.target);
              break;
            case goog.events.EventType.CLICK:
              event.stopPropagation();
              this.click(event.target);
              break;
          }
        }
      }, this),
      true // important: fire in capture phase
      );
};
goog.inherits(org.jboss.core.widget.list.mouse.MouseListener, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.core.widget.list.mouse.MouseListener.prototype.disposeInternal = function() {
  org.jboss.core.widget.list.mouse.MouseListener.superClass_.disposeInternal.call(this);
  if (this.divListener_ != null) {
    goog.events.unlistenByKey(this.divListener_);
    this.divListener_ = null;
  }
  delete this.element_;
};


/**
 * Dispatches event of type {@link org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSEENTER}.
 * @param {!Node} target
 */
org.jboss.core.widget.list.mouse.MouseListener.prototype.mouseenter = function(target) {
  this.dispatchEvent(
      new goog.events.Event(org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSEENTER, target)
  );
};


/**
 * Dispatches event of type {@link org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSELEAVE}.
 * @param {!Node} target
 */
org.jboss.core.widget.list.mouse.MouseListener.prototype.mouseleave = function(target) {
  this.dispatchEvent(
      new goog.events.Event(org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSELEAVE, target)
  );
};


/**
 * Dispatches event of type {@link org.jboss.core.widget.list.mouse.MouseListener.EventType.CLICK}.
 * @param {!Node} target
 */
org.jboss.core.widget.list.mouse.MouseListener.prototype.click = function(target) {
  this.dispatchEvent(
      new goog.events.Event(org.jboss.core.widget.list.mouse.MouseListener.EventType.CLICK, target)
  );
};


/**
 * Event types dispatched by {@link MouseListener}.
 * @enum {string}
 */
org.jboss.core.widget.list.mouse.MouseListener.EventType = {
  MOUSEENTER: goog.events.getUniqueId('mouse_enter'),
  MOUSELEAVE: goog.events.getUniqueId('mouse_leave'),
  CLICK: goog.events.getUniqueId('mouse_click')
};
