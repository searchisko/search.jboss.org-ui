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

goog.provide('org.jboss.core.util.fragmentGenerator');

goog.require('goog.array');
goog.require('goog.string');
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.context.RequestParams.Order');
goog.require('org.jboss.core.util.dateTime');
goog.require('org.jboss.core.util.fragmentParser');


/**
 * Construct URL fragment string based on provided requestParams.
 * If opt_requestParams is provided it is examined if log parameter was used, if yes, it is kept around.
 * (opt_requestParams refer to params of previous call, i.e. the one before requestParams)
 *
 * @param {!org.jboss.core.context.RequestParams} requestParams
 * @param {org.jboss.core.context.RequestParams=} opt_requestParams
 * @return {string} URL fragment
 */
org.jboss.core.util.fragmentGenerator.generate = function(requestParams, opt_requestParams) {

  var p_ = org.jboss.core.util.fragmentParser.UI_param_suffix;

  var token = [];

  // use query is available
  if (goog.isDefAndNotNull(requestParams.getQueryString())) {
    token.push([p_.QUERY, goog.string.urlEncode(requestParams.getQueryString())].join(''));
  }

  // use 'page' if provided and greater then 1
  if (goog.isDefAndNotNull(requestParams.getPage()) && requestParams.getPage() > 1) {
    token.push([p_.PAGE, goog.string.urlEncode(requestParams.getPage())].join(''));
  }

  // use 'from' if available
  if (goog.isDefAndNotNull(requestParams.getFrom()) && goog.isDateLike(requestParams.getFrom())) {
    var from_ = org.jboss.core.util.dateTime.formatShortDate(requestParams.getFrom());
    token.push([p_.FROM, goog.string.urlEncode(from_)].join(''));
  }

  // use 'to' if available
  if (goog.isDefAndNotNull(requestParams.getTo()) && goog.isDateLike(requestParams.getTo())) {
    var to_ = org.jboss.core.util.dateTime.formatShortDate(requestParams.getTo());
    token.push([p_.TO, goog.string.urlEncode(to_)].join(''));
  }

  // use 'order' if available and NOT equals to {@link org.jboss.core.context.RequestParams.Order.SCORE}
  if (goog.isDefAndNotNull(requestParams.getOrder())) {
    if (requestParams.getOrder() != org.jboss.core.context.RequestParams.Order.SCORE) {
      token.push([p_.ORDER_BY, goog.string.urlEncode(requestParams.getOrder())].join(''));
    }
  }

  var dedup;

  // use 'contributor'(s) if available
  if (goog.isDefAndNotNull(requestParams.getContributors()) && requestParams.getContributors().length > 0) {
    dedup = [];
    goog.array.removeDuplicates(requestParams.getContributors(), dedup);
    goog.array.forEach(
        dedup,
        function(contributor) {
          token.push([p_.CONTRIBUTOR, goog.string.urlEncode(contributor)].join(''));
        }
    );
  }

  if (goog.isDefAndNotNull(requestParams.getProjects()) && requestParams.getProjects().length > 0) {
    dedup = [];
    goog.array.removeDuplicates(requestParams.getProjects(), dedup);
    goog.array.forEach(
        dedup,
        function(project) {
          token.push([p_.PROJECT, goog.string.urlEncode(project)].join(''));
        }
    );
  }

  if (goog.isDefAndNotNull(requestParams.getContentTypes()) && requestParams.getContentTypes().length > 0) {
    dedup = [];
    goog.array.removeDuplicates(requestParams.getContentTypes(), dedup);
    goog.array.forEach(
        dedup,
        function(type) {
          token.push([p_.CONTENT_TYPE, goog.string.urlEncode(type)].join(''));
        }
    );
  }

  // if log was used in previous call, keep it
  /** @type {org.jboss.core.context.RequestParams} */
  if (goog.isDefAndNotNull(opt_requestParams)) {
    var log = opt_requestParams.getLog();
    if (goog.isDefAndNotNull(log) && !goog.string.isEmpty(log)) {
      token.push([p_.LOG, goog.string.urlEncode(log)].join(''));
    }
  }

  return token.join('&');
};
