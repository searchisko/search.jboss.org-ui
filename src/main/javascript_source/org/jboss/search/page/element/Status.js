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

goog.require('goog.debug.Logger');

/**
 * Status "window" can display some text and report progress. When a new instance is created
 * it needs to be passed a number of portions. The number of portions refers to number of calls that
 * can increase the status by "one tick". This makes it possible for several "async" actions to
 * contribute to the progress. Typically , this can be used to report application initialization
 * which usually contains loading data from several resources in async manner.
 *
 * @param {!HTMLDivElement} div
 * @param {!number} portions must be greater than zero
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.element.Status = function(div, portions) {
    goog.Disposable.call(this);

	this.log_ = goog.debug.Logger.getLogger('org.jboss.search.page.element.Status');

	if (portions < 1) {
		throw new Error("portions must be greater than zero");
	}

    /**
	 * @type {!HTMLDivElement}
	 */
	this.topDiv_ = div;

	/**
	 * @type {!number}
	 */
	this.portions_ = portions;

	/**
	 * @type {!Element}
	 */
	this.status_ = goog.dom.createDom('div');

    /**
	 * @type {!Element}
	 */
	this.progress_ = goog.dom.createDom('div');

    /**
	 * @type {number}
	 * @private
	 */
	this.progress_val_ = 0;

    goog.dom.setProperties(this.status_,{ 'class': 'message'});
    goog.dom.setProperties(this.progress_,{ 'class': 'progress_bar'});
    goog.dom.append(this.topDiv_,[this.status_, this.progress_]);
};
goog.inherits(org.jboss.search.page.element.Status, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.element.Status.prototype.disposeInternal = function() {
    org.jboss.search.page.element.Status.superClass_.disposeInternal.call(this);
    this.progress_val_ = 0;
    delete this.progress_;
    delete this.status_;
    goog.dom.removeChildren(this.topDiv_);
    delete this.topDiv_;
	delete this.log_;
};

/**
 * Increase progress value by single portion or by positive number of portions.
 * @param {number=} opt_count
 */
org.jboss.search.page.element.Status.prototype.increaseProgress = function(opt_count) {
	var count_ = 1; // default value
	if (goog.isDefAndNotNull(opt_count) && goog.isNumber(opt_count)) {
		if (opt_count > 1) { count_ = opt_count }
		else { this.log_.warning("opt_cont was invalid, using the default value instead") }
	}
	if (this.progress_val_ < 1) {
		var tick = count_ / this.portions_;
		this.setProgressValue_(this.getProgressValue() + tick);
		this.log_.info("status progress increased to [" + this.getProgressValue() + "]");
	}
};

/**
 * Show the status.
 * @param {string=} opt_status Value to setup (override) the status to.
 */
org.jboss.search.page.element.Status.prototype.show = function(opt_status) {
	this.log_.info("show status, progress [" + this.getProgressValue() + "]");
    this.setStatus(opt_status);
    goog.dom.classes.remove(this.topDiv_, org.jboss.search.Constants.HIDDEN);
};

/**
 * Hide the status.
 */
org.jboss.search.page.element.Status.prototype.hide = function() {
	this.log_.info("hide status");
    goog.dom.classes.add(this.topDiv_, org.jboss.search.Constants.HIDDEN);
};

/**
 * Set status text.
 * @param {string=} opt_status
 */
org.jboss.search.page.element.Status.prototype.setStatus = function(opt_status) {
    goog.dom.setTextContent(this.status_, opt_status || '');
};

/**
 * Get status text.
 * @return {!string}
 */
org.jboss.search.page.element.Status.prototype.getStatus = function() {
    return goog.dom.getTextContent(this.status_);
};

/**
 * If progress bar is defined return it's value or return null.
 * @return {number}
 */
org.jboss.search.page.element.Status.prototype.getProgressValue = function() {
    return this.progress_val_;
};

/**
 * Update the progress bar.
 * If progress bar has not been specified or val is out of range then do nothing.
 * @param {!number} val [0..1]
 * @private
 */
org.jboss.search.page.element.Status.prototype.setProgressValue_ = function(val) {
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
    this.progress_val_ = val;
    val = Math.round(val*100);
    goog.dom.setProperties(this.progress_,{ 'style': ['width:',val,'%'].join('')});
};
