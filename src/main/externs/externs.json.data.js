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
 * @author Lukas Vlcek (lvlcek@redhat.com)
 * @externs
 */

// The purpose of this externs file is to make sure the compiler does not rename JSON fields.
// see https://groups.google.com/forum/?fromgroups=#!topic/closure-templates-discuss/dRgUIbp84iw

/**
 * Metadata in {@link org.jboss.search.service.QueryServiceEvent}
 * @interface
 */
function QueryEventMetadata() {};
QueryEventMetadata.prototype.requestParams;
QueryEventMetadata.prototype.query_string;
QueryEventMetadata.prototype.url;
QueryEventMetadata.prototype.error;

/**
 * Search hits.
 * @interface
 */
function SearchResults() {};
SearchResults.prototype.actual_page;  // computed by normalize.js
SearchResults.prototype.user_query;   // computed by normalize.js
SearchResults.prototype.time_out;
SearchResults.prototype.uuid;
SearchResults.prototype.hits;

SearchResults.prototype.pagination;                 // computed by normalize.js
SearchResults.prototype.pagination.total_pages;     // computed by normalize.js
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
function SearchHit() {};
SearchHit.prototype._id;
SearchHit.prototype.position_on_page;  // computed or modified by normalize.js

SearchHit.prototype.fields;
SearchHit.prototype.fields.dcp_contributors;
SearchHit.prototype.fields.dcp_tags;
SearchHit.prototype.fields.dcp_title;
SearchHit.prototype.fields.dcp_url_view;
SearchHit.prototype.fields.dcp_last_activity_date;
SearchHit.prototype.fields.dcp_project;
SearchHit.prototype.fields.dcp_type;
SearchHit.prototype.fields.dcp_description;

SearchHit.prototype.fields.dcp_url_view_tr;                 // computed or modified by normalize.js
SearchHit.prototype.fields.dcp_contributors_view;           // computed or modified by normalize.js
SearchHit.prototype.fields.dcp_contributors_view.name;      // computed or modified by normalize.js
SearchHit.prototype.fields.dcp_contributors_view.gURL16;    // computed or modified by normalize.js
SearchHit.prototype.fields.dcp_contributors_view.gURL40;    // computed or modified by normalize.js
SearchHit.prototype.fields.dcp_project_full_name;           // computed or modified by normalize.js
SearchHit.prototype.fields.dcp_description_tr;              // computed or modified by normalize.js
SearchHit.prototype.fields.dcp_last_activity_date_parsed;   // computed or modified by normalize.js
SearchHit.prototype.fields.dcp_tags_view;                   // computed or modified by normalize.js

SearchHit.prototype.highlight;
SearchHit.prototype.highlight.dcp_content_plaintext;
SearchHit.prototype.highlight.comment_body;

SearchHit.prototype.facets;
SearchHit.prototype.facets.activity_dates_histogram;
SearchHit.prototype.facets.activity_dates_histogram.entries;

/**
 * Keys related to date histogram.
 * @interface
 */
function DateHistogram() {};
DateHistogram.prototype.activity_dates_histogram;
DateHistogram.prototype.activity_dates_histogram_interval;
DateHistogram.prototype.time;
DateHistogram.prototype.count;

/**
 * Project name suggestions
 * @interface
 */
function filterItem() {};
filterItem.items;
filterItem.did_you_mean_items;
filterItem.items.name;
filterItem.items.code;
filterItem.items.fields;
filterItem.items.highlight;