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
 * @fileoverview Externs for json data structures that are input to Soy templates.
 * <p>
 * Note that there can be the same field names defined several times. In fact this does
 * not matter, it is better to have duplicities as long as it makes code not readable.
 * It does not add up to size of compiled code.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 * @externs
 */

// The purpose of this externs file is to make sure the compiler does not rename JSON fields.
// see https://groups.google.com/forum/?fromgroups=#!topic/closure-templates-discuss/dRgUIbp84iw



/**
 * Metadata in {@link org.jboss.core.service.query.QueryServiceEvent}
 * @interface
 */
function QueryEventMetadata() {}
QueryEventMetadata.prototype.requestParams;
QueryEventMetadata.prototype.query_string;
QueryEventMetadata.prototype.url;
QueryEventMetadata.prototype.error;

/**
 * Search hits.
 * @interface
 */
function SearchResults() {}
SearchResults.prototype.actual_page;  // computed by normalize.js
SearchResults.prototype.user_query;   // computed by normalize.js
SearchResults.prototype.took;
SearchResults.prototype.time_out;
SearchResults.prototype.uuid;
SearchResults.prototype.hits;

SearchResults.prototype.pagination;                 // computed by normalize.js
SearchResults.prototype.pagination.total_pages;     // computed by normalize.js
SearchResults.prototype.pagination.array;	        // computed by normalize.js
SearchResults.prototype.pagination.array.page;      // computed by normalize.js
SearchResults.prototype.pagination.array.symbol;    // computed by normalize.js
SearchResults.prototype.pagination.array.fragment;  // computed by normalize.js

SearchResults.prototype.hits.total;
SearchResults.prototype.hits.max_score;
SearchResults.prototype.hits.hits;

/**
 * Individual search hit.
 * @interface
 */
function SearchHit() {}
SearchHit.prototype._id;
SearchHit.prototype.position_on_page;  // computed or modified by normalize.js

SearchHit.prototype.fields;
SearchHit.prototype.fields.sys_contributors;
SearchHit.prototype.fields.sys_tags;
SearchHit.prototype.fields.sys_title;
SearchHit.prototype.fields.sys_url_view;
SearchHit.prototype.fields.sys_last_activity_date;
SearchHit.prototype.fields.sys_created;
SearchHit.prototype.fields.sys_project;
SearchHit.prototype.fields.sys_project_name;
SearchHit.prototype.fields.sys_type;
SearchHit.prototype.fields.sys_description;

SearchHit.prototype.fields.sys_url_view_tr;                 // computed or modified by normalize.js
SearchHit.prototype.fields.sys_contributors_view;           // computed or modified by normalize.js
SearchHit.prototype.fields.sys_contributors_view.name;      // computed or modified by normalize.js
SearchHit.prototype.fields.sys_contributors_view.gURL16;    // computed or modified by normalize.js
SearchHit.prototype.fields.sys_contributors_view.gURL40;    // computed or modified by normalize.js
SearchHit.prototype.fields.sys_project_full_name;           // computed or modified by normalize.js
SearchHit.prototype.fields.sys_description_tr;              // computed or modified by normalize.js
SearchHit.prototype.fields.sys_last_activity_date_parsed;   // computed or modified by normalize.js
SearchHit.prototype.fields.sys_created_parsed;              // computed or modified by normalize.js
SearchHit.prototype.fields.sys_tags_view;                   // computed or modified by normalize.js

SearchHit.prototype.highlight;
SearchHit.prototype.highlight.sys_content_plaintext;
SearchHit.prototype.highlight.comment_body;

// Date histogram facet
SearchHit.prototype.facets;
SearchHit.prototype.facets.activity_dates_histogram;
SearchHit.prototype.facets.activity_dates_histogram.entries;

// Top contributors facet
SearchHit.prototype.facets.top_contributors;
SearchHit.prototype.facets.top_contributors.other;
SearchHit.prototype.facets.top_contributors.missing;
SearchHit.prototype.facets.top_contributors.total;
SearchHit.prototype.facets.top_contributors.terms;

// Project counts facet
SearchHit.prototype.facets.per_project_counts;
SearchHit.prototype.facets.per_project_counts.other;
SearchHit.prototype.facets.per_project_counts.missing;
SearchHit.prototype.facets.per_project_counts.total;
SearchHit.prototype.facets.per_project_counts.terms;

// sys_type counts facet
SearchHit.prototype.facets.per_sys_type_counts;

/**
 * Keys related to date histogram.
 * @interface
 */
function DateHistogram() {}
DateHistogram.prototype.activity_dates_histogram;
DateHistogram.prototype.activity_dates_histogram_interval;
DateHistogram.prototype.time;
DateHistogram.prototype.count;

/**
 * Top contributor facet fields
 * @interface
 */
function TopContributorFacet() {}
TopContributorFacet.prototype.count;
TopContributorFacet.prototype.term;
TopContributorFacet.prototype.name;		// computed or modified by normalize.js
TopContributorFacet.prototype.gURL16;	// computed or modified by normalize.js

/**
 * Project name suggestions
 * @interface
 */
function filterItem() {}
filterItem.prototype.did_you_mean_items;
filterItem.prototype.matching_items;
filterItem.prototype.matching_items.name;
filterItem.prototype.matching_items.code;
filterItem.prototype.matching_items.fields;
filterItem.prototype.matching_items.highlight;

function activeSearchFilter() {}
activeSearchFilter.prototype.dateFilter;
activeSearchFilter.prototype.type;
activeSearchFilter.prototype.from;
activeSearchFilter.prototype.to;
activeSearchFilter.prototype.order;