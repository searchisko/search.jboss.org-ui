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
 * Search hits.
 * @interface */
function SearchResults() {};
SearchResults.prototype.user_query; // added by normalize.js
SearchResults.prototype.time_out;
SearchResults.prototype.hits;

SearchResults.prototype.hits.total;
SearchResults.prototype.hits.max_score;
SearchResults.prototype.hits.pagination; // added by normalize.js
SearchResults.prototype.hits.hits;

/**
 * Individual search hit.
 * @interface */
function SearchHit() {};
SearchHit.prototype.fields;
SearchHit.prototype.fields.dcp_contributors;
SearchHit.prototype.fields.dcp_title;
SearchHit.prototype.fields.dcp_url_view;
SearchHit.prototype.fields.dcp_last_activity_date;
SearchHit.prototype.fields.dcp_project;
SearchHit.prototype.fields.dcp_type;
SearchHit.prototype.fields.dcp_description;
// added by normalize.js
SearchHit.prototype.fields.dcp_url_view_tr;
SearchHit.prototype.fields.dcp_contributors_view;
SearchHit.prototype.fields.dcp_contributors_view.name;
SearchHit.prototype.fields.dcp_contributors_view.gURL20;
SearchHit.prototype.fields.dcp_contributors_view.gURL40;
SearchHit.prototype.fields.dcp_description_tr;
SearchHit.prototype.fields.dcp_last_activity_date_parsed;

SearchHit.prototype.highlight;
SearchHit.prototype.highlight.comment_body;

/**
 * @interface */
function filterItem() {};
filterItem.items;
filterItem.items.name;
filterItem.items.code;