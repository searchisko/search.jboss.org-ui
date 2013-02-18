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
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.list.project.Project');

goog.require('goog.object');
goog.require('goog.array');
goog.require('goog.async.Deferred');

/**
 * Creates a new instance of Project list.
 * @param {!goog.async.Deferred} deferred source that will provide the actual data
 * @param {Function=} opt_canceller A function that will be called if the
 *     deferred is cancelled.
 * @param {Object=} opt_defaultScope The default scope to call callbacks with.
 * @constructor
 * @extends {goog.async.Deferred}
 */
org.jboss.search.list.project.Project = function(deferred, opt_canceller, opt_defaultScope) {

    goog.async.Deferred.call(this, opt_canceller, opt_defaultScope);

    /**
     * @type {!goog.async.Deferred}
     * @private
     */
    this.deferred_ = deferred;

    /**
     * @type {Object}
     * @private
     */
    this.map = {};

    // when deferred has the results, parse them, keep them in the map and let the callee know.
    this.deferred_.addCallback(function(data){
        this.map = this.parseProjectData(data);
        this.callback();
    }, this);
};
goog.inherits(org.jboss.search.list.project.Project, goog.async.Deferred);

/**
 * Knows how to parse response from http://docs.jbossorg.apiary.io/#managementapi%20-%20projects
 * into simple map representation.
 * @param {*} json
 * @return {Object}
 */
org.jboss.search.list.project.Project.prototype.parseProjectData = function(json) {
    var map_ = {};
    if (goog.isDefAndNotNull(json.hits) && goog.isArray(json.hits)) {

        goog.array.forEach(json.hits, function(item){
            // TODO add more checks (item.data undefined?)
            var id_ = item['data']['code'];
            var name_ = item['data']['name'];
            if (goog.isDefAndNotNull(id_) && goog.isDefAndNotNull(name_)) {
                map_[id_] = name_;
            }
        }, this);
    }
    return map_
};

/**
 * Return DCP Project Name for given Project DCP ID.
 * @param {!string} dcpId
 * @return {!string}
 */
org.jboss.search.list.project.Project.prototype.getDcpProjectName = function(dcpId) {
    return goog.object.get(this.map, dcpId, "Unknown").valueOf();
};

/**
 * Return projects as a map.
 * @return {*}
 */
org.jboss.search.list.project.Project.prototype.getMap = function() {
    return this.map;
};

/**
 * Return projects as an array.
 * Returned array is sorted ascending by the 'name' value.
 * @return {!Array.<{name: string, code: string}>}
 */
org.jboss.search.list.project.Project.prototype.getArray = function() {
    /** @type {!Array.<{name: string, code: string}>} */ var result = new Array();
    goog.object.forEach(this.map, function(value, key){
        result.push({'name':value, 'code':key, 'sortBy': value.toLowerCase()});
    });
    goog.array.sortObjectsByKey(result,'sortBy');
    return result;
};


