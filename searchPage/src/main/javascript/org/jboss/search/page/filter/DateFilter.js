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

goog.require("goog.events.Event");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.events.KeyEvent");
goog.require("goog.ui.DatePicker.Events");
goog.require("goog.ui.DatePickerEvent");
goog.require('goog.array');
goog.require('goog.date.Date');
goog.require('goog.date.DateTime');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeParse');
goog.require('goog.object');
goog.require('goog.ui.InputDatePicker');
goog.require('goog.ui.LabelInput');
goog.require("org.jboss.search.page.filter.ProjectFilter");
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.search.context.RequestParams.Order');
goog.require('org.jboss.search.page.filter.DateOrderByChanged');
goog.require('org.jboss.search.page.filter.DateRangeChanged');
goog.require('org.jboss.core.visualization.Histogram');

/**
 * Create a new instance of Date Filter. Initialize histogram chart and date pickers.
 *
 * @param {!HTMLElement} element to host the date filter
 * @param {!HTMLElement} date_histogram_element to host the date histogram chart
 * @param {!HTMLInputElement} date_from_field
 * @param {!HTMLInputElement} date_to_field
 * @param {!HTMLSelectElement} order_by_select_element
 * @param {function(): boolean} opt_isCollapsed a function that is used to learn if filter is collapsed
 * @param {Function=} opt_expandFilter a function that is used to show/expand the filter DOM elements
 * @param {Function=} opt_collapseFilter a function that is used to hide/collapse the filter DOM elements
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.filter.DateFilter = function(element, date_histogram_element, date_from_field, date_to_field,
                                       order_by_select_element, opt_isCollapsed, opt_expandFilter, opt_collapseFilter) {
    goog.events.EventTarget.call(this);

    /**
     * @type {HTMLElement}
     * @private
     */
    this.element_ = element;

    /**
     * @type {HTMLElement}
     * @private
     */
    this.date_histogram_element_ = date_histogram_element;

    /**
     * @type {HTMLInputElement}
     * @private
     */
    this.date_from_field_ = date_from_field;

    /**
     * @type {HTMLInputElement}
     * @private
     */
    this.date_to_field_ = date_to_field;

    /**
     * @type {HTMLSelectElement}
     * @private
     */
    this.order_by_select_element_ = order_by_select_element;

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

	/**
	 * listen for key strokes
	 * @private
	 */
    this.keyListenerId_ = goog.events.listen(this.keyHandler_,
        goog.events.KeyHandler.EventType.KEY,
        goog.bind(function(e) {
            var keyEvent = /** @type {goog.events.KeyEvent} */ (e);
            if (!keyEvent.repeat) {
                if (keyEvent.keyCode == goog.events.KeyCodes.ESC) {
                    if (e.target.id == this.date_from_field_.id && this.fromDatePicker_.getPopupDatePicker().isVisible()) {
                        this.fromDatePicker_.hidePopup();
                    } else if (e.target.id == this.date_to_field_.id && this.toDatePicker_.getPopupDatePicker().isVisible()) {
                        this.toDatePicker_.hidePopup();
                    } else if (!this.isCollapsed_()) {
                        this.fromDatePicker_.hidePopup();
                        this.toDatePicker_.hidePopup();
                        this.collapseFilter();
                    }
                }
            }
        }, this)
    );

    /**
     * Create and init the chart.
     * @type {org.jboss.core.visualization.Histogram}
     * @private
     */
    this.histogram_chart_ = new org.jboss.core.visualization.Histogram(this.date_histogram_element_);
    this.histogram_chart_.initialize('histogram', 420, 200); // TODO add size to search app configuration

    /**
     * Create and init input date pickers
     */
    this.PATTERN_ = "MM'/'dd'/'yyyy"; // TODO get local?
    this.formatter_ = new goog.i18n.DateTimeFormat(this.PATTERN_);
    this.parser_ = new goog.i18n.DateTimeParse(this.PATTERN_);

    this.fromDatePicker_ = new goog.ui.InputDatePicker(this.formatter_, this.parser_);
    this.fromDatePicker_.setPopupParentElement(this.element_);
    this.fromDatePicker_.decorate(this.date_from_field_);

    this.toDatePicker_ = new goog.ui.InputDatePicker(this.formatter_, this.parser_);
    this.toDatePicker_.setPopupParentElement(this.element_);
    this.toDatePicker_.decorate(this.date_to_field_);

    // Listen for changes of FROM date
    this.fromDateChangedListenerId_ = goog.events.listen(
        this.fromDatePicker_.getPopupDatePicker(),
        goog.ui.DatePicker.Events.CHANGE,
        goog.bind(function(e) {
            var event = /** @type {goog.ui.DatePickerEvent} */ (e);
			/** @type {goog.date.DateTime|null} */ var nd = event.date ? new goog.date.DateTime(event.date) : null;
			var rp = org.jboss.core.service.Locator.getInstance().getLookup().getRequestParams();
			this.dispatchEvent(new org.jboss.search.page.filter.DateRangeChanged(nd, rp.getTo()));
        }, this)
    );

    // Listen for changes of TO date
    this.toDateChangedListenerId_ = goog.events.listen(
        this.toDatePicker_.getPopupDatePicker(),
        goog.ui.DatePicker.Events.CHANGE,
        goog.bind(function(e) {
            var event = /** @type {goog.ui.DatePickerEvent} */ (e);
            /** @type {goog.date.DateTime|null} */ var nd = event.date ? new goog.date.DateTime(event.date) : null;
			var rp = org.jboss.core.service.Locator.getInstance().getLookup().getRequestParams();
			this.dispatchEvent(new org.jboss.search.page.filter.DateRangeChanged(rp.getFrom(), nd));
        }, this)
    );

    // Listen for changes in search results order
    this.resultsOrderListenerId_ = goog.events.listen(
        this.order_by_select_element_,
        goog.events.EventType.CHANGE,
        goog.bind(function(e) {
            var event = /** @type {goog.events.Event} */ (e);
            var selected_order = event.target.value;
            this.dispatchEvent(new org.jboss.search.page.filter.DateOrderByChanged(selected_order));
        }, this)
    );
};
goog.inherits(org.jboss.search.page.filter.DateFilter, goog.events.EventTarget);

/** @inheritDoc */
org.jboss.search.page.filter.DateFilter.prototype.disposeInternal = function() {
    org.jboss.search.page.filter.ProjectFilter.superClass_.disposeInternal.call(this);

    goog.dispose(this.histogram_chart_);
    goog.dispose(this.keyHandler_);
    goog.dispose(this.fromDatePicker_);
    goog.dispose(this.toDatePicker_);

    goog.events.unlistenByKey(this.keyListenerId_);
    goog.events.unlistenByKey(this.fromDateChangedListenerId_);
    goog.events.unlistenByKey(this.toDateChangedListenerId_);
    goog.events.unlistenByKey(this.resultsOrderListenerId_);

    this.element_ = null;
    this.date_histogram_element_ = null;
    this.date_from_field_ = null;
    this.date_to_field_ = null;
    this.order_by_select_element_ = null;
    delete this.expandFilter_;
    delete this.collpaseFilter_;
    delete this.isCollapsed_;
};

/**
 * Refresh chart (meaning update to the latest search result histogram facet data). By default
 * this does nothing if the filter is collapsed.
 * @param {boolean=} opt_force refresh even if filter is collapsed. Defaults to false.
 */
org.jboss.search.page.filter.DateFilter.prototype.refreshChart = function(opt_force) {
    var force = !!(opt_force || false);
    if (!this.isCollapsed_() || force) {
        var data = org.jboss.core.service.Locator.getInstance().getLookup().getRecentQueryResultData();
        if (data && data.activity_dates_histogram_interval && data.facets &&
            data.facets.activity_dates_histogram && data.facets.activity_dates_histogram.entries) {

            /** @type {Array.<{time: number, count: number}>} */
            var entries_ = data.facets.activity_dates_histogram.entries;
            // TODO: move this check to response data normalization
            entries_ = goog.array.filter(entries_, function(entry){
                return entry.time == 0 ? false : true;
            });

            var requestParams = org.jboss.core.service.Locator.getInstance().getLookup().getRequestParams();
            var from_ = goog.isDateLike(requestParams.getFrom()) ? requestParams.getFrom().getTime() : null;
            var to_ = goog.isDateLike(requestParams.getTo()) ? requestParams.getTo().getTime() : null;
            if (!goog.isNull(from_) || !goog.isNull(to_)) {
                entries_ = goog.array.filter(entries_, function(entry){
                    if (!goog.isNull(to_) && entry.time > to_) { return false }
                    if (!goog.isNull(from_) && entry.time < from_) { return false }
                    return true;
                });
            }
            this.histogram_chart_.update(entries_, data.activity_dates_histogram_interval);
        } else {
            this.histogram_chart_.update([],"month");
        }
    }
};

/**
 * Calls opt_expandFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.DateFilter.prototype.expandFilter = function() {
	this.expandFilter_();
	this.refreshChart(false);
};

/**
 * Calls opt_collapseFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.DateFilter.prototype.collapseFilter = function() {
    this.collpaseFilter_();
};

/**
 * @return {org.jboss.core.visualization.Histogram}
 */
org.jboss.search.page.filter.DateFilter.prototype.getHistogramChart = function() {
    return this.histogram_chart_;
};

/**
 * Setup and display a new <code>from</code> date in the web form.
 * This will internally fire a date picker CHANGE event.
 * @param {goog.date.DateTime|undefined} from
 */
org.jboss.search.page.filter.DateFilter.prototype.setFromDate = function(from) {
	this.setTargetDate_(from, this.fromDatePicker_);
};

/**
 * Change value in the <code>from</code> field.
 * Does not really change the date value and does not fire CHANGE event.
 * @param {goog.date.DateTime} value
 */
org.jboss.search.page.filter.DateFilter.prototype.setFromValue = function(value) {
	this.setTargetValue_(value, this.fromDatePicker_);
};

/**
 * Setup and display a new <code>to</code> date in the web form.
 * This will internally fire a date picker CHANGE event.
 * @param {goog.date.DateTime|undefined} to
 */
org.jboss.search.page.filter.DateFilter.prototype.setToDate = function(to) {
	this.setTargetDate_(to, this.toDatePicker_);
};

/**
 * Change value in the <code>to</code> field.
 * Does not really change the date value and does not fire CHANGE event.
 * @param {goog.date.DateTime} value
 */
org.jboss.search.page.filter.DateFilter.prototype.setToValue = function(value) {
	this.setTargetValue_(value, this.toDatePicker_);
};

/**
 *
 * @param {goog.date.DateTime|undefined} date
 * @param {!goog.ui.InputDatePicker} datePicker
 * @private
 */
org.jboss.search.page.filter.DateFilter.prototype.setTargetDate_ = function(date, datePicker) {
	if (goog.isDateLike(date)) {
		datePicker.setDate(new goog.date.Date(date));
	} else {
		datePicker.setDate(null);
	}
};

/**
 *
 * @param {goog.date.DateTime} value
 * @param {!goog.ui.InputDatePicker} datePicker
 * @private
 */
org.jboss.search.page.filter.DateFilter.prototype.setTargetValue_ = function(value, datePicker) {
	var s = goog.isNull(value) ? "" : this.formatter_.format(value);
	datePicker.setInputValue(s);
};

/**
 * Set appropriate order type in the <code>select</code> element.
 * @param {org.jboss.search.context.RequestParams.Order|undefined} order
 * {@see org.jboss.search.context.RequestParams.Order}
 */
org.jboss.search.page.filter.DateFilter.prototype.setOrder = function(order) {
    if (!goog.isDef(order)) {
        // default
        goog.dom.forms.setValue(this.order_by_select_element_, org.jboss.search.context.RequestParams.Order.SCORE);
    } else {
        goog.dom.forms.setValue(this.order_by_select_element_, order);
    }
};