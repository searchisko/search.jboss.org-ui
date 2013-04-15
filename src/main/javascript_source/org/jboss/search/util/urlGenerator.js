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
 * @fileoverview Static utilities to normalize raw DCP response to
 * JSON that can be easily processed in Closure Template.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
goog.provide('org.jboss.search.util.urlGenerator');
goog.provide('org.jboss.search.util.urlGenerator.QueryParams');

goog.require('goog.Uri');
goog.require('org.jboss.search.Constants');

/**
 *
 * @enum {string}
 */
org.jboss.search.util.urlGenerator.QueryParams = {
    QUERY: 'query',
    FROM : 'from',
    SIZE : 'size',
    FACET: 'facet',
    HIGHLIGHTS: 'query_highlight',
    FIELD: 'field'
};

/**
 * Generate URL that is used to get search results.
 * Note it directly modifies provided `rootUri` so you may want use clone.
 *
 * @param {goog.Uri|string} rootUri
 * @param {string=} opt_query
 * @param {Array.<string>=} opt_fields
 * @param {boolean=} opt_highlighting
 * @param {number=} opt_page
 * @return {string|null}
 */
org.jboss.search.util.urlGenerator.searchUrl = function(rootUri, opt_query, opt_fields, opt_highlighting, opt_page) {

    if (goog.isNull(rootUri)) { return null }

    if (goog.isString(rootUri)) {
        rootUri = new goog.Uri(rootUri)
    }

    // shortcut
    var params = org.jboss.search.util.urlGenerator.QueryParams;

    if (goog.isNull(opt_query) || !goog.isDef(opt_query)) { opt_query = '' }
    rootUri.setParameterValue(params.QUERY, opt_query);

    if (goog.isDef(opt_fields) && goog.isArray(opt_fields)) {
        rootUri.setParameterValues(params.FIELD, opt_fields)
    } else {
        rootUri.setParameterValues(params.FIELD, ["dcp_type","dcp_id","dcp_title","dcp_contributors","dcp_project","dcp_project_name","dcp_description","dcp_tags","dcp_last_activity_date","dcp_url_view"])
    }

    if (goog.isBoolean(opt_highlighting)) {
        rootUri.setParameterValue(params.HIGHLIGHTS, opt_highlighting)
    } else {
        rootUri.setParameterValue(params.HIGHLIGHTS, "true")
    }
//    .setParameterValues("facet", ["top_contributors","activity_dates_histogram","per_project_counts","per_dcp_type_counts","tag_cloud"])
    rootUri.setParameterValues(params.FACET, ["per_project_counts","per_dcp_type_counts","activity_dates_histogram"]);

    if (goog.isDef(opt_page) && goog.isNumber(opt_page)) {
        if (opt_page > 1) {
            rootUri.setParameterValue(params.FROM,(Math.round(opt_page-1)*org.jboss.search.Constants.SEARCH_RESULTS_PER_PAGE))
        }
    }

    return rootUri.toString();
};

/**
 * Generate URL that is used to get project name suggestions.
 * Note it directly modifies provided `rootUri` so you may want use clone.
 *
 * @param {goog.Uri|string} rootUri
 * @param {string=} opt_query
 * @param {number=} opt_size
 * @return {string|null}
 */
org.jboss.search.util.urlGenerator.projectNameSuggestionsUrl = function(rootUri, opt_query, opt_size) {

    if (goog.isNull(rootUri)) { return null }

    if (goog.isString(rootUri)) {
        rootUri = new goog.Uri(rootUri)
    }

    // shortcut
    var params = org.jboss.search.util.urlGenerator.QueryParams;

    if (goog.isNull(opt_query) || !goog.isDef(opt_query)) { opt_query = '' }
    rootUri.setParameterValue(params.QUERY, opt_query);

    if (goog.isNumber(opt_size)) {
        rootUri.setParameterValue(params.SIZE, opt_size.toString(10));
    }

    return rootUri.toString();
};

/**
 * Generate URL that is used to post click stream statistics.
 * Note it directly modifies provided `rootUri` so you may want use clone.
 *
 * @param {goog.Uri|string} rootUri
 * @param {string} uuid
 * @param {string} id
 * @param {string=} opt_session
 * @return {string|null}
 */
org.jboss.search.util.urlGenerator.clickStreamUrl = function(rootUri, uuid, id, opt_session) {

    if (goog.isNull(rootUri)) { return null }

    if (goog.isString(rootUri)) {
        rootUri = new goog.Uri(rootUri)
    }

    rootUri.setPath([rootUri.getPath(),uuid].join('/'));
    rootUri.setPath([rootUri.getPath(),id].join('/'));

    if (goog.isString(opt_session)) {
        rootUri.setParameterValue(opt_session,'');
    }

    return rootUri.toString();
};

