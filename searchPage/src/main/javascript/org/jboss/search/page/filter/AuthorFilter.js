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
 * @fileoverview Author filter.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.filter.AuthorFilter');

goog.require("goog.async.Delay");
goog.require("goog.events.KeyCodes");
goog.require("goog.events.KeyEvent");
goog.require("goog.string");
goog.require('goog.Disposable');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.search.page.element.SearchFieldHandler');
goog.require('org.jboss.search.page.filter.templates');

/**
 * Create a new author filter.
 * It requires an element as the parameter, it assumes there is one element with class='filter_items' found inside.
 * @param {!HTMLElement} element to host the author filter
 * @param {!HTMLInputElement} query_field to host the project filter
 * @param {!HTMLDivElement} author_filter_items_div where authors are listed
 * @param {function(): boolean} opt_isCollapsed a function that is used to learn if filter is collapsed
 * @param {Function=} opt_expandFilter a function that is used to show/expand the filter DOM elements
 * @param {Function=} opt_collapseFilter a function that is used to hide/collapse the filter DOM elements
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.filter.AuthorFilter = function(element, query_field, author_filter_items_div, opt_isCollapsed, opt_expandFilter, opt_collapseFilter) {
    goog.Disposable.call(this);

    /**
     * @type {!Function}
     * @private
     */
    this.expandFilter_ = /** @type {!Function} */ (goog.isFunction(opt_expandFilter) ? opt_expandFilter : goog.nullFunction);

    /**
     * @type {!Function}
     * @private
     */
    this.collpaseFilter_ = /** @type {!Function} */ (goog.isFunction(opt_collapseFilter) ? opt_collapseFilter : goog.nullFunction);

	/**
	 * @type {function(): boolean}
	 * @private
	 */
	this.isCollapsed_ = /** @type {function(): boolean} */ (goog.isFunction(opt_isCollapsed) ? opt_isCollapsed : function(){ return true });

	/**
	 * @type {!HTMLDivElement}
	 * @private
	 */
	this.items_div_ = author_filter_items_div;

    /**
     * @type {!HTMLInputElement}
     * @private */
    this.query_field_ = query_field;

    this.search_field_handler_ = new org.jboss.search.page.element.SearchFieldHandler(
        this.query_field_,
        0,
        goog.bind(function(query) {
//            this.getSuggestions(query);
        },this),
        null,
        this.getPresetKeyHandlers_()
    );
};
goog.inherits(org.jboss.search.page.filter.AuthorFilter, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.filter.AuthorFilter.prototype.disposeInternal = function() {
    org.jboss.search.page.filter.AuthorFilter.superClass_.disposeInternal.call(this);

    goog.dispose(this.search_field_handler_);

    delete this.query_field_;
    delete this.expandFilter_;
    delete this.collpaseFilter_;
};

/**
 * Refresh filter items (meaning update to the latest search result data). By default
 * this does nothing if the filter is collapsed.
 * @param {boolean=} opt_force refresh even if filter is collapsed. Defaults to false.
 */
org.jboss.search.page.filter.AuthorFilter.prototype.refreshItems = function(opt_force) {
	var force = !!(opt_force || false);
	if (!this.isCollapsed_() || force) {
		var data = org.jboss.core.service.Locator.getInstance().getLookup().getRecentQueryResultData();
		if (data && data.facets && data.facets.top_contributors &&
			data.facets.top_contributors.terms && goog.isArray(data.facets.top_contributors.terms)) {
			this.updateItems_(data.facets.top_contributors.terms);
		} else {
			this.updateItems_([]);
		}
	}
};

/**
 * (Re)generate HTML of filter items
 * @param {Array} data
 * @private
 */
org.jboss.search.page.filter.AuthorFilter.prototype.updateItems_ = function(data) {
	// scroll to top when changing the content of the filter
	if (this.items_div_.scrollTop) { this.items_div_.scrollTop = 0 }
	var html = org.jboss.search.page.filter.templates.author_filter_items({ 'terms': data });
	this.items_div_.innerHTML = html;
};

/**
 * Calls opt_expandFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.AuthorFilter.prototype.expandFilter = function() {
    this.expandFilter_();
	this.refreshItems();
};

/**
 * Calls opt_collapseFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.AuthorFilter.prototype.collapseFilter = function() {
    this.collpaseFilter_();
};

/**
 * @return {!Object.<(goog.events.KeyCodes|number), function(goog.events.KeyEvent, goog.async.Delay)>}
 * @private
 */
org.jboss.search.page.filter.AuthorFilter.prototype.getPresetKeyHandlers_ = function() {

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeEscHandler = goog.bind(function(event, delay) {
        if (!event.repeat) {
            if (goog.string.isEmptySafe(this.query_field_.value)) {
                this.query_field_.value = '';
                this.collapseFilter();
            } else {
//                delay.stop();
                this.query_field_.value = '';
                // we can not call init() directly because we want to abort previous request (if there is any)
//                this.getSuggestions('');
            }
        }
    }, this);

	/**
	 * @param {goog.events.KeyEvent} event
	 * @param {goog.async.Delay} delay
	 */
	var keyCodeDownHandler = goog.bind(function(event, delay) {
		event.preventDefault();
	}, this);

	/**
	 * @param {goog.events.KeyEvent} event
	 * @param {goog.async.Delay} delay
	 */
	var keyCodeUpHandler = goog.bind(function(event, delay) {
		event.preventDefault();
	}, this);

	/**
	 * @param {goog.events.KeyEvent} event
	 * @param {goog.async.Delay} delay
	 */
	var keyCodeTabHandler = goog.bind(function(event, delay) {
		// do we need TAB handler?
		event.preventDefault();
	}, this);

	/**
	 * @param {goog.events.KeyEvent} event
	 * @param {goog.async.Delay} delay
	 */
	var keyCodeEnterHandler = goog.bind(function(event, delay) {

	}, this);

    // prepare keyHandlers for the main search field
    var keyHandlers = {};

    keyHandlers[goog.events.KeyCodes.ESC] = keyCodeEscHandler;
	keyHandlers[goog.events.KeyCodes.UP] = keyCodeUpHandler;
	keyHandlers[goog.events.KeyCodes.DOWN] = keyCodeDownHandler;
	keyHandlers[goog.events.KeyCodes.ENTER] = keyCodeEnterHandler;

	// TAB key does not seem to yield true in @see {goog.events.KeyCodes.isTextModifyingKeyEvent}
	// thus we have to handle it
	keyHandlers[goog.events.KeyCodes.TAB] = keyCodeTabHandler;

    return keyHandlers;
};