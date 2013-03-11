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
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.logging.Logging');

goog.require('org.jboss.search.util.FragmentParser');
goog.require('org.jboss.search.LookUp');

goog.require('goog.events');
goog.require('goog.history.EventType');
goog.require('goog.Disposable');

goog.require('goog.debug');
goog.require('goog.debug.Console');
goog.require('goog.debug.FancyWindow');
goog.require('goog.debug.Logger');

/**
 *
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.logging.Logging = function() {
    goog.Disposable.call(this);
    this.fragmentParser_ = new org.jboss.search.util.FragmentParser();
    this.navigationController_ = goog.bind(function (e) {
        var parsedFragment = this.fragmentParser_.parse(e.token);
        var log = parsedFragment['log'];
        this.initLogging(log);
    }, this);
    var history = org.jboss.search.LookUp.getInstance().getHistory();
    this.historyListenerId_ = goog.events.listen(history, goog.history.EventType.NAVIGATE, this.navigationController_);
};
goog.inherits(org.jboss.search.logging.Logging, goog.Disposable);

/** @inheritDoc */
org.jboss.search.logging.Logging.prototype.disposeInternal = function() {
    goog.events.unlistenByKey(this.historyListenerId_);
    delete this.navigationController_;
    delete this.fragmentParser_;
};

/**
 *
 * @param {string} name
 */
org.jboss.search.logging.Logging.prototype.initLogging = function(name) {
    switch (name) {
        case 'console' :
            /* var consoleWindow = */ goog.debug.Console.autoInstall();
            if (goog.debug.Console.instance) {
                goog.debug.Console.instance.setCapturing(true);
            }
            break;
        case 'divConsole' :
            // var log_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('log'));
            break;
        case 'debugWindow' :
            break;
        case 'fancyWindow' :
            var debugWindow = new goog.debug.FancyWindow('');
            debugWindow.setEnabled(true);
            debugWindow.init();
            break;
        default :
            // close any existing Logging window
            if (goog.debug.Console.instance) {
                goog.debug.Console.instance.setCapturing(false);
//                goog.debug.Console.instance = null;
            }
    }
};
