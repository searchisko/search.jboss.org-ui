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
 * @fileoverview Status window is used to show activity status to the user.
 * Typically, it can show status while the application is being loaded from the server
 * or when some long activity is taking place behind the scene.
 *
 * This is just a trivial implementation. We might consider using 'goog.ui.ProgressBar' going forward.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.element.Status');

goog.require('org.jboss.search.Constants');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.Disposable');

/**
 * @param {!HTMLDivElement} div
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.element.Status = function(div) {
    goog.Disposable.call(this);

    /** @type {!HTMLDivElement} */ this.topDiv = div;
    /** @type {!Element} */ this.status = goog.dom.createDom('div');
    /** @type {!Element} */ this.progress = goog.dom.createDom('div');
    /** @type {number} */ this.progress_val = 0;

    goog.dom.setProperties(this.status,{ 'class': 'message'});
    goog.dom.setProperties(this.progress,{ 'class': 'progress_bar'});
    goog.dom.append(this.topDiv,[this.status, this.progress]);
};
goog.inherits(org.jboss.search.page.element.Status, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.element.Status.prototype.disposeInternal = function() {
    org.jboss.search.page.element.Status.superClass_.disposeInternal.call(this);
    this.progress_val = 0;
    delete this.progress;
    delete this.status;
    goog.dom.removeChildren(this.topDiv);
    delete this.topDiv;
};

/**
 * Show the status.
 * @param {string=} opt_status
 */
org.jboss.search.page.element.Status.prototype.show = function(opt_status) {
    this.setStatus(opt_status);
    goog.dom.classes.remove(this.topDiv, org.jboss.search.Constants.HIDDEN);
};

/**
 * Hide the status.
 */
org.jboss.search.page.element.Status.prototype.hide = function() {
    goog.dom.classes.add(this.topDiv, org.jboss.search.Constants.HIDDEN);
};

/**
 * Set status text.
 * @param {string=} opt_status
 */
org.jboss.search.page.element.Status.prototype.setStatus = function(opt_status) {
    goog.dom.setTextContent(this.status, opt_status || '');
};

/**
 * Get status text.
 * @return {!string}
 */
org.jboss.search.page.element.Status.prototype.getStatus = function() {
    return goog.dom.getTextContent(this.status);
};

/**
 * If progress bar is defined return it's value or return null.
 * @return {number}
 */
org.jboss.search.page.element.Status.prototype.getProgressValue = function() {
    return this.progress_val;
};

/**
 * Update the progress bar.
 * If progress bar has not been specified or val is out of range then do nothing.
 * @param {!number} val [0..1]
 */
org.jboss.search.page.element.Status.prototype.setProgressValue = function(val) {
    if (val >= 0 && val <= 1) {
        this.setProgressValueWithoutCheck_(val);
    } else if (val < 0) {
        this.setProgressValueWithoutCheck_(0);
    } else {
        this.setProgressValueWithoutCheck_(1);
    }
};

/**
 *
 * @param {!number} val in range [0..1]
 * @private
 */
org.jboss.search.page.element.Status.prototype.setProgressValueWithoutCheck_ = function(val) {
    this.progress_val = val;
    val = Math.round(val*100);
    goog.dom.setProperties(this.progress,{ 'style': ['width:',val,'%'].join('')});
};
