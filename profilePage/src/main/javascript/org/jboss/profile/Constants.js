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
 * @fileoverview Constants used all over the place.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
goog.provide('org.jboss.profile.Constants');

goog.require('org.jboss.profile.Variables');

org.jboss.profile.Constants = {

    /**
     * Used as an identifier to abort or/and send the query search request.
     * @type {string}
     * @const
     */
    SEARCH_QUERY_REQUEST_ID: "1",

    /**
     * Used in elements to declare that they can be used to watch for click stream analysis.
     * @type {string}
     * @const
     */
    CLICK_STREAM_CLASS: "cs_",

	/**
	 * Class of close buttons used in active search filters.
	 * @type {string}
	 * @const
	 */
	ACTIVE_SEARCH_FILTER_CLOSE: "active_filter_close",

	/**
	 * Element attribute name used to hold active search filter type.
	 * @type {string}
	 * @const
	 */
	ACTIVE_SEARCH_FILTER_TYPE: "asft_",

    /**
     * Used in elements to catch mouseover events.
     * @type {string}
     * @const
     */
    CONTRIBUTOR_CLASS: "ct_",

    /**
     * Element attribute used to hold position number of individual search hit on the page.
     * @type {string}
     * @const
     */
    HIT_NUMBER: "hn_",

    /**
     * Element attribute used to hold position number of contributor for single search hit.
     * @type {string}
     * @const
     */
    CONTRIBUTOR_NUMBER: "cn_",

    /**
     * Used in elements which represent individual pagination options on the result page.
     * @type {string}
     * @const
     */
    PAGINATION_CLASS: "pc_",

    /**
     * Element attribute used to hold pagination number.
     * @type {string}
     * @const
     */
    PAGINATION_NUMBER: "pn_",

    /**
     * Temporary: URL of Apiary Mock Server
     * @see http://docs.jbossorg.apiary.io/#searchapi
     * @type {string}
     * @const
     */
    API_URL_SUGGESTIONS_QUERY: "http://jbossorg.apiary.io/v1/rest/suggestions/query_string",

    /**
     * @see http://docs.jbossorg.apiary.io/#suggestionsapiproject
     * @type {string}
     * @const
     */
    API_URL_SUGGESTIONS_PROJECT: [org.jboss.search.Variables.API_URL_BASE_DCP,'/v1/rest','/suggestions/project'].join(''),

    /**
     * @see http://docs.jbossorg.apiary.io/#searchapi
     * @type {string}
     * @const
     */
    API_URL_SEARCH_QUERY: [org.jboss.search.Variables.API_URL_BASE_DCP,'/v1/rest','/search'].join(''),

    /**
     * Pull project_info from DCP @see http://docs.jbossorg.apiary.io/#searchapi
     * @type {string}
     * @const
     */
    API_URL_PROJECT_LIST_QUERY: [org.jboss.search.Variables.API_URL_BASE_DCP,'/v1/rest','/search?sys_type=project_info&size=300'].join(''),

    /**
     * Base URL for recording user click stream.
     * @see http://docs.jbossorg.apiary.io/#put-%2Fv1%2Frest%2Fsearch%2F%7Bsearch_result_uuid%7D%2F%7Bhit_id%7D%3F%7Bsession_id%7D
     * @type {string}
     * @const
     */
    API_URL_RECORD_USER_CLICK_STREAM: [org.jboss.search.Variables.API_URL_BASE_DCP,'/v1/rest','/search'].join('')

};
