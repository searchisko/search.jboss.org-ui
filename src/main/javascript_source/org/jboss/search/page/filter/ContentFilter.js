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
 * @fileoverview Content filter.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.filter.ContentFilter');

goog.require('goog.Disposable');

/**
 * Create a new content filter.
 * It requires an element as a parameter, it assumes there is one element with class='filter_items' found inside.
 * @param {!HTMLElement} element to host the content filter
 * @param {Function=} opt_expandFilter a function that is used to show/expand the filter DOM elements
 * @param {Function=} opt_collapseFilter a function that is used to hide/collapse the filter DOM elements
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.filter.ContentFilter = function(element, opt_expandFilter, opt_collapseFilter) {
	goog.Disposable.call(this);

	/**
	 * @type {!Function}
	 * @private
	 */
	this.expandFilter_ = /** @type {!Function} */ (goog.isFunction(opt_expandFilter) ? opt_expandFilter : goog.nullFunction());

	/**
	 * @type {!Function}
	 * @private
	 */
	this.collpaseFilter_ = /** @type {!Function} */ (goog.isFunction(opt_collapseFilter) ? opt_collapseFilter : goog.nullFunction());
};
goog.inherits(org.jboss.search.page.filter.ContentFilter, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.filter.ContentFilter.prototype.disposeInternal = function() {
	org.jboss.search.page.filter.ContentFilter.superClass_.disposeInternal.call(this);

	delete this.expandFilter_;
	delete this.collpaseFilter_;
};

/**
 * Calls opt_expandFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.ContentFilter.prototype.expandFilter = function() {
	this.expandFilter_();
};

/**
 * Calls opt_collapseFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.ContentFilter.prototype.collapseFilter = function() {
	this.collpaseFilter_();
};