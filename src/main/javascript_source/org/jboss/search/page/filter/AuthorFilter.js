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

goog.require('goog.Disposable');

/**
 * Create a new author filter.
 * It requires an element as a parameter, it assumes there is one element with class='filter_items' found inside.
 * @param {!HTMLElement} element to host the author filter
 * @param {!HTMLInputElement} query_field to host the project filter
 * @param {Function=} opt_expandFilter a function that is used to show/expand the filter DOM elements
 * @param {Function=} opt_collapseFilter a function that is used to hide/collapse the filter DOM elements
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.filter.AuthorFilter = function(element, query_field, opt_expandFilter, opt_collapseFilter) {
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
 * Calls opt_expandFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.AuthorFilter.prototype.expandFilter = function() {
    this.expandFilter_();
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

    // prepare keyHandlers for the main search field
    var keyHandlers = {};
    keyHandlers[goog.events.KeyCodes.ESC] = keyCodeEscHandler;

    return keyHandlers;
};