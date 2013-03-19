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
 * @fileoverview Encapsulates functionality around the search field.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.element.SearchFieldHandler');

goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.InputHandler');

goog.require("goog.Disposable");

goog.require('goog.debug.Logger');

/**
 * Creates a new search field handler.
 *
 * If the field gets event that modify the text then callback function gets called after delay(ms) unless there is
 * a custom handler defined for specific key.
 *
 * Custom handlers are called immediately (no delay). Custom handler functions are passed two arguments:
 * goog.events.KeyEvent event,
 * goog.async.Delay delay
 *
 * If blur event on the field occurs then blur handler is called if provided.
 *
 * @param {!HTMLInputElement} field Input field
 * @param {number} callbackDelay Delay in ms to call the callback
 * @param {!Function} callback a function to call after the delay
 * @param {Function=} opt_blurHandler a function to call on BLUR event
 * @param {Object.<(goog.events.KeyCodes|number), function(goog.events.KeyEvent, goog.async.Delay)>=} opt_keyHandlers user defined functions per keyCode
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.element.SearchFieldHandler = function(field, callbackDelay, callback, opt_blurHandler, opt_keyHandlers) {

    goog.Disposable.call(this);

//    var log = goog.debug.Logger.getLogger('SearchFieldHandler [' + field.id + ']');

    /** @private */ this.field_ = field;
    /** @private */ this.callbackDelay_ = callbackDelay;
    /** @private */ this.callback_ = callback;

    /**
     * @type {!Function}
     * @private
     */
    this.blurHandler_ = goog.isFunction(opt_blurHandler) ? opt_blurHandler : goog.nullFunction;

    /** @private */ this.keyHandlers_ = goog.isObject(opt_keyHandlers) ? opt_keyHandlers : {};

    /** @private */ this.keyListenerId_;

    /**
     * Listen to changes on search field.
     * @type {?number}
     * @private
     */
    this.changeListenerId_;

    /**
     * @type {?number}
     * @private
     */
    this.blurListenerId_;

    /**
     * Listen to clicks into search field.
     * @type {?number}
     * @private
     */
    this.clickListenerId_;

    /** @private */
    this.delay_ =  new goog.async.Delay(
        goog.bind(function(){ callback(this.field_.value) }, this),
        this.callbackDelay_
    );

    /** @private */
    this.keyHandler_ =  new goog.events.KeyHandler(this.field_);

    // listen for key strokes
    this.keyListenerId_ = goog.events.listen(this.keyHandler_,
        goog.events.KeyHandler.EventType.KEY,
        goog.bind(function(e) {

            var keyEvent = /** @type {goog.events.KeyEvent} */ (e);
//            log.finest("keyEvent: " + goog.debug.expose(keyEvent));

            if (goog.object.get(this.keyHandlers_, keyEvent.keyCode.toString(10))) {
                this.keyHandlers_[keyEvent.keyCode](keyEvent, this.delay_);
            }
            else if (goog.events.KeyCodes.isTextModifyingKeyEvent(/** @type {goog.events.BrowserEvent} */ (e))) {
                this.delay_.start();
            }
        }, this)
    );

    this.blurListenerId_ = goog.events.listen(this.field_, goog.events.EventType.BLUR,
        // using function wrapper because this.blurHandler_() would be passed the event as a parameter
        goog.bind(function(){ this.blurHandler_() }, this)
    );

    /** @private */
    this.inputHandler_ = new goog.events.InputHandler(this.field_);

    // this listener can catch cut & paste in search field
    this.changeListenerId_ = goog.events.listen(this.inputHandler_, goog.events.EventType.INPUT,
        // using function wrapper because this.delay_.start() would be passed the event as a parameter
        goog.bind(function(){ this.delay_.start() }, this)
    );
};
goog.inherits(org.jboss.search.page.element.SearchFieldHandler, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.element.SearchFieldHandler.prototype.disposeInternal = function() {

    // Call the superclass's disposeInternal() method.
    org.jboss.search.page.element.SearchFieldHandler.superClass_.disposeInternal.call(this);

    // Dispose of all Disposable objects owned by this class.
    goog.dispose(this.delay_);
    goog.dispose(this.keyHandler_);
    goog.dispose(this.inputHandler_);

    // Remove listeners added by this class.
    goog.events.unlistenByKey(this.keyListenerId_);
    goog.events.unlistenByKey(this.blurListenerId_);
    goog.events.unlistenByKey(this.changeListenerId_);

    // Remove references to COM objects.

    // Remove references to DOM nodes, which are COM objects in IE.
    delete this.field_;
    delete this.callbackDelay_;
    delete this.callback_;
    delete this.blurHandler_;
    delete this.keyHandlers_;
};