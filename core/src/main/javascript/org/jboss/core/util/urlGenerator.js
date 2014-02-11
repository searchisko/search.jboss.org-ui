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
 * @fileoverview Static utilities to construct URL string for requests.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
goog.provide('org.jboss.core.util.urlGenerator');
goog.provide('org.jboss.core.util.urlGenerator.QueryParams');
goog.provide('org.jboss.core.util.urlGenerator.QueryParams.SortBy');
goog.provide('org.jboss.core.util.urlGenerator.OptFields');
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.context.RequestParams.Order');
goog.require('org.jboss.core.context.RequestParamsFactory');

goog.require('goog.array');
goog.require('goog.date.DateTime');
goog.require('goog.object');
goog.require('goog.Uri');

/**
 * These are the names of URL params used for search service.
 * Match the search API {@see http://docs.jbossorg.apiary.io/#searchapi}
 * @enum {string}
 */
org.jboss.core.util.urlGenerator.QueryParams = {
    QUERY : 'query',
    FROM  : 'from',
    SIZE  : 'size',
    FACET : 'facet',
    FIELD : 'field',
    HIGHLIGHTS : 'query_highlight',
    ACTIVITY_DATE_FROM : 'activity_date_from',
    ACTIVITY_DATE_TO   : 'activity_date_to',
    ORDER_BY : 'sortBy',
	CONTRIBUTOR : 'contributor',
	CONTENT_TYPE : 'type',
	PROJECT : 'project',
	TAG : 'tag'
};

/**
 * Supported options of 'sortBy' URL parameter.
 * Match the search API {@see http://docs.jbossorg.apiary.io/#searchapi}
 * @enum {string}
 */
org.jboss.core.util.urlGenerator.QueryParams.SortBy = {
    NEW : 'new',
    OLD : 'old'
};

/**
 * @typedef {{
 *   fields: (Array.<string>|undefined),
 *   highlighting: (boolean|undefined),
 *   size: (number|undefined)
 * }}
 */
org.jboss.core.util.urlGenerator.OptFields;

/**
 * Generate URL that is used to request search results from Searchisko.
 * By default search results are tailored for the main search web page. This means returned document hits contain fields
 * that are required by the search results page. Several aspects of the results can be customized via opt_settings
 * parameter.
 * <p/>
 * Note it directly modifies provided `rootUri` so you may want use clone.
 *
 * @param {goog.Uri|string} rootUri
 * @param {org.jboss.core.context.RequestParams} requestParams
 * @param {number} search_results_per_page
 * @param {org.jboss.core.util.urlGenerator.OptFields=} opt_settings
 * @return {string|null}
 */
org.jboss.core.util.urlGenerator.searchUrl = function(rootUri, requestParams, search_results_per_page, opt_settings) {

    if (goog.isNull(rootUri)) { return null }

    if (goog.isString(rootUri)) {
        rootUri = new goog.Uri(rootUri)
    }

    // shortcut
    var params = org.jboss.core.util.urlGenerator.QueryParams;

    if (!goog.isDefAndNotNull(requestParams)) {
        requestParams = org.jboss.core.context.RequestParamsFactory.getInstance()
			.reset().setQueryString('').build();
    }
    var query = requestParams.getQueryString();
    if (!goog.isDefAndNotNull(requestParams.getQueryString())) { query = '' }
    rootUri.setParameterValue(params.QUERY, query);

    if (goog.isDef(opt_settings) && goog.isArray(opt_settings.fields)) {
        rootUri.setParameterValues(params.FIELD, opt_settings.fields)
    } else {
        rootUri.setParameterValues(params.FIELD,
			["sys_type","sys_id","sys_title","sys_contributors","sys_project","sys_project_name",
			"sys_description","sys_tags","sys_last_activity_date","sys_created","sys_url_view"]
		)
    }

    if (goog.isDef(opt_settings) && goog.isBoolean(opt_settings.highlighting) && goog.isBoolean(opt_settings.highlighting)) {
        rootUri.setParameterValue(params.HIGHLIGHTS, opt_settings.highlighting)
    } else {
        rootUri.setParameterValue(params.HIGHLIGHTS, "true")
    }

    rootUri.setParameterValues(params.FACET,
		["top_contributors","per_project_counts","per_sys_type_counts","activity_dates_histogram"]
	);

    // page
    var page = requestParams.getPage();
    if (goog.isDef(page) && goog.isNumber(page)) {
        if (page > 1) {
            rootUri.setParameterValue(params.FROM,( Math.round(page-1) * search_results_per_page ))
        }
    }

    // from date
    var from = requestParams.getFrom();
    if (goog.isDef(from)) {
        if (goog.isDateLike(from) && from instanceof goog.date.DateTime) {
            rootUri.setParameterValue(params.ACTIVITY_DATE_FROM, from.toXmlDateTime(true));
        }
    }

    // to date
    var to = requestParams.getTo();
    if (goog.isDef(to) && to instanceof goog.date.DateTime) {
        if (goog.isDateLike(to)) {
            rootUri.setParameterValue(params.ACTIVITY_DATE_TO, to.toXmlDateTime(true));
        }
    }

    var orderBy = requestParams.getOrder();
    if (goog.isDef(orderBy) && goog.isString(orderBy)) {
        if (goog.object.containsValue(org.jboss.core.context.RequestParams.Order, orderBy)) {
            // order by score is the default
            if (org.jboss.core.context.RequestParams.Order.SCORE != orderBy) {
                switch (orderBy) {
                    case org.jboss.core.context.RequestParams.Order.NEW_FIRST:
                        rootUri.setParameterValue(params.ORDER_BY, org.jboss.core.util.urlGenerator.QueryParams.SortBy.NEW);
                        break;
                    case org.jboss.core.context.RequestParams.Order.OLD_FIRST:
                        rootUri.setParameterValue(params.ORDER_BY, org.jboss.core.util.urlGenerator.QueryParams.SortBy.OLD);
                        break;
                }
            }
        }
    }

	// contributors
	var contributors = requestParams.getContributors();
	if (goog.isDef(contributors) && contributors.length > 0) {
		rootUri.setParameterValues(params.CONTRIBUTOR, contributors)
	}

	// projects
	var projects = requestParams.getProjects();
	if (goog.isDef(projects) && projects.length > 0) {
		rootUri.setParameterValues(params.PROJECT, projects)
	}

	// content types
	var contentTypes = requestParams.getContentTypes();
	if (goog.isDef(contentTypes) && contentTypes.length > 0) {
		rootUri.setParameterValues(params.CONTENT_TYPE, contentTypes)
	}

	if (goog.isDef(opt_settings) && goog.isNumber(opt_settings.size)) {
		if (opt_settings.size > 0) {
			// notice the hardcoded upper limit on the size
			rootUri.setParameterValue(params.SIZE, opt_settings.size > 100 ? "100" : opt_settings.size.toString(10));
		}
		if (opt_settings.size == 0) {
			rootUri.setParameterValue(params.SIZE, "0" );
		}
		// ignore negative values
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
org.jboss.core.util.urlGenerator.projectNameSuggestionsUrl = function(rootUri, opt_query, opt_size) {

    if (goog.isNull(rootUri)) { return null }

    if (goog.isString(rootUri)) {
        rootUri = new goog.Uri(rootUri)
    }

    // shortcut
    var params = org.jboss.core.util.urlGenerator.QueryParams;

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
org.jboss.core.util.urlGenerator.clickStreamUrl = function(rootUri, uuid, id, opt_session) {

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

