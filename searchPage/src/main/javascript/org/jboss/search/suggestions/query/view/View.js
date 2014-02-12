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
 * @fileoverview Query suggestions view.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.suggestions.query.view.View');

goog.require('goog.Disposable');
goog.require('org.jboss.core.Constants');
goog.require('goog.array');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('goog.events.Key');
goog.require('goog.object');
goog.require('goog.string');
goog.require('org.jboss.search.suggestions.templates');

/**
 * Representation of query suggestions view.
 * @param {!HTMLDivElement} div
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.suggestions.query.view.View = function(div) {

    goog.Disposable.call(this);

    var log = goog.debug.Logger.getLogger('query.model.View [' + div.id + ']');

    /**
     * @type {!HTMLDivElement}
     * @private
     */
    this.div_ = div;
	// make sure it is hidden
	goog.dom.classes.add(this.div_, org.jboss.core.Constants.HIDDEN);

    /**
     * @type { {length: number} }
     * @private
     */
    this.selectable_elements_ = [];

    /**
     * first selected item has index 0!
     * -1 means no value is selected.
     * @type {number}
     * @private
     */
    this.selectedIndex = -1;

    /**
     * @type {Function}
     * @private
     */
    this.clickCallbackFunction_;

    /**
     * @type {goog.events.Key}
     * @private
     */
    this.clickListenerId_ = goog.events.listen(this.div_,
        goog.events.EventType.CLICK,
        function(e) {
			var event = /** @type {goog.events.BrowserEvent} */ (e);
            // There might be some listener that hides suggestions in the top level (for example at the document level)
            // thus we must stop propagation of clicks in order to prevent such collision.
            // If needed we could fire custom event.
            event.stopPropagation();
            // now call callback function if there is any defined for the click
            if (goog.isFunction(this.clickCallbackFunction_)) {
                this.clickCallbackFunction_(this.getSelectedIndex());
            }
        },
		false, this
	);

    /**
     * @type {goog.events.Key}
     * @private
     */
    this.mouseOverListenerId_ = goog.events.listen(
        this.div_,
        goog.events.EventType.MOUSEOVER,
        function(event) {
			var e = /** @type {goog.events.BrowserEvent} */ (event);
			if (goog.isDefAndNotNull(e.target)) {
                // Note:
                // I was not able to get JSDoc right on the following two lines!
                // Also I had to remove JSDoc annotation for getIndexValue @param.
                var t_ =  e.target;
                var index = getIndexValue_(t_);
                if (goog.isNumber(index)) {
                    if (index != this.getSelectedIndex()) {
                        this.select(index);
                    }
                }
            }
        },
		false, this
    );

    /**
     * Try to get 'index' attribute value from this element
     * or from its parent element.
     *
     * @return {number|null}
     * @private
     */
    var getIndexValue_ = function(element) {
        var index = element.getAttribute("index");
        if (goog.isDefAndNotNull(index)) {
            return goog.string.toNumber(index);
        } else {
            element = goog.dom.getParentElement(element);
            if (goog.isDefAndNotNull(element)) {
                index = element.getAttribute("index");
                if (goog.isDefAndNotNull(index)) {
                    return goog.string.toNumber(index);
                }
            }
        }
        return null;
    };

};
goog.inherits(org.jboss.search.suggestions.query.view.View, goog.Disposable);

/**
 * @return {boolean} if the div element is visible (whether the hidden class is set)
 */
org.jboss.search.suggestions.query.view.View.prototype.isVisible = function() {
    return !(goog.dom.classes.has(this.div_, org.jboss.core.Constants.HIDDEN));
};

/**
 * Show the div. Remove the class 'hidden'.
 */
org.jboss.search.suggestions.query.view.View.prototype.hide = function() {
    goog.dom.classes.add(this.div_, org.jboss.core.Constants.HIDDEN);
};

/**
 * Hide the div. Add the class 'hidden'.
 */
org.jboss.search.suggestions.query.view.View.prototype.show = function() {
    goog.dom.classes.remove(this.div_, org.jboss.core.Constants.HIDDEN);
};

/**
 * Update the view and makes the first option selected.
 *
 * @param {!Object} view
 */
org.jboss.search.suggestions.query.view.View.prototype.update = function(view) {

    var indexStart = 0;
    var html = "";

    goog.array.forEach(goog.object.getValues(view), function(view_section) {
        view_section.indexStart = indexStart;
        indexStart += view_section.options.length;
        html += org.jboss.search.suggestions.templates.suggestions_section(view_section);
    });

    this.div_.innerHTML = html;

    this.selectable_elements_ = goog.dom.getElementsByClass('selectable', this.div_);

    // deselect (just in case the there are no selectable options, thus the following select(0) does nothing)
    this.setSelectedIndex(-1);

    // select first if possible
    this.select(0);
};

/**
 * Make index-th option selected.
 * Option counting starts with 0.
 * Index can be in range <0, number of available options - 1> or nothing happens.
 *
 * @param {number} index
 */
org.jboss.search.suggestions.query.view.View.prototype.select = function(index) {

    if (index < 0 || index >= this.selectable_elements_.length) {

        return;

    } else {

        // deselect currently selected
        if (this.getSelectedIndex() > -1) {
            goog.dom.classes.remove(this.selectable_elements_[this.getSelectedIndex()], org.jboss.core.Constants.SELECTED);
            this.setSelectedIndex(-1);
        }

        // select a new one if possible
        if (this.selectable_elements_.length > 0 && this.selectable_elements_.length > index) {
            goog.dom.classes.add(this.selectable_elements_[index], org.jboss.core.Constants.SELECTED);
            this.setSelectedIndex(index);
        }
    }
};

/**
 * Select the next selectable option.
 * If the last one is already selected, nothing happens.
 */
org.jboss.search.suggestions.query.view.View.prototype.selectNext = function() {
    this.select( this.getSelectedIndex() + 1 );
};

/**
 * Select the previous selectable option.
 * If the first one is already selected, nothing happens.
 */
org.jboss.search.suggestions.query.view.View.prototype.selectPrevious = function() {
    this.select( this.getSelectedIndex() - 1);
};

/**
 * Get index of selected option (starting from 0).
 * @return {number}
 */
org.jboss.search.suggestions.query.view.View.prototype.getSelectedIndex = function() {
    return this.selectedIndex;
};

/**
 * @param {number} number
 * @private
 */
org.jboss.search.suggestions.query.view.View.prototype.setSelectedIndex = function(number) {
    this.selectedIndex = number;
};

/**
 * Set callback function that is called when option is clicked. The argument to the function
 * is an index of selected option.
 *
 * @param {function(number)|null} fn
 */
org.jboss.search.suggestions.query.view.View.prototype.setClickCallbackFunction = function(fn) {
    this.clickCallbackFunction_ = fn;
};

/**
 * Get callback function that is called when option is clicked.
 * @return {Function|undefined|null}
 */
org.jboss.search.suggestions.query.view.View.prototype.getClickCallbackFunction = function() {
    return this.clickCallbackFunction_;
};

/** @inheritDoc */
org.jboss.search.suggestions.query.view.View.prototype.disposeInternal = function() {

    // Call the superclass's disposeInternal() method.
    org.jboss.search.suggestions.query.view.View.superClass_.disposeInternal.call(this);

    // Dispose of all Disposable objects owned by this class.

    // Remove listeners added by this class.
    goog.events.unlistenByKey(this.clickListenerId_);
    goog.events.unlistenByKey(this.mouseOverListenerId_);

    // Remove references to COM objects.

    // Remove references to DOM nodes, which are COM objects in IE.
    delete this.div_;
    this.selectable_elements_ = [];
    this.clickCallbackFunction_ = null;

};
