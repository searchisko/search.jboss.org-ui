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
 * @fileoverview Utility to parse URL fragment.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.util.fragmentParser');
goog.provide('org.jboss.core.util.fragmentParser.INTERNAL_param');
goog.provide('org.jboss.core.util.fragmentParser.UI_param');
goog.provide('org.jboss.core.util.fragmentParser.UI_param_suffix');

goog.require('goog.array');
goog.require('goog.date');
goog.require('goog.date.DateTime');
goog.require('goog.object');
goog.require('goog.string');
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.context.RequestParams.Order');
goog.require('org.jboss.core.context.RequestParamsFactory');
goog.require('org.jboss.core.util.dateTime');


/**
 * Keys of the URL fragment parameters are translated to the following keys that are used internally
 * when generating Searchisko REST API call.
 * @enum {string}
 */
org.jboss.core.util.fragmentParser.INTERNAL_param = {
  QUERY: 'query',
  PAGE: 'page',
  FROM: 'from',
  TO: 'to',
  CONTRIBUTOR: 'contributor',
  PROJECT: 'project',
  CONTENT_TYPE: 'type',
  ORDER_BY: 'sortBy',
  LOG: 'log'
};


/**
 * URL fragment parameters used in the web UI.
 * @enum {string}
 */
org.jboss.core.util.fragmentParser.UI_param = {
  QUERY: 'q',
  PAGE: 'page',
  FROM: 'from',
  TO: 'to',
  CONTRIBUTOR: 'people',
  PROJECT: 'tech',
  CONTENT_TYPE: 'type',
  ORDER_BY: 'orderBy',
  LOG: 'log'
};


/**
 * URL fragment parameters used in the web UI with '=' suffix
 * @enum {string}
 */
org.jboss.core.util.fragmentParser.UI_param_suffix = {
  QUERY: org.jboss.core.util.fragmentParser.UI_param.QUERY + '=',
  PAGE: org.jboss.core.util.fragmentParser.UI_param.PAGE + '=',
  FROM: org.jboss.core.util.fragmentParser.UI_param.FROM + '=',
  TO: org.jboss.core.util.fragmentParser.UI_param.TO + '=',
  CONTRIBUTOR: org.jboss.core.util.fragmentParser.UI_param.CONTRIBUTOR + '=',
  PROJECT: org.jboss.core.util.fragmentParser.UI_param.PROJECT + '=',
  CONTENT_TYPE: org.jboss.core.util.fragmentParser.UI_param.CONTENT_TYPE + '=',
  ORDER_BY: org.jboss.core.util.fragmentParser.UI_param.ORDER_BY + '=',
  LOG: org.jboss.core.util.fragmentParser.UI_param.LOG + '='
};


/**
 * Extract named parameters from URL fragment and return them as an object.
 * @param {string=} opt_fragment
 * @return {!org.jboss.core.context.RequestParams}
 */
org.jboss.core.util.fragmentParser.parse = function(opt_fragment) {

  var intp_ = org.jboss.core.util.fragmentParser.INTERNAL_param;
  var parsed = {};

  // pre-initialize items that can have multiple values
  parsed[intp_.CONTRIBUTOR] = /** @type {Array.<string>} */ ([]);
  parsed[intp_.PROJECT] = /** @type {Array.<string>} */ ([]);
  parsed[intp_.CONTENT_TYPE] = /** @type {Array.<string>} */ ([]);

  if (goog.isDef(opt_fragment) && !goog.string.isEmptySafe(opt_fragment)) {
    var parts = goog.string.trim(/** @type {string} */ (opt_fragment)).split('&');
    var p_ = org.jboss.core.util.fragmentParser.UI_param_suffix;

    goog.array.forEach(parts, function(part) {

      // ------------------- QUERY --------------------
      if (goog.string.caseInsensitiveStartsWith(part, p_.QUERY)) {
        var q = goog.string.urlDecode(
            goog.string.removeAt(part, 0, p_.QUERY.length)
            );
        q = goog.string.endsWith(q, ' ') ?
            goog.string.collapseWhitespace(q) + ' ' :
            goog.string.collapseWhitespace(q);
        parsed[intp_.QUERY] = q;
      } else
      // ------------------- PAGE ---------------------
      if (goog.string.caseInsensitiveStartsWith(part, p_.PAGE)) {
        try {
          var n_ = parseInt(
              goog.string.trim(
                  goog.string.urlDecode(
                      goog.string.removeAt(part, 0, p_.PAGE.length)
                  )
              ), 10);
          if (goog.isNumber(n_) && !isNaN(n_)) {
            parsed[intp_.PAGE] = n_;
          }
        } catch (e) {
          // ignore invalid URL parameter
        }
      } else
      // ------------------- FROM ---------------------
      if (goog.string.caseInsensitiveStartsWith(part, p_.FROM)) {
        try {
          var fromDateTime_ = goog.string.trim(
              goog.string.urlDecode(
                  goog.string.removeAt(part, 0, p_.FROM.length)
              ));
          parsed[intp_.FROM] = org.jboss.core.util.dateTime.parseShortDate(fromDateTime_);
        } catch (error) {
          // TODO: log?
        }
      } else
      // ------------------- TO -----------------------
      if (goog.string.caseInsensitiveStartsWith(part, p_.TO)) {
        try {
          var toDateTime_ = goog.string.trim(
              goog.string.urlDecode(
                  goog.string.removeAt(part, 0, p_.TO.length)
              ));
          parsed[intp_.TO] = org.jboss.core.util.dateTime.parseShortDate(toDateTime_);
        } catch (error) {
          // TODO: log?
        }
      } else
      // ------------------- CONTRIBUTOR ----------------------
      if (goog.string.caseInsensitiveStartsWith(part, p_.CONTRIBUTOR)) {
        var contributor = goog.string.trim(
            goog.string.urlDecode(
                goog.string.removeAt(part, 0, p_.CONTRIBUTOR.length)
            ));
        if (!goog.string.isEmptySafe(contributor)) {
          parsed[intp_.CONTRIBUTOR].push(contributor);
        }
      } else
      // ------------------- PROJECT ----------------------
      if (goog.string.caseInsensitiveStartsWith(part, p_.PROJECT)) {
        var project = goog.string.trim(
            goog.string.urlDecode(
                goog.string.removeAt(part, 0, p_.PROJECT.length)
            ));
        if (!goog.string.isEmptySafe(project)) {
          parsed[intp_.PROJECT].push(project);
        }
      } else
      // ------------------- CONTENT_TYPE ----------------------
      if (goog.string.caseInsensitiveStartsWith(part, p_.CONTENT_TYPE)) {
        var ct = goog.string.trim(
            goog.string.urlDecode(
                goog.string.removeAt(part, 0, p_.CONTENT_TYPE.length)
            ));
        if (!goog.string.isEmptySafe(ct)) {
          parsed[intp_.CONTENT_TYPE].push(ct);
        }
      } else
      // ------------------- ORDER_BY ----------------------
      if (goog.string.caseInsensitiveStartsWith(part, p_.ORDER_BY)) {
        var orderBy_ = goog.string.trim(
            goog.string.urlDecode(
                goog.string.removeAt(part, 0, p_.ORDER_BY.length)
            )).toLowerCase();
        // orderBy should NOT equals to {@link org.jboss.core.context.RequestParams.Order.SCORE}
        if (goog.object.containsValue(org.jboss.core.context.RequestParams.Order, orderBy_) &&
            orderBy_ != org.jboss.core.context.RequestParams.Order.SCORE) {
          parsed[intp_.ORDER_BY] = orderBy_;
        }
      } else
      // ------------------- LOG ----------------------
      if (goog.string.caseInsensitiveStartsWith(part, p_.LOG)) {
        var l_ = goog.string.trim(
            goog.string.urlDecode(
                goog.string.removeAt(part, 0, p_.LOG.length)
            ));
        if (!goog.string.isEmptySafe(l_)) {
          parsed[intp_.LOG] = l_;
        }
      }
    });
  }

  // dedup items with multiple values
  goog.array.removeDuplicates(parsed[intp_.CONTRIBUTOR]);
  goog.array.removeDuplicates(parsed[intp_.PROJECT]);
  goog.array.removeDuplicates(parsed[intp_.CONTENT_TYPE]);

  return org.jboss.core.context.RequestParamsFactory.getInstance()
    .reset()
    .setQueryString(parsed[intp_.QUERY])
    .setPage(parsed[intp_.PAGE])
    .setFrom(parsed[intp_.FROM])
    .setTo(parsed[intp_.TO])
    .setContributors(parsed[intp_.CONTRIBUTOR])
    .setProjects(parsed[intp_.PROJECT])
    .setContentTypes(parsed[intp_.CONTENT_TYPE])
    .setOrder(parsed[intp_.ORDER_BY])
    .setLog(parsed[intp_.LOG])
    .build();
};
