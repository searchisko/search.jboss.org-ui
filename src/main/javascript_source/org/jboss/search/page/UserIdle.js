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
 * @fileoverview Some 'entertaining' action is fired when user does not
 * take any action after the search pages is loaded. Typically, it can
 * display some charts with data statistics and show teasers of documents
 * that were indexed most recently.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.UserIdle');

goog.require('goog.Disposable');

goog.require('goog.dom');
goog.require('goog.dom.classes');

goog.require('goog.net.XhrManager');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.net.XhrManager.Request');

/**
 *
 * @param {!goog.net.XhrManager} xhrManager
 * @param {!HTMLDivElement} element
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.UserIdle = function(xhrManager, element) {
    goog.Disposable.call(this);
    /**
     * @private
     * @type {!goog.net.XhrManager} */
    this.xhrManager_ = xhrManager;
    /**
     * @private
     * @type {!HTMLDivElement} */
    this.element_ = element;
};
goog.inherits(org.jboss.search.page.UserIdle, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.UserIdle.prototype.disposeInternal = function() {
    org.jboss.search.page.UserIdle.superClass_.disposeInternal.call(this);
};

org.jboss.search.page.UserIdle.prototype.start = function() {
    d3.select(this.element_).selectAll("div")
        .data(["Go, search for something...!"])
        .enter().append("div")
        .text(function(d) { return d; });
};
