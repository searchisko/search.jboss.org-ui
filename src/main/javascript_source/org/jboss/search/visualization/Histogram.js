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
 * @fileoverview Histogram chart. Supports (animated) updates.
 *
 * There is a known issue with d3 transitions when the browser tab is in background.
 * See https://github.com/mbostock/d3/issues/885
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.visualization.Histogram');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.Disposable');

/**
 *
 * @param {!HTMLElement} element
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.visualization.Histogram = function(element) {
    goog.Disposable.call(this);

    /**
     * @type {HTMLElement}
     * @private
     */
    this.element_ = element;

    /** @private */ this.svg;
    /** @private */ this.x;
    /** @private */ this.y;
    /** @private */ this.width;
    /** @private */ this.height;

    /**
     * Has the chart been already initialized?
     * @type {boolean}
     * @private
     */
    this.init = false;
};
goog.inherits(org.jboss.search.visualization.Histogram, goog.Disposable);

/** @inheritDoc */
org.jboss.search.visualization.Histogram.prototype.disposeInternal = function() {
    org.jboss.search.visualization.Histogram.superClass_.disposeInternal.call(this);

    this.element_ = null;
    this.svg = null;
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
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

        this.init = true;
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
    this.title.text(function() { return "Matching content by " + (goog.string.endsWith(timeInterval, 's') ? timeInterval : timeInterval+'s') });

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
