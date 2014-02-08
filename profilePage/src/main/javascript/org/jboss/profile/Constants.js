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
	 *
	 * @type {number}
	 * @const
	 */
	SEARCH_QUERY_REQUEST_PRIORITY: 2,

	/**
	 * @type {number}
	 * @const
	 */
	AVATAR_HEIGHT : 180,

    /**
     * @see http://docs.jbossorg.apiary.io/#searchapi
     * @type {string}
     * @const
     */
    API_URL_SEARCH_QUERY: [org.jboss.profile.Variables.API_URL_BASE_DCP,'/v1/rest','/search'].join('')

};
