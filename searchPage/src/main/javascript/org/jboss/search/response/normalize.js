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
 * @fileoverview Static utilities to normalize raw response to
 * JSON that can be easily processed in Closure Template.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */
goog.provide('org.jboss.search.response');

goog.require('goog.array');
goog.require('goog.date');
goog.require('goog.date.DateTime');
goog.require('goog.format.EmailAddress');
goog.require('goog.object');
goog.require('goog.string');
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.util.dateTime');
goog.require('org.jboss.core.util.emailName');
goog.require('org.jboss.core.util.gravatar');
goog.require('org.jboss.search.Variables');
goog.require('org.jboss.search.util.paginationGenerator');


/**
 * It returns normalized and sanitized search response.
 * @param {!Object} response raw response from search API.
 * @param {!org.jboss.core.context.RequestParams} requestParams
 * @return {!Object}
 */
org.jboss.search.response.normalizeSearchResponse = function(response, requestParams) {

  // console.log("response",response);
  var output = {};

  // ==========================================
  // Took in ms
  // ==========================================
  var took = response.took || 'n/a ';
  output.took = took;

  // ==========================================
  // Actual page
  // ==========================================
  var actualPage = requestParams.getPage() || 1;
  if (actualPage < 1) {
    actualPage = 1;
  }
  output.actual_page = actualPage;

  // ==========================================
  // User query
  // ==========================================
  var query = requestParams.getQueryString() || '';
  query = goog.string.trim(query);
  output.user_query = query;

  // ==========================================
  // Time out
  // ==========================================
  if (goog.object.containsKey(response, 'timed_out')) {
    output.timed_out = response.timed_out;
  }

  // ==========================================
  // Response UUID
  // ==========================================
  if (goog.object.containsKey(response, 'uuid')) {
    output.uuid = response.uuid;
  }

  // ==========================================
  // activity_dates_histogram_interval
  // ==========================================
  if (goog.object.containsKey(response, 'activity_dates_histogram_interval')) {
    output.activity_dates_histogram_interval = response.activity_dates_histogram_interval;
  }

  // ==========================================
  // Hits
  // ==========================================
  if (goog.object.containsKey(response, 'hits')) {
    output.hits = response.hits;
  } else {
    output.hits = [];
  }

  // ==========================================
  // Facets
  // ==========================================
  if (goog.object.containsKey(response, 'facets')) {
    output.facets = response.facets;
  } else {
    output.facets = [];
  }

  // ==========================================
  // Pagination
  // ==========================================
  var total = /** @type {number} */ (goog.object.getValueByKeys(output, ['hits', 'total']));
  if (goog.isDefAndNotNull(total)) {
    output.pagination = org.jboss.search.util.paginationGenerator.generate(actualPage, total);
  }

  // ==========================================
  // Hits details
  // ==========================================
  var hits = /** @type {Array} */ (goog.object.getValueByKeys(output, ['hits', 'hits']));
  if (goog.isDefAndNotNull(hits)) {

    var projectMap = org.jboss.core.service.Locator.getInstance().getLookup().getProjectMap();

    goog.array.forEach(hits, function(hit, i) {

      // ==========================================
      // Position of hit within one search results page
      // <0, org.jboss.search.Variables.SEARCH_RESULTS_PER_PAGE - 1>
      // ==========================================
      hit.position_on_page = i;

      var fields = hit.fields || {};

      // ==========================================
      // Contributors
      // ==========================================
      if (goog.object.containsKey(fields, 'sys_contributors')) {
        var conts = fields.sys_contributors;
        if (goog.isDef(conts)) {
          var cont_;
          // we need to ensure that it is an array (because we test length and iterate it in soy template)
          if (goog.isArray(conts)) {
            cont_ = conts;
          } else {
            cont_ = [conts.valueOf()];
          }
          fields.sys_contributors_view = [];

          goog.array.forEach(cont_, function(c) {
            var name = org.jboss.core.util.emailName.extractNameFromMail(c).valueOf();
            var gravatarURL16 = org.jboss.core.util.gravatar.gravatarURI_Memo(c, 16).valueOf();
            var gravatarURL40 = org.jboss.core.util.gravatar.gravatarURI_Memo(c, 40).valueOf();
            fields.sys_contributors_view.push({'name': name, 'gURL16': gravatarURL16, 'gURL40': gravatarURL40});
          });
        }
      }

      // ==========================================
      // Tags
      // ==========================================
      if (goog.object.containsKey(fields, 'sys_tags')) {
        var tags = fields.sys_tags;
        if (goog.isDef(tags)) {
          var tags_;
          // we need to ensure that it is an array (because we test length and iterate it in soy template)
          if (goog.isArray(tags)) {
            tags_ = tags;
          } else {
            tags_ = [tags.valueOf()];
          }
          fields.sys_tags_view = tags_;
        }
      }

      // ==========================================
      // Try to translate project id -> project name
      // ==========================================
      if (goog.object.containsKey(fields, 'sys_project')) {
        var projectId = fields.sys_project;
        if (goog.object.containsKey(projectMap, projectId)) {
          fields.sys_project_full_name = projectMap[projectId];
        } else {
          // fallback to sys_project_name if available TODO: check it is not empty!
          if (goog.object.containsKey(fields, 'sys_project_name')) {
            fields.sys_project_full_name = fields.sys_project_name;
          }
        }
      }

      // ==========================================
      // Capitalize first letter of sys_type
      // ==========================================
      if (goog.object.containsKey(fields, 'sys_type')) {
        fields.sys_type = goog.string.toTitleCase(fields.sys_type);
      }

      // ==========================================
      // URL truncate
      // ==========================================
      if (goog.object.containsKey(fields, 'sys_url_view')) {
        var url = fields.sys_url_view;
        if (goog.isDef(url)) {
          var url_tr = goog.string.truncateMiddle(url, org.jboss.search.Variables.MAX_URL_LENGTH, true);
          fields.sys_url_view_tr = url_tr;
        }
      }

      // ==========================================
      // Description truncate
      // ==========================================
      if (goog.object.containsKey(fields, 'sys_description')) {
        var desc = org.jboss.search.response.normalizeAllSpaces_(fields.sys_description);
        if (goog.isDef(desc)) {
          var desc_tr = goog.string.truncate(desc, org.jboss.search.Variables.MAX_DESCRIPTION_LENGTH, true);
          fields.sys_description_tr = desc_tr;
        }
      }

      /** @type {goog.date.DateTime} */
      var date_created = goog.object.containsKey(fields, 'sys_created') ? goog.date.fromIsoString(fields.sys_created) : null;
      /** @type {goog.date.DateTime} */
      var date_last = goog.object.containsKey(fields, 'sys_last_activity_date') ? goog.date.fromIsoString(fields.sys_last_activity_date) : null;

      // ==========================================
      // Date parsing - sys_last_activity_date
      // ==========================================
      if (goog.isDefAndNotNull(date_last)) {
        try {
          fields.sys_last_activity_date_parsed = org.jboss.core.util.dateTime.formatShortDate(date_last);
        } catch (e) {
          // TODO: add logging!
          // date parsing probably failed
        }
      }

      // ==========================================
      // Date parsing - sys_created
      // ==========================================
      if (goog.isDefAndNotNull(date_created)) {
        try {
          if (goog.isDateLike(date_last)) {
            if (!date_created.equals(date_last)) {
              fields.sys_created_parsed = org.jboss.core.util.dateTime.formatShortDate(date_created);
            }
          }
        } catch (e) {
          // TODO: add logging!
          // date parsing probably failed
        }
      }

      var highlights = hit.highlight || {};

      // ==========================================
      // normalizeSpaces in highlighted content_plaintext
      // This sounds like a hack but the problem is that we display content using "noAutoescape" mode
      // thus we need to remove any spaces manually first.
      // ==========================================
      if (goog.object.containsKey(highlights, 'sys_content_plaintext')) {
        var content_plaintext = highlights.sys_content_plaintext;
        if (goog.isArray(content_plaintext) && content_plaintext.length > 0) {
          goog.array.forEach(content_plaintext, function(item, index, array) {
            array[index] = org.jboss.search.response.normalizeAllSpaces_(item);
          });
        }
      }

      // ==========================================
      // normalizeSpaces in highlighted comment_body
      // This sounds like a hack but the problem is that we display content using "noAutoescape" mode
      // thus we need to remove any spaces manually first.
      // ==========================================
      if (goog.object.containsKey(highlights, 'comment_body')) {
        var comment_body = highlights.comment_body;
        if (goog.isArray(comment_body) && comment_body.length > 0) {
          goog.array.forEach(comment_body, function(item, index, array) {
            array[index] = org.jboss.search.response.normalizeAllSpaces_(item);
          });
        }
      }

      // ==========================================
      // normalizeSpaces in highlighted message_attachments.content
      // This sounds like a hack but the problem is that we display content using "noAutoescape" mode
      // thus we need to remove any spaces manually first.
      // ==========================================
      if (goog.object.containsKey(highlights, 'message_attachments.content')) {
        var attachments_body = highlights['message_attachments.content'];
        if (goog.isArray(attachments_body) && attachments_body.length > 0) {
          goog.array.forEach(attachments_body, function(item, index, array) {
            array[index] = org.jboss.search.response.normalizeAllSpaces_(item);
          });
        }
      }
    });
  }

  // ==========================================
  // Top contributors facet details.
  // For each top_contributor facet item we add two new fields derived from
  // the 'term' field value (which should contain a normalized email string):
  // - a new field 'name' with a readable name
  // - a new field 'gURL16' with a small gravatar URL
  // ==========================================
  var contributors_facet = /** @type {Array} */ (goog.object.getValueByKeys(output, ['facets', 'top_contributors']));
  if (goog.isDefAndNotNull(contributors_facet)) {
    if (goog.isArray(contributors_facet.terms) && contributors_facet.terms.length > 0) {
      goog.array.forEach(contributors_facet.terms, function(item, index, array) {
        var name = org.jboss.core.util.emailName.extractNameFromMail(item.term).valueOf();
        var gravatarURL16 = org.jboss.core.util.gravatar.gravatarURI_Memo(item.term, 16).valueOf();
        item.name = name;
        item.gURL16 = gravatarURL16;
      });
    }
  }

  // ==========================================
  // Top projects facet details.
  // ==========================================
  var project_facet = /** @type {Array} */ (goog.object.getValueByKeys(output, ['facets', 'per_project_counts']));
  if (goog.isDefAndNotNull(project_facet)) {
    if (goog.isArray(project_facet.terms) && project_facet.terms.length > 0) {
      var projectMap = org.jboss.core.service.Locator.getInstance().getLookup().getProjectMap();
      goog.array.forEach(project_facet.terms, function(item, index, array) {
        var name = projectMap[item.term];
        item.name = goog.string.isEmptySafe(name) ? item.term : name;
        //var projectIcon =
        //item.icon =
      });
    }
  }

  return output;
};


/**
 * Does the same thing as goog.string.normalizeSpaces() except
 * it also translates both the &#160; and &nbsp; entities to vanilla space first.
 * @param {string} str
 * @return {string} str
 * @private
 */
org.jboss.search.response.normalizeAllSpaces_ = function(str) {
  return goog.isString(str) ? goog.string.normalizeSpaces(str.replace(/(&#160;|&nbsp;)/g, ' ')) : '';
};


/**
 * It returns normalized and sanitized project name suggestions response.
 * @param {{length: number}} ngrams raw response from search API.
 * @param {{length: number}} fuzzy raw response from search API.
 * @return {{ matching_items: !Array, did_you_mean_items: !Array }}
 */
org.jboss.search.response.normalizeProjectSuggestionsResponse = function(ngrams, fuzzy) {

  var items = [];
  goog.array.forEach(ngrams, function(item) {
    items.push({
      'name': item.highlight['sys_project_name.edgengram'] ? item.highlight['sys_project_name.edgengram'] : item.highlight['sys_project_name.ngram'],
      'code': item.fields['sys_project']
    });
  });

  var did_you_mean_items = [];
  goog.array.forEach(fuzzy, function(item) {
    if (
        goog.array.some(
        items,
        function(already_selected) {
          return already_selected['code'] == item.fields['sys_project'];
        })
    ) {
      // filter out item if it is already present in 'items'
    } else {
      did_you_mean_items.push({
        'name': item.fields['sys_project_name'],
        'code': item.fields['sys_project']
      });
    }
  });

  return { 'matching_items': items, 'did_you_mean_items': did_you_mean_items };
};
