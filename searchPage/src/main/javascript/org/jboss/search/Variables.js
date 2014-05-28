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
 * @fileoverview Variables that can vary depending on target deployment.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */
goog.provide('org.jboss.search.Variables');


/**
 * Variables.
 */
org.jboss.search.Variables = {

  /**
   * Base URL of DCP API.
   * @type {string}
   * @const
   */
  // API_URL_BASE_DCP : 'http://192.168.2.2:8080',
  // API_URL_BASE_DCP : 'http://dcp-dev.jboss.org:8080',
  API_URL_BASE_DCP : 'http://dcp-jbossorgdev.rhcloud.com',
//  API_URL_BASE_DCP: 'http://dcpbeta-searchisko.rhcloud.com',
//  API_URL_BASE_DCP : 'http://dcp-stg.jboss.org',

  /**
   * Base URL of Profile app.
   * @type {string}
   * @const
   */
  PROFILE_APP_BASE_URL: '../../../../profilePage/src/main/webapp/index.html',

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
   * Max length of description text for individual search hit (if no highlights are used).
   * Ideal length of line 60, max 3 lines = 180.
   * @type {number}
   * @const
   */
  MAX_DESCRIPTION_LENGTH: 180,

  /**
   * Max length of URL link for individual search hit.
   * @type {number}
   * @const
   */
  MAX_URL_LENGTH: 60,

  /**
   * How many avatars are pre-loaded from contributor facet.
   * The idea is to pre-load only as many as can be visible when the filter
   * is expanded after its content update. When relevant HTML/CSS is changed
   * this variable should updated as well.
   * @type {number}
   * @const
   */
  CONTRIBUTOR_FACET_AVATAR_PRELOAD_CNT: 17,

  /**
   * Interval in ms. When user has been idle for this time then we can fire some 'entertaining' action.
   * @type {number}
   * @const
   */
  USER_IDLE_INTERVAL: 4000

};
