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
 * @fileoverview Histogram chart. Supports (animated) updates and interval selection (via brush).
 *
 * There is a known issue with d3 transitions when the browser tab is in background.
 * See https://github.com/mbostock/d3/issues/885
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.visualization.Histogram');

goog.require('org.jboss.search.visualization.IntervalSelected');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.events.EventTarget');

/**
 * Create a new Histogram instance.
 * @param {!HTMLElement} element
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.visualization.Histogram = function(element) {
    goog.events.EventTarget.call(this);

    /**
     * @type {HTMLElement}
     * @private
     */
    this.element_ = element;

    /** @private */ this.svg;
    /** @private */ this.title;
    /** @private */ this.x;
    /** @private */ this.xAxis;
    /** @private */ this.xAxisElement;
    /** @private */ this.y;
    /** @private */ this.yAxis;
    /** @private */ this.yAxisElement;
    /** @private */ this.width;
    /** @private */ this.height;
    /** @private */ this.brush;

    /**
     * Has the chart been already initialized?
     * @type {boolean}
     * @private
     */
    this.init = false;
};
goog.inherits(org.jboss.search.visualization.Histogram, goog.events.EventTarget);

/** @inheritDoc */
org.jboss.search.visualization.Histogram.prototype.disposeInternal = function() {
    org.jboss.search.visualization.Histogram.superClass_.disposeInternal.call(this);

    // Possible TODO:
    // This dispose implementation is probably not complete as it does not clean the SVG elements
    // but we do not need to get it right for now.

    this.element_ = null;
    this.svg = null;
    this.title = null;
    this.x = null;
    this.xAxis = null;
    this.xAxisElement = null;
    this.y = null;
    this.yAxis = null;
    this.yAxisElement = null;
    this.width = null;
    this.height = null;
    this.brush = null;
};

/**
 * @param {string} css_class to give the inner svg element
 * @param {number} w outer width
 * @param {number} h outer height
 * @param {{ top: number, right: number, bottom: number, left: number}=} opt_m margin
 */
org.jboss.search.visualization.Histogram.prototype.initialize = function(css_class, w, h, opt_m) {

    if (!this.init) {
        var margin = {top: 20, right: 20, bottom: 30, left: 40};
        var titleSize = {height: 20, margin:10};
        if (goog.isDef(opt_m)) {
            goog.object.extend(margin, opt_m);
        }

        this.width = w - margin.left - margin.right;
        this.height = h - margin.top - margin.bottom;

        this.svg = d3.select(this.element_).append("svg")
            .attr("class", css_class)
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom + titleSize.height + titleSize.margin)
          .append("g")
//            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("transform", "translate(" + margin.left + "," + (margin.top + titleSize.height) + ")")
        ;

        this.title = this.svg
          .append("text")
            .attr("class", "chart_title")
            .attr("dx", this.width/2)
//            .attr("dy", ".35em")
//            .attr("y", 14)
            .attr("y", -12)
            .attr("text-anchor", "middle");

        this.title.text(function() {});

        this.svg
          .append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("class", "inner");

        this.x = d3.time.scale()
            .rangeRound([0, this.width])
//            .nice(d3.time.day)
        ;

        this.y = d3.scale.linear()
            .range([this.height, 0]);

        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient('bottom')
            .ticks(6)
//            .ticks(d3.time.days, 6)
//            .tickFormat(d3.time.format('%a %d %Y'))
            .tickSize(6, 3, 1)
            .tickPadding(8);

        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient('left')
            .tickSize(6, 3, 1)
            .tickPadding(8)
            .tickFormat(d3.format("s"));
        // More about tick ^^ formatting:
        // @see https://github.com/mbostock/d3/wiki/Formatting#wiki-d3_format
        // @see http://stackoverflow.com/questions/13828003/format-a-number-with-si-prefix-with-fixed-number-of-decimals

        this.xAxisElement = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

        this.yAxisElement = this.svg.append("g")
            .attr("class", "y axis")
//            .attr("transform","translate(" + this.width + ",0)")
            .call(this.yAxis);

        this.brush = d3.svg.brush()
            .x(this.x)
            .on("brush", goog.bind(this.brush_, this))
//            .on("brushstart", function(){ })
            .on("brushend", goog.bind(this.brushEnd_, this));


        this.brushElement = this.svg.append("g")
            .attr("class", "x brush")
            .call(this.brush);

        this.brushElement.selectAll("rect")
            .attr("y", 0)
            .attr("height", this.height);

        this.init = true;
    }
};

/**
 * @private
 */
org.jboss.search.visualization.Histogram.prototype.brushEnd_ = function() {
    var extent = this.brush.extent();
    if (goog.isDateLike(extent[0]) && goog.isDateLike(extent[1])) {
        this.dispatchEvent(new org.jboss.search.visualization.IntervalSelected(
            /** @type {!Date} */ (extent[0]), /** @type {!Date} */ (extent[1]), true));
    }
    // Clear the brush
    // @see https://groups.google.com/d/msg/d3-js/SN4-kJD6_2Q/SmQNwLm-5bwJ
    this.svg.select(".brush").call(this.brush.clear());
    // TODO: disable brush? ... because we are going to load a new data.
};

/**
 * @private
 */
org.jboss.search.visualization.Histogram.prototype.brush_ = function() {
    var extent = this.brush.extent();
    if (goog.isDateLike(extent[0]) && goog.isDateLike(extent[1])) {
        this.dispatchEvent(new org.jboss.search.visualization.IntervalSelected(
            /** @type {!Date} */ (extent[0]), /** @type {!Date} */ (extent[1]), false));
    }
};

/**
 * The second parameter can be any value supported by d3 Time-Intervals {@see https://github.com/mbostock/d3/wiki/Time-Intervals}.
 * As of writing it supports: "hour", "day", "week", "month" and "year" (plus other). If the interval is "quarter" then a "month"
 * is used instead.
 *
 * @param {Array.<{time: number, count: number}>} data
 * @param {string} interval
 */
org.jboss.search.visualization.Histogram.prototype.update = function(data, interval) {

    if (!this.init) {
        throw "Chart not initialized";
    }

    var timeInterval = interval || "month";

    if (timeInterval == "quarter") {
        timeInterval = "month";
    }

    // update chart title, use plural form of interval
    this.title.text(function() { return "Matching contribution updates by " + (goog.string.endsWith(timeInterval, 's') ? timeInterval : timeInterval+'s') });

    timeInterval = d3.time[timeInterval];

    var bandSize = 0;

    // only if we have data
    if (!goog.array.isEmpty(data)) {
        var domain_min = timeInterval.floor(new Date(data[0].time));
        var domain_max = timeInterval.ceil(new Date(data[data.length-1].time));

        this.x.domain([domain_min, domain_max]);
        this.y.domain([0, d3.max(data, function(d) { return d.count; })]);

        var bands = timeInterval.range(domain_min, domain_max).length;
        var bandRange = (domain_max - domain_min)/bands;
        bandSize = this.x(domain_min.getTime() + bandRange);

        if ((bandSize * bands) >= this.width && bandSize > 1) {
            bandSize--;
        }
    }

    // update both axis
    this.xAxisElement.transition().duration(750).call(this.xAxis);
    this.yAxisElement.transition().duration(750).call(this.yAxis);

    // now do data join (see http://bost.ocks.org/mike/join/)

    // get selection
    var bars = this.svg.selectAll(".bar")
        .data(data, function(d){ return d.time; });

    // enter
    bars.enter().append("rect")
        .attr("y", this.height)
        .attr("x", goog.bind(function(d) { return this.x(d.time); }, this))
    ;

    // update
    bars
      .transition()
        .duration(750)
        .attr("class","bar")
        .attr("x", goog.bind(function(d) { return this.x(d.time); }, this))
        .attr("width", bandSize)
        .attr("y", goog.bind(function(d) { return this.y(d.count); }, this))
        .attr("height", goog.bind(function(d) { return this.height - this.y(d.count); }, this));

    // exit
    bars.exit()
        .attr("class","bar on_exit")
      .transition()
        .duration(750)
        .attr("x", goog.bind(function(d) { return this.x(d.time); }, this))
        .style("fill-opacity", 1e-6)
        .remove();
};
