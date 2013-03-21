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
 * @fileoverview Date filter.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.filter.DateFilter');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.Disposable');

/**
 *
 * @param {!HTMLElement} element to host the date filter
 * @param {function(): boolean} opt_isCollapsed a function that is used to learn of filter is collapsed
 * @param {Function=} opt_expandFilter a function that is used to show/expand the filter DOM elements
 * @param {Function=} opt_collapseFilter a function that is used to hide/collapse the filter DOM elements
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.filter.DateFilter = function(element, opt_isCollapsed, opt_expandFilter, opt_collapseFilter) {
    goog.Disposable.call(this);

    /**
     * @type {!HTMLElement}
     * @private
     */
    this.element_ = element;

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
     * @type {function(): boolean}
     * @private
     */
    this.isCollapsed_ = /** @type {function(): boolean} */ (goog.isFunction(opt_isCollapsed) ? opt_isCollapsed : function(){ return true });

    /** @private */
    this.keyHandler_ = new goog.events.KeyHandler(goog.dom.getDocument());
    // We can not use this.element_ but document - because <DIV> may not be focused.
    // this.keyHandler_ = new goog.events.KeyHandler(this.element_);

    // listen for key strokes
    this.keyListenerId_ = goog.events.listen(this.keyHandler_,
        goog.events.KeyHandler.EventType.KEY,
        goog.bind(function(e) {
            var keyEvent = /** @type {goog.events.KeyEvent} */ (e);
            if (!keyEvent.repeat) {
                if (!this.isCollapsed_()) {
                    if (keyEvent.keyCode == goog.events.KeyCodes.ESC) {
//                        keyEvent.preventDefault();
                        this.collapseFilter();
                    }
                }
            }
        }, this)
    );
};
goog.inherits(org.jboss.search.page.filter.DateFilter, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.filter.DateFilter.prototype.disposeInternal = function() {
    org.jboss.search.page.filter.ProjectFilter.superClass_.disposeInternal.call(this);

    goog.dispose(this.keyHandler_);

    goog.events.unlistenByKey(this.keyListenerId_);

    delete this.element_;
    delete this.expandFilter_;
    delete this.collpaseFilter_;
    delete this.isCollapsed_;
};

/**
 * Calls opt_expandFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.DateFilter.prototype.expandFilter = function() {
    this.expandFilter_();
};

/**
 * Calls opt_collapseFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.DateFilter.prototype.collapseFilter = function() {
    this.collpaseFilter_();
};