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
 * @fileoverview Project filter.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.filter.ProjectFilter');

goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.events.Key');
goog.require('org.jboss.core.Constants');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.util.urlGenerator');
goog.require('org.jboss.search.response');
goog.require('goog.Uri');
goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.object');
goog.require('goog.string');
goog.require('org.jboss.search.Constants');
goog.require('org.jboss.search.page.element.SearchFieldHandler');
goog.require('org.jboss.search.page.filter.templates');

/**
 * Create a new project filter.
 * It requires an element as a parameter, it assumes there is one element with class='filter_items' found inside.
 * @param {!HTMLElement} element to host the project filter
 * @param {!HTMLInputElement} query_field to host the project filter
 * @param {!HTMLDivElement} project_filter_items_div where projects are listed
 * @param {function(): boolean} opt_isCollapsed a function that is used to learn if filter is collapsed
 * @param {Function=} opt_expandFilter a function that is used to show/expand the filter DOM elements
 * @param {Function=} opt_collapseFilter a function that is used to hide/collapse the filter DOM elements
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.filter.ProjectFilter = function(element, query_field, project_filter_items_div, opt_isCollapsed, opt_expandFilter, opt_collapseFilter) {
	goog.events.EventTarget.call(this);

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
     * @type {!HTMLElement}
     * @private
	 */
    this.items_div_ = project_filter_items_div;

    /**
     * @type {!HTMLInputElement}
     * @private */
    this.query_field_ = query_field;

    this.search_field_handler_ = new org.jboss.search.page.element.SearchFieldHandler(
        this.query_field_,
        0,
        goog.bind(function(query) {
            this.getSuggestions(query);
        },this),
        null,
        this.getPresetKeyHandlers_()
    );

	/** @type {goog.events.Key} */
	this.projectClickListenerId_ = goog.events.listen(
		this.items_div_,
		goog.events.EventType.CLICK,
		function(e) {
			var event = /** @type {goog.events.Event} */ (e);
//			console.log(e.target);
//			this.dispatchEvent(event);
		},
		false, this
	);
};
goog.inherits(org.jboss.search.page.filter.ProjectFilter, goog.events.EventTarget);

/** @inheritDoc */
org.jboss.search.page.filter.ProjectFilter.prototype.disposeInternal = function() {
    org.jboss.search.page.filter.ProjectFilter.superClass_.disposeInternal.call(this);

	goog.events.unlistenByKey(this.projectClickListenerId_);

    goog.dispose(this.search_field_handler_);

    delete this.items_div_;
    delete this.query_field_;
    delete this.expandFilter_;
    delete this.collpaseFilter_;
};

/**
 * Refresh filter items (meaning update to the latest search result data). By default
 * this does nothing if the filter is collapsed.
 * @param {boolean=} opt_force refresh even if filter is collapsed. Defaults to false.
 */
org.jboss.search.page.filter.ProjectFilter.prototype.refreshItems = function(opt_force) {
	var force = !!(opt_force || false);
	if (!this.isCollapsed_() || force) {
		var data = org.jboss.core.service.Locator.getInstance().getLookup().getRecentQueryResultData();
		if (data && data.facets && data.facets.per_project_counts &&
			data.facets.per_project_counts.terms && goog.isArray(data.facets.per_project_counts.terms)) {
			this.updateItems_(data.facets.per_project_counts.terms);
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
org.jboss.search.page.filter.ProjectFilter.prototype.updateItems_ = function(data) {
	// scroll to top when changing the content of the filter
	if (this.items_div_.scrollTop) { this.items_div_.scrollTop = 0 }
	var html = org.jboss.search.page.filter.templates.project_filter_top_items({ 'terms': data });
	this.items_div_.innerHTML = html;
};

/**
 * Calls opt_expandFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.ProjectFilter.prototype.expandFilter = function() {
    this.expandFilter_();
	this.refreshItems();
};

/**
 * Calls opt_collapseFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.ProjectFilter.prototype.collapseFilter = function() {
    this.collpaseFilter_();
};

/**
 * Populate a new items into the filter. Drops all existing.
 * @param {Array.<{name: string, code: string}>} items
 */
org.jboss.search.page.filter.ProjectFilter.prototype.replaceItems = function(items) {
    if (goog.isDefAndNotNull(items)) {
        var html = org.jboss.search.page.filter.templates.project_filter_items({ 'items': items, 'did_you_mean_items': null });
        this.items_div_.innerHTML = html;
    }
};

/**
 * @private
 * @type {goog.Uri}
 * @const
 */
org.jboss.search.page.filter.ProjectFilter.prototype.PROJECT_SUGGESTIONS_URI = goog.Uri.parse(org.jboss.search.Constants.API_URL_SUGGESTIONS_PROJECT);

/**
 * Prototype URI
 * @return {goog.Uri} Project name suggestions service URI
 */
org.jboss.search.page.filter.ProjectFilter.prototype.getProjectSuggestionsUri = function() {
    return this.PROJECT_SUGGESTIONS_URI.clone();
};

/**
 *
 * @param {string} query
 */
org.jboss.search.page.filter.ProjectFilter.prototype.getSuggestions = function(query) {

    var lookup_ = org.jboss.core.service.Locator.getInstance().getLookup();

    var xhrManager = lookup_.getXhrManager();
    xhrManager.abort(org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_ID, true);

    if (goog.string.isEmptySafe(query)) {
        this.init();
        return;
    }

    var query_url_string = /** @type {string} */ (org.jboss.core.util.urlGenerator.projectNameSuggestionsUrl(this.getProjectSuggestionsUri(), query, 20));

    xhrManager.send(
        org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_ID,
        query_url_string,
        org.jboss.core.Constants.GET,
        "", // post_data
        {}, // headers_map
        org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_PRIORITY,
        // callback, The only param is the event object from the COMPLETE event.
        goog.bind(function(e) {
            var event = /** @type {goog.net.XhrManager.Event} */ (e);
            if (event.target.isSuccess()) {
                var response = /** @type {{responses: {length: number}}} */ (event.target.getResponseJson());
                var ngrams = /** @type {{length: number}} */ (goog.object.getValueByKeys(response['responses'][0],"hits","hits"));
                var fuzzy = /** @type {{length: number}} */ (goog.object.getValueByKeys(response['responses'][1],"hits","hits"));
//                console.log('ngrams',ngrams);
//                console.log('fuzzy',fuzzy);
                var output = org.jboss.search.response.normalizeProjectSuggestionsResponse(ngrams, fuzzy);
                var html = org.jboss.search.page.filter.templates.project_filter_items(output);
                this.items_div_.innerHTML = html;
            } else {
                // Project info failed to load.
                // TODO: fire event with details...
//                console.log('failed!');
            }
        }, this)
    );
};

/**
 * Initialization of project filter, it pulls project array from lookup.
 */
org.jboss.search.page.filter.ProjectFilter.prototype.init = function() {
    var lookup_ = org.jboss.core.service.Locator.getInstance().getLookup();
    this.replaceItems(lookup_.getProjectArray());
};

/**
 * @return {!Object.<(goog.events.KeyCodes|number), function(goog.events.KeyEvent, goog.async.Delay)>}
 * @private
 */
org.jboss.search.page.filter.ProjectFilter.prototype.getPresetKeyHandlers_ = function() {

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeEscHandler = goog.bind(function(event, delay) {
        if (!event.repeat) {
            if (this.query_field_.value != '') {
                delay.stop();
                this.query_field_.value = '';
                // we can not call init() directly because we want to abort previous request (if there is any)
                this.getSuggestions('');
            } else {
                this.collapseFilter();
            }
        }
    }, this);

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeDownHandler = goog.bind(function(event, delay) {
        event.preventDefault();
//        if (this.query_suggestions_view.isVisible()) {
//            this.query_suggestions_view.selectNext();
//        }
    }, this);

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeUpHandler = goog.bind(function(event, delay) {
        event.preventDefault();
//        if (this.query_suggestions_view.isVisible()) {
//            this.query_suggestions_view.selectPrevious();
//        }
    }, this);

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeTabHandler = goog.bind(function(event, delay) {
        // do we need TAB handler?
		event.preventDefault();
//        delay.stop();
//        this.hideAndCleanSuggestionsElementAndModel_();
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
