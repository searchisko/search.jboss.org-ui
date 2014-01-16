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
 * @fileoverview Logging for the search web UI application. It allows to start/stop capturing
 * logs into customized logging window based on URL fragment parameters.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.logging.Logging');
goog.provide('org.jboss.search.logging.Logging.Type');

goog.require('org.jboss.search.util.fragmentParser');
goog.require('org.jboss.search.util.fragmentParser.INTERNAL_param');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.history.EventType');
goog.require('goog.History');
goog.require('goog.Disposable');

goog.require('goog.debug');
goog.require('goog.debug.Console');
goog.require('goog.debug.FancyWindow');
goog.require('goog.debug.Logger');

/**
 * Create a new instance of Logging.
 * If "log parameter" is found in URL fragment then logging is enabled. Supported values are "console" and "fancyWindow".
 * <p>
 * It registers a lister on goog.History object as well as investigate window.location.hash value at time of creation.
 * If supported log parameter is found then it creates appropriate logging window and starts capturing on it.
 *
 * @param {!goog.History} history
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.logging.Logging = function(history) {
    goog.Disposable.call(this);
    this.navigationController_ = goog.bind(function (e) {
        var parsedFragment = org.jboss.search.util.fragmentParser.parse(e.token);
        var logType = parsedFragment.getLog();
		this.setLoggingType_(logType);
    }, this);
    this.historyListenerId_ = goog.events.listen(history, goog.history.EventType.NAVIGATE, this.navigationController_);

	var window = /** @type {!Window} */ (goog.dom.getWindow());
	if (goog.isDefAndNotNull(window) && window.location && window.location.hash) {
		var hash = window.location.hash;
		var parsedFragment = org.jboss.search.util.fragmentParser.parse(hash);
		var logType = parsedFragment.getLog();
		this.setLoggingType_(logType);
	}

    /**
     * @private
     */
    this.fancyWindow_;
};
goog.inherits(org.jboss.search.logging.Logging, goog.Disposable);

/** @inheritDoc */
org.jboss.search.logging.Logging.prototype.disposeInternal = function() {
    org.jboss.search.logging.Logging.superClass_.disposeInternal.call(this);
    this.stopLogging();
    goog.events.unlistenByKey(this.historyListenerId_);
    this.navigationController_ = null;
};

/**
 * Start capturing logs into specific logging window type.
 * Currently supported types:
 * <ul>
 *     <li> console - use built in console if browser supports it
 *     <li> fancyWindow - full features logging console in a new browser window
 * </ul>
 * @param {string} type
 * @see {org.jboss.search.logging.Logging.Type}
 */
org.jboss.search.logging.Logging.prototype.startLogging = function(type) {
    switch (type) {

        case org.jboss.search.logging.Logging.Type.CONSOLE :
            this.disableFancyWindow_();
            this.enableConsole_();
            break;
//        case 'divConsole' :
            // var log_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('log'));
//            break;
//        case 'debugWindow' :
//            break;
        case org.jboss.search.logging.Logging.Type.FANCY_WINDOW :
            this.disableConsole_();
            this.enableFancyWindow_();
            break;
        default :
            this.stopLogging();
    }
};

/**
 * Stops logging in any capturing logging window.
 */
org.jboss.search.logging.Logging.prototype.stopLogging = function() {
    this.disableConsole_();
    this.disableFancyWindow_();
};

/**
 * Disables capturing for console.
 * @private
 */
org.jboss.search.logging.Logging.prototype.disableConsole_ = function() {
    if (!goog.isDefAndNotNull(goog.debug.Console.instance)) {
        try { goog.debug.Console.instance.setCapturing(false); } catch (e) {}
    }
};

/**
 * Enables console and makes it capturing.
 * @private
 */
org.jboss.search.logging.Logging.prototype.enableConsole_ = function() {
    if (!goog.isDefAndNotNull(goog.debug.Console.instance)) {
        goog.debug.Console.autoInstall();
    }
    try { goog.debug.Console.instance.setCapturing(true); } catch (e) {}
};

/**
 * Disables capturing for fancyWindow and disables it.
 * @private
 */
org.jboss.search.logging.Logging.prototype.disableFancyWindow_ = function() {
    if (goog.isDefAndNotNull(this.fancyWindow_)) {
        this.fancyWindow_.setCapturing(false);
        this.fancyWindow_.setEnabled(false);
    }
};

/**
 * Makes fancyWindow capturing, enabled and opened.
 * @private
 */
org.jboss.search.logging.Logging.prototype.enableFancyWindow_ = function() {
    if (!goog.isDefAndNotNull(this.fancyWindow_)) {
        this.fancyWindow_ = new goog.debug.FancyWindow('');
    }
    if (!this.fancyWindow_.isCapturing()) {
        this.fancyWindow_.setCapturing(true);
    }
    this.fancyWindow_.setEnabled(true);
    this.fancyWindow_.init();
};

/**
 *
 * @param {string|undefined} logType
 * @private
 */
org.jboss.search.logging.Logging.prototype.setLoggingType_ = function(logType) {
	if (goog.isDef(logType)) {
		this.startLogging(logType);
	} else {
		this.stopLogging();
	}
};

/**
 * Supported logging windows types.
 * @enum {string}
 */
org.jboss.search.logging.Logging.Type = {
    CONSOLE      : 'console',
    FANCY_WINDOW : 'fancyWindow'
};
