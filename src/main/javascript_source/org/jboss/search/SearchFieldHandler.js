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
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.SearchFieldHandler');

goog.require('goog.async.Delay');

goog.require("goog.Disposable");

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.InputHandler');

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
 * @param {!Function} callback what should happen after the delay
 * @param {?Function} blurHandler what should happen on BLUR event
 * @param {Object.<(goog.events.KeyCodes|number), function(goog.events.KeyEvent, goog.async.Delay)>=} keyHandlers user defined functions per keyCode
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.SearchFieldHandler = function(field, callbackDelay, callback, blurHandler, keyHandlers) {

    goog.Disposable.call(this);

    var log = goog.debug.Logger.getLogger('SearchFieldHandler [' + field.id + ']');

    /** @private */ this.field_ = field;
    /** @private */ this.callbackDelay_ = callbackDelay;
    /** @private */ this.callback_ = callback;
    /** @private */ this.blurHandler_ = blurHandler;
    /** @private */ this.keyHandlers_ = keyHandlers;

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

    /** @private */ this.delay_ =  new goog.async.Delay(
        function() { callback(field.value); },
        this.callbackDelay_
    );
    var delay = this.delay_;

    /** @private */
    this.keyHandler_ =  new goog.events.KeyHandler(this.field_);
    var keyHandler = this.keyHandler_;

    var userKeyHandlers = goog.isDef(this.keyHandlers_) ? this.keyHandlers_ : {};

    // listen for key strokes
    this.keyListenerId_ = goog.events.listen(keyHandler,
        goog.events.KeyHandler.EventType.KEY,
        function(e) {

            var keyEvent = /** @type {goog.events.KeyEvent} */ (e);
//            log.finest("keyEvent: " + goog.debug.expose(keyEvent));

            if (goog.object.get(userKeyHandlers, keyEvent.keyCode.toString(10))) {
                userKeyHandlers[keyEvent.keyCode](keyEvent, delay);
            }
            else if (goog.events.KeyCodes.isTextModifyingKeyEvent(/** @type {goog.events.BrowserEvent} */ (e))) {
                delay.start();
            } else {
                // ignore...
            }
        });

    if (goog.isFunction(this.blurHandler_)) {
        var blurHndl = this.blurHandler_;

        this.blurListenerId_ = goog.events.listen(this.field_,
            goog.events.EventType.BLUR,
            function(/** @type {goog.events.Event} */ e) {
                blurHndl();
            }
        );
    }

    /** @private */
    this.inputHandler_ = new goog.events.InputHandler(this.field_);
    var inputHandler = this.inputHandler_;

    // this listener can catch cut & paste in search field
    this.changeListenerId_ = goog.events.listen(inputHandler,
        goog.events.EventType.INPUT,
        function(/** @type {goog.events.Event} */ e) {
//            log.info("Field suddenly changed to: " + goog.debug.expose(e));
            delay.start();
        });
};
goog.inherits(org.jboss.search.SearchFieldHandler, goog.Disposable);

/** @inheritDoc */
org.jboss.search.SearchFieldHandler.prototype.disposeInternal = function() {

    // Call the superclass's disposeInternal() method.
    org.jboss.search.SearchFieldHandler.superClass_.disposeInternal.call(this);

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
    this.callbackDelay_ = null;
    delete this.callback_;
    if (goog.isDef(this.blurHandler_)) delete this.blurHandler_;
    this.keyHandlers_ = null;

};