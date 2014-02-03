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
 * @fileoverview Utility method to help generate search filter data.
 * This data is consumed by templates in order to generate HTML.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.util.searchFilterGenerator');

goog.require('org.jboss.search.context.RequestParams');
goog.require('org.jboss.core.util.dateTime');

/**
 *
 * @param {!org.jboss.search.context.RequestParams} requestParams
 * @return {Object}
 */
org.jboss.search.util.searchFilterGenerator.generateFilters = function(requestParams) {
	var filters = {};
	// date filter
	if (goog.isDef(requestParams.getFrom()) || goog.isDef(requestParams.getTo()) || goog.isDef(requestParams.getOrder())) {
		var filter = {};
		filter["type"] = org.jboss.search.util.searchFilterGenerator.activeFilterType.DATE;
		if (goog.isDef(requestParams.getFrom())) { filter["from"] = org.jboss.core.util.dateTime.formatShortDate(requestParams.getFrom()) }
		if (goog.isDef(requestParams.getTo())) { filter["to"] = org.jboss.core.util.dateTime.formatShortDate(requestParams.getTo()) }
		if (goog.isDef(requestParams.getOrder())) { filter["order"] = requestParams.getOrder() }
		filters['dateFilter'] = filter;
	}
	return filters;
};

/**
 * Supported active filter types.
 * Note: these values are propagated into HTML code (as a value of HTML Element attribute).
 * @enum {string}
 */
org.jboss.search.util.searchFilterGenerator.activeFilterType = {
	DATE : "d",
	PROJECT : "p",
	CONTRIBUTOR : "c",
	CONTENT_TYPE : "ct"
};