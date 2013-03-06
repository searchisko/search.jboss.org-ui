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
goog.provide('org.jboss.search.Constants');

org.jboss.search.Constants = {

    /**
     * Number of search results per page (is also used for pagination navigation calculations).
     * @type {number}
     * @const
     */
    SEARCH_RESULTS_PER_PAGE: 10,

    /**
     * When pagination navigation is generated then it has up to 'PAGINATION_MAX_ITEMS_COUNT' items.
     * @type {number}
     * @const
     */
    PAGINATION_MAX_ITEMS_COUNT: 10,

    /**
     * HTTP GET request type.
     * @type {string}
     * @const
     */
    GET: "GET",

    /**
     * Used as an identified to abort or/and send the search suggestions request.
     * @type {string}
     * @const
     */
    SEARCH_SUGGESTIONS_REQUEST_ID: "1",

    /**
     * Used as an identified to abort or/and send the query search request.
     * @type {string}
     * @const
     */
    SEARCH_QUERY_REQUEST_ID: "2",

    /**
     * Used as an identified to abort or/and send the query search request.
     * @type {string}
     * @const
     */
    LOAD_PROJECT_LIST_REQUEST_ID: "3",

    /**
     * Priority of initialization.
     * @type {number}
     * @const
     */
    LOAD_LIST_PRIORITY: 5,

    /**
     * Priority of search suggestions requests. (It should be higher then query search requests.)
     * @type {number}
     * @const
     */
    SEARCH_SUGGESTIONS_REQUEST_PRIORITY: 10,

    /**
     * Priority of query search requests. (It should be lower then search suggestions requests.)
     * @type {number}
     * @const
     */
    SEARCH_QUERY_REQUEST_PRIORITY: 20,

    /**
     * Used in CSS.
     * @type {string}
     * @const
     */
    HIDDEN: "hidden",

    /**
     * Used in CSS.
     * @type {string}
     * @const
     */
    SELECTED: "selected",

    /**
     * Used in CSS and as an input element attribute.
     * @type {string}
     * @const
     */
    DISABLED: "disabled",

    /**
     * Temporary: URL of Apiary Mock Server
     * @see http://docs.jbossorg.apiary.io/#searchapi
     * @type {string}
     * @const
     */
    API_URL_SUGGESTIONS_QUERY: "http://private-5ebf-jbossorg.apiary.io/v1/rest/suggestions/query_string",

    /**
     * @see http://docs.jbossorg.apiary.io/#searchapi
     * @type {string}
     * @const
     */
    API_URL_SEARCH_QUERY: ['https://dcp-jbossorgdev.rhcloud.com/v1/rest','/search'].join(''),

    /**
     * Pull project_info from DCP @see http://docs.jbossorg.apiary.io/#searchapi
     * @type {string}
     * @const
     */
    API_URL_PROJECT_LIST_QUERY: ['https://dcp-jbossorgdev.rhcloud.com/v1/rest','/search?dcp_type=project_info&size=300'].join(''),

    /**
     * Interval in ms. When user has been idle for this time then we can fire some 'entertaining' action.
     * @type {number}
     * @const
     */
    USER_IDLE_INTERVAL: 4000

};