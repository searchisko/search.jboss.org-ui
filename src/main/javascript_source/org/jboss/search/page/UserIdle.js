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
 * @fileoverview Some 'entertaining' action is fired when user does not
 * take any action after the search pages is loaded. Typically, it can
 * display some charts with data statistics and show teasers of documents
 * that were indexed most recently.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.UserIdle');

goog.require('org.jboss.search.LookUp');

goog.require('goog.dom');
goog.require('goog.Disposable');

/**
 *
 * @param {!HTMLDivElement} element
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.UserIdle = function(element) {
    goog.Disposable.call(this);
    /**
     * @private
     * @type {!goog.net.XhrManager} */
    this.xhrManager_ = org.jboss.search.LookUp.getInstance().getXhrManager();
    /**
     * @private
     * @type {!HTMLDivElement} */
    this.element_ = element;

    /**
     * @private
     */
    this.selection_;
};
goog.inherits(org.jboss.search.page.UserIdle, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.UserIdle.prototype.disposeInternal = function() {
    org.jboss.search.page.UserIdle.superClass_.disposeInternal.call(this);

    // delete transition delay and generated div elements
    // http://xaedes.de/dev/transitions/
    if (this.selection_ != null) {
        this.selection_.transition().duration(0).remove();
    }

    delete this.xhrManager_;
    delete this.selection_;
    delete this.element_;
};

org.jboss.search.page.UserIdle.prototype.start = function() {

    var postAction = function(d, i) {
        // 'this' refers to particular 'div' element
        if (i == 1) {
            var stats_div = d3.select(this).append('div').attr('id','entertain_chart');
            createDonutChart(stats_div);
        }
        if (i == 2) {
            var recent_data_div = d3.select(this).append('div').attr('id','entertain_recently_indexed');
            createRecentDataPreview();
        }
    };

    var createDonutChart = function(selection) {
        // example of donut chart see http://bl.ocks.org/1346410
        var width = 300,
            height = 200,
            radius = Math.min(width, height) / 2;
        var color = d3.scale.category20();
        var pie = d3.layout.pie().sort(null);
        var arc = d3.svg.arc()
            .innerRadius(radius - 60)
            .outerRadius(radius - 20);
        var svg = selection.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = svg.selectAll("path").data(pie([1,3,5]));

            path.enter().append("path")
                .attr("fill", function(d, i) { return color(i) })
                .attr("d", arc)
//                .attr("class", "arc")
            ;

            path.exit().remove();
    };

    var createRecentDataPreview = function() {
        var d = goog.dom.getElement('entertain_recently_indexed');
        goog.dom.setTextContent(d, '/Some details of recent documents.../');
    };

    // excellent read on D3 transitions see http://bost.ocks.org/mike/transition/
    this.selection_ = d3.select(this.element_).selectAll("div")
        .data([
            {'c': 'Go, search for something...'},
            {'c': 'There\'s a lot of content for you to explore.<br>Check some statistics...'},
            {'c': 'And still counting, check recently added documents:'},
            {'c': 'Still don\'t know what to do? Read <a href="#">help</a>.'} // TODO missing link to help!
        ]);

    this.selection_.enter().append("div").attr('class','entertain_say');

    this.selection_.transition().duration(500)
        .delay(function(d,i){return i < 3 ? (i+1) * 7000 : 40000;})
        .each('start',function(d,i) { d3.select(this).html(d['c']).style("color", "white"); })
        .each('end',postAction)
        .style("color","black");
};
