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
 * @fileoverview An event fired by Histogram when user selects new interval.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.visualization.IntervalSelected');

goog.require('org.jboss.search.visualization.HistogramEventType');
goog.require('goog.events.Event');

/**
 * Create a new instance. It requires three arguments. First two Dates represent interval range.
 * The last argument is a flag used to distinguish the last event fired when client finishes interval selection.
 * Because the interval selection is done interactively we can expect that the interval is changed several times
 * until the client considers the selection final.
 * Typical use case is that while the 'last' is 'false' we want to update some small bits in the UI, but once
 * user finishes selection, the 'last' is 'true' and we want to do something more expensive (e.g. start a new query).
 * <p/>
 * Granularity of both the from and to constructor parameters is kept up to days, anything below (hours, minutes,
 * seconds and millis) is dropped.
 *
 * @param {!goog.date.DateTime} from
 * @param {!goog.date.DateTime} to
 * @param {boolean} last
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.search.visualization.IntervalSelected = function(from, to, last) {
    goog.events.Event.call(this, org.jboss.search.visualization.HistogramEventType.INTERVAL_SELECTED);

    /**
     * @type {!goog.date.DateTime}
     * @private
     */
    this.from_ = from;

    /**
     * @type {!goog.date.DateTime}
     * @private
     */
    this.to_ = to;

    /**
     * @type {boolean}
     * @private
     */
    this.last_ = last || false;

	if (goog.isDefAndNotNull(this.from_)) {
		this.from_.setHours(0);
		this.from_.setMinutes(0);
		this.from_.setSeconds(0);
		this.from_.setMilliseconds(0);
	}

	if (goog.isDefAndNotNull(this.to_)) {
		this.to_.setHours(0);
		this.to_.setMinutes(0);
		this.to_.setSeconds(0);
		this.to_.setMilliseconds(0);
	}
};
goog.inherits(org.jboss.search.visualization.IntervalSelected, goog.events.Event);

/**
 * @return {!goog.date.DateTime}
 */
org.jboss.search.visualization.IntervalSelected.prototype.getFrom = function() {
    return this.from_;
};

/**
 * @return {!goog.date.DateTime}
 */
org.jboss.search.visualization.IntervalSelected.prototype.getTo = function() {
    return this.to_;
};

/**
 * @return {boolean}
 */
org.jboss.search.visualization.IntervalSelected.prototype.isLast = function() {
    return this.last_;
};