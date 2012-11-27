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

goog.provide('org.jboss.search.suggestions.query.model.Model');
goog.provide('org.jboss.search.suggestions.query.model.Search');
goog.provide('org.jboss.search.suggestions.query.model.Suggestion');

goog.require('goog.object');

/**
 * Representation of search.
 * @param {!string} query_string
 * @constructor
 */
org.jboss.search.suggestions.query.model.Search = function(query_string) {
    this.query_string = query_string;
};

/**
 * Representation of suggestion.
 * @param {!string} value
 * @param {!string} query_string
 * @constructor
 */
org.jboss.search.suggestions.query.model.Suggestion = function(value, query_string) {
    this.value = value;
    this.query_string = query_string;
};

/**
 * Representation of whole query suggestions model.
 * @constructor
 */
org.jboss.search.suggestions.query.model.Model = function() {

    /**
     * @type {!org.jboss.search.suggestions.query.model.Search}
     * @private
     */
    this.search_ = new org.jboss.search.suggestions.query.model.Search("");

    /**
     * @type {!Array.<org.jboss.search.suggestions.query.model.Suggestion>}
     * @private
     */
    this.suggestions_ = [];
};

/**
 * Return {@link org.jboss.search.suggestions.query.model.Search}.
 * @see org.jboss.search.suggestions.query.model.Search
 *
 * @return {org.jboss.search.suggestions.query.model.Search}
 */
org.jboss.search.suggestions.query.model.Model.prototype.getSearch = function() {
    return this.search_;
};

/**
 * Return array of {@link org.jboss.search.suggestions.query.model.Suggestion}s.
 * @see org.jboss.search.suggestions.query.model.Suggestion
 *
 * @return {!Array.<org.jboss.search.suggestions.query.model.Suggestion>}
 */
org.jboss.search.suggestions.query.model.Model.prototype.getSuggestions = function() {
    return this.suggestions_;
};

/**
 * Update model.
 * @param {!Object} source
 */
org.jboss.search.suggestions.query.model.Model.prototype.parse = function(source) {

    var search = /** @type {!Object} */ (goog.object.get(source, "search", {}));

    var query_string = "";
    if (goog.object.containsKey(search, "search")) {
        query_string = this.getQueryString(search, "");
    }
    this.search_.query_string = query_string;

    var suggestions = /** @type {!Array} */ (goog.object.get(source, "suggestions", []));

    var query_suggestions = [];
    if (!goog.array.isEmpty(suggestions)) {
        query_suggestions = this.getQuerySuggestions(suggestions);
    }
    this.suggestions_=query_suggestions;

};

/**
 * @private
 * @param {!Object} search
 * @param {string=} opt_default default value of query if not provided
 * @return {(string|undefined)}
 */
org.jboss.search.suggestions.query.model.Model.prototype.getQueryString = function(search, opt_default) {
    var value = /** @type {!string} */ goog.object.getValueByKeys(search, "search", "query");
    return value ? value : opt_default;
};

/**
 * @private
 * @param {!Array.<!Object>} suggestions
 * @return {!Array.<!org.jboss.search.suggestions.query.model.Suggestion>}
 */
org.jboss.search.suggestions.query.model.Model.prototype.getQuerySuggestions = function(suggestions) {
    var result = [];
    goog.array.forEach(suggestions, function(item){
        var suggestion = new org.jboss.search.suggestions.query.model.Suggestion(
            /** @type {!string} */ (goog.object.getValueByKeys(item, "search", "query")),
            /** @type {!string} */ (goog.object.getValueByKeys(item, "suggestion", "value"))
        );
        result.push(suggestion);
    });
    return result;
};



