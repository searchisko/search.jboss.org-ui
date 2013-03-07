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

goog.provide('org.jboss.search.page.filter.ProjectFilter');

goog.require('org.jboss.search.page.filter.templates');
goog.require('org.jboss.search.Constants');
goog.require('goog.string');
goog.require('goog.events');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.dom');
goog.require('goog.Uri');
goog.require('goog.Disposable');

/**
 * Create a new project filter.
 * It requires an element as a parameter, it assumes there is one element with class='filter_items' found inside.
 * @param {!Element} element to host the project filter
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.filter.ProjectFilter = function(element) {
    goog.Disposable.call(this);
    /**
     * @type {!HTMLElement}
     * @private */
    this.items_div_ = /** @type {!HTMLElement} */ (goog.dom.getElementByClass('filter_items',element));

    /**
     * @type {!HTMLElement}
     * @private */
    this.query_field_ = /** @type {!HTMLElement} */ (goog.dom.getElement('project_filter_query_field'));

    /** @private */
    this.keyHandler_ =  new goog.events.KeyHandler(this.query_field_);

    /** @private */
    this.query_field_key_ = goog.events.listen(
        this.keyHandler_,
        goog.events.KeyHandler.EventType.KEY,
        function(e) {
            var keyEvent = /** @type {goog.events.KeyEvent} */ (e);
//            console.log('value', keyEvent.target.value);
            // TODO: handle keyup, keydown, escape, enter...
        }
    );

    /** @private */
    this.query_field_input_ = goog.events.listen(
        this.query_field_,
        goog.events.EventType.INPUT,
        goog.bind(function(e) {
            this.getSuggestions(e.target.value);
        },this)
    );
};
goog.inherits(org.jboss.search.page.filter.ProjectFilter, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.filter.ProjectFilter.prototype.disposeInternal = function() {
    org.jboss.search.page.filter.ProjectFilter.superClass_.disposeInternal.call(this);

    goog.dispose(this.query_field_key_);
    goog.dispose(this.query_field_input_);
    goog.dispose(this.keyHandler_);

    delete this.items_div_;
    delete this.query_field_;
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

    var lookup_ = org.jboss.search.LookUp.getInstance();

    var xhrManager = lookup_.getXhrManager();
    xhrManager.abort(org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_ID, true);

    if (goog.string.isEmptySafe(query)) {
        this.init();
        return;
    }

    var query_url_string = /** @type {string} */ (org.jboss.search.util.urlGenerator.projectNameSuggestionsUrl(this.getProjectSuggestionsUri(), query, 20));

    xhrManager.send(
        org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_ID,
        query_url_string,
        org.jboss.search.Constants.GET,
        "", // post_data
        {}, // headers_map
        org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_PRIORITY,
        // callback, The only param is the event object from the COMPLETE event.
        goog.bind(function(e) {
            var event = /** @type goog.net.XhrManager.Event */ (e);
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
    var lookup_ = org.jboss.search.LookUp.getInstance();
    this.replaceItems(lookup_.getProjectArray());
};
