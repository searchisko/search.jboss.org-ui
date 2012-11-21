/*
    JBoss, Home of Professional Open Source
    Copyright 2012 Red Hat Inc. and/or its affiliates and other contributors
    as indicated by the @authors tag. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/**
 * @fileoverview Query suggestions model.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.suggestions.query.Model');
goog.provide('org.jboss.search.suggestions.query.Search');
goog.provide('org.jboss.search.suggestions.query.Suggestion');

goog.require('goog.object');

/**
 * Representation of search.
 * @param {!string} query_string
 * @constructor
 */
org.jboss.search.suggestions.query.Search = function(query_string) {

    this.query_string = query_string;
}

/**
 * Representation of suggestion.
 * @param {!string} query_string
 * @param {!string} value
 * @constructor
 */
org.jboss.search.suggestions.query.Suggestion = function(query_string, value) {

    this.query_string = query_string;
    this.value = value;
}

/**
 * Representation of whole query suggestions model.
 * @constructor
 */
org.jboss.search.suggestions.query.Model = function() {

    /**
     * @type {!org.jboss.search.suggestions.query.Search}
     * @private
     */
    this.search_ = new org.jboss.search.suggestions.query.Search("");

    /**
     * @type {!Array.<org.jboss.search.suggestions.query.Suggestion>}
     * @private
     */
    this.suggestions_ = [];
}

/**
 * @return {org.jboss.search.suggestions.query.Search}
 */
org.jboss.search.suggestions.query.Model.prototype.getSearch = function() {
    return this.search_;
}

/**
 * Update model.
 * @param {!Object} source
 */
org.jboss.search.suggestions.query.Model.prototype.update = function(source) {

    var search = /** @type {!Object} */ (goog.object.get(source, "search", {}));
    var query_string = "";

    if (goog.object.containsKey(search, "search")) {
        query_string = this.getQueryString(search, "");
    }

    this.search_.query_string = query_string;
}

/**
 * @private
 * @param {!Object} search
 * @param {string=} opt_default default value of query if not provided
 * @return {(string|undefined)}
 */
org.jboss.search.suggestions.query.Model.prototype.getQueryString = function(search, opt_default) {
    var value = /** @type {!string} */ goog.object.getValueByKeys(search, "search", "query");
    return value ? value : opt_default;
}



