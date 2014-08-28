/*
 * JBoss, Home of Professional Open Source
 * Copyright 2014 Red Hat Inc. and/or its affiliates and other contributors
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
 * @fileoverview Type list is collection of type entities.
 * This collection is typically initiated at the application start and then used during application life cycle.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.list.Type');

goog.require('goog.array');
goog.require('goog.async.Deferred');
goog.require('goog.debug.Logger');
goog.require('goog.object');
goog.require('goog.string');



/**
 * Creates a new instance of Type list.
 * @param {!goog.async.Deferred} deferred source that will provide the actual data
 * @param {Function=} opt_canceller A function that will be called if the
 *     deferred is cancelled.
 * @param {Object=} opt_defaultScope The default scope to call callbacks with.
 * @constructor
 * @extends {goog.async.Deferred}
 */
org.jboss.search.list.Type = function(deferred, opt_canceller, opt_defaultScope) {
  goog.async.Deferred.call(this, opt_canceller, opt_defaultScope);

  /**
   * @type {!goog.debug.Logger}
   * @private
   */
  this.log_ = goog.debug.Logger.getLogger('org.jboss.search.list.Type');

  /**
   * @type {!goog.async.Deferred}
   * @private
   */
  this.deferred_ = deferred;

  /**
   * {
   *     'blogpost': 'Blog Post',
   *     'contributor_profile': 'Author Profile',
   *     ...
   * }
   *
   * @type {Object.<string, string>}
   * @private
   */
  this.map_ = {};

  // when deferred has the results, parse them, keep them in the map and let the callee know.
  this.deferred_.addCallback(function(data) {
    this.map_ = this.parseTypeData(data);
    this.callback();
  }, this);
};
goog.inherits(org.jboss.search.list.Type, goog.async.Deferred);


/**
 * Knows how to parse response from {@see Constants.API_URL_TYPE_LIST_QUERY}
 * into simple map representation.
 * @param {!Object} json
 * @return {!Object}
 */
org.jboss.search.list.Type.prototype.parseTypeData = function(json) {
  this.checkFailedResponse(json);
  var map_ = {};
  var terms = goog.object.getValueByKeys(json, 'facets', 'per_sys_type_counts', 'terms');
  if (goog.isDef(terms) && goog.isArray(terms)) {
    goog.array.forEach(terms, function(term) {
      var typeCode = goog.object.getValueByKeys(term, 'term');
      if (goog.isString(typeCode) && !goog.string.isEmptySafe(typeCode)) {
        var desc_ = org.jboss.search.list.Type.PredefinedList_[typeCode];
        if (!goog.string.isEmptySafe(desc_)) {
          map_[typeCode] = desc_;
        } else {
          // fallback (no description available for the code)
          map_[typeCode] = typeCode;
        }
      }
    }, this);
  }
  return map_;
};


/**
 * Check number of failed shards and log results. Even if there are failed shards
 * we only log this and let the program continue... but we might be more aggressive
 * in reporting such errors in the future.
 *
 * @param {!Object} json
 */
org.jboss.search.list.Type.prototype.checkFailedResponse = function(json) {
  var failed = goog.object.getValueByKeys(json, '_shards', 'failed');
  if (goog.isDefAndNotNull(failed)) {
    var parsedFailed = goog.string.parseInt(failed.toString());
    if (isNaN(parsedFailed)) {
      this.log_.warning('Could not parse number of failed shards');
    } else {
      if (parsedFailed === 0) {
        this.log_.info('OK: zero number of failed shards');
      } else {
        this.log_.severe('There are ' + parsedFailed + ' failed shards, data might be incomplete!');
      }
    }
  } else {
    this.log_.warning('Could not verify number of failed shards');
  }
};


/**
 * Return Type Name for given Type ID.
 * @param {!string} code
 * @return {!string}
 */
org.jboss.search.list.Type.prototype.getTypeDescription = function(code) {
  return goog.object.get(this.map_, code, 'Unknown').valueOf();
};


/**
 * Return projects as a map.
 * @return {Object.<string, string>}
 */
org.jboss.search.list.Type.prototype.getMap = function() {
  return this.map_;
};


/**
 * Return projects as an array.
 * Returned array is ordered ascending by the lower-cased 'name' value.
 * @return {!Array.<{name: string, code: string, orderBy: string}>}
 */
org.jboss.search.list.Type.prototype.getArray = function() {
  /** @type {!Array.<{name: string, code: string, orderBy: string}>} */ var result = new Array();
  goog.object.forEach(this.map_, function(value, key) {
    var name = (goog.string.isEmptySafe(value) ? key : value);
    result.push({'name': name, 'code': key, 'orderBy': name.toLowerCase()});
  });
  goog.array.sortObjectsByKey(result, 'orderBy');
  return result;
};


/**
 * Hardcoded translation from type code (sys_type) to human readable description.
 * As of now we do not have any REST API to get this from hence it is hardcoded in the code.
 *
 * @type {Object.<string, string>}
 * @const
 * @private
 */
org.jboss.search.list.Type.PredefinedList_ = {
  // Note: the keys should be probably in externs and then we can put them without quotes here.
  'article': 'Article',
  'demo': 'Demo',
  'blogpost': 'Blog Post',
  'contributor_profile': 'Author Profile',
  'forumthread': 'Forum',
  'issue': 'Issue',
  'solution': 'Solution',
  'video': 'Video',
  'webpage': 'Web Page',
  'jbossdeveloper_archetype': 'Archetype',
  'jbossdeveloper_bom': 'BOM',
  'jbossdeveloper_example': 'Example',
  'jbossdeveloper_quickstart': 'Quickstart'
};
