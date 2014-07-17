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
 * @fileoverview Cache whose records expire after predefined time span. The cache has
 * internal timer which wakes up a clean process that iterates through all records in
 * the cache and removes those that are expired.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.service.query.SimpleTimeCache');

goog.require('goog.Disposable');
goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.object');



/**
 * Cache constructor accepts two parameters: expiration and (optional) validation values.
 *
 * Each record put into the cache is considered up-to-date for the time span determined by the
 * time it has been put into the cache plus the expiration value. For example it the expiration
 * value is set to 5 then every record put into the cache will expire in 5 seconds.
 *
 * Once the record is expired it will be removed from the cache during the nearest clean process
 * which gets executed in intervals determined by the validation value. The default value of the
 * validation is equal to the expiration value.
 *
 * This cache does deep clone of input object on both the 'put' and 'get' operations.
 * This means you are not able to change the object after it has been stored or retrieved from the cache.
 *
 * @param {number} expiration period (TTL) after which records are removed from cache (in seconds)
 * @param {number=} opt_validation (in seconds)
 * @constructor
 * @template T
 * @extends {goog.Disposable}
 */
org.jboss.core.service.query.SimpleTimeCache = function(expiration, opt_validation) {
  goog.Disposable.call(this);

  /**
   * The cache is keyed by the query (represented as a string hash)
   * and the value is an object having two keys: created and data.
   * The created value represents the time the data was put into the cache.
   *
   * TODO: rename the 'created' to 'put'
   * @type {!Object.<string, {created: number, data: !{T}}>}
   * @private
   */
  this.cache_ = {};

  /**
   * How long the object is considered valid.
   * @type {number}
   * @private
   */
  this.expiration_ = expiration;

  /**
   * How often the cache is checked for expired objects.
   * @type {number}
   * @private
   */
  this.validation_ = (goog.isDefAndNotNull(opt_validation) ? opt_validation : expiration) * 1000; // convert to millis

  /**
   * @type {goog.Timer}
   * @private
   */
  this.timer_ = new goog.Timer(this.validation_);

  this.timerKey_ = goog.events.listen(
      this.timer_,
      goog.Timer.TICK,
      goog.bind(this.removeExpiredFromCache_, this));

  this.timer_.start();
};
goog.inherits(org.jboss.core.service.query.SimpleTimeCache, goog.Disposable);


/** @inheritDoc */
org.jboss.core.service.query.SimpleTimeCache.prototype.disposeInternal = function() {
  org.jboss.core.service.query.SimpleTimeCache.superClass_.disposeInternal.call(this);

  goog.events.unlistenByKey(this.timerKey_);

  // stop the interval
  goog.dispose(this.timer_);
  delete this.timer_;

  // completely destroy and delete the cache
  goog.array.forEach(goog.object.getKeys(this.cache_), function(key) {
    this.removeForKey_(key);
  }, this);
  delete this.cache_;
};


/**
 * @private
 */
org.jboss.core.service.query.SimpleTimeCache.prototype.removeExpiredFromCache_ = function() {
  var now = this.getNow_();
  var offset = now - (this.expiration_ * 1000);
  var expired = goog.object.getKeys(
      goog.object.filter(this.cache_, function(value) {
        return value['created'] < offset;
      }));
  // TODO: record stats to log
  // console.log('removing [' + expired.length + '] out of [' + this.getCacheSize() + '] items from the cache');
  goog.array.forEach(expired, function(key) {
    this.removeForKey_(key);
  }, this);
};


/**
 * Is this key used in this cache?
 *
 * @param {string} key
 * @return {boolean}
 */
org.jboss.core.service.query.SimpleTimeCache.prototype.containsForKey = function(key) {
  return goog.object.containsKey(this.cache_, key);
};


/**
 * Get data store under given key.
 *
 * Note: what you get back is a deep clone of original data.
 *
 * @param {string} key
 * @return {!T|undefined}
 */
org.jboss.core.service.query.SimpleTimeCache.prototype.get = function(key) {
  var v = goog.object.get(this.cache_, key);
  if (goog.isDef(v)) {
    return /** @type {T} */ (goog.object.unsafeClone(v['data']));
  }
  return undefined;
};


/**
 * Store the data under given key in the cache. If there key is already occupied by some data
 * then it is replaced by the new data.
 *
 * Note: Internally, the input data is turned into clone. Make sure not to input data having circular topology.
 *
 * @param {string} key
 * @param {!T} data
 * @throws {Error} if data is null or undefined
 */
org.jboss.core.service.query.SimpleTimeCache.prototype.put = function(key, data) {
  if (!goog.isDefAndNotNull(key)) {
    // should not happen after ADVANCED compilation checks (may be compiler removes this?)
    throw new Error('Undefined key not allowed.');
  }
  if (!goog.isDefAndNotNull(data)) {
    // should not happen after ADVANCED compilation checks (may be compiler removes this?)
    throw new Error('Undefined or Null objects can not be put.');
  }
  var d = goog.object.unsafeClone(data);
  goog.object.set(this.cache_, key, { 'created': this.getNow_(), 'data': d });
};


/**
 * How many records are stored in the cache.
 *
 * @return {number}
 */
org.jboss.core.service.query.SimpleTimeCache.prototype.getCacheSize = function() {
  return goog.object.getKeys(this.cache_).length;
};


/**
 * @return {number} in millis
 * @private
 */
org.jboss.core.service.query.SimpleTimeCache.prototype.getNow_ = function() {
  return goog.now();
};


/**
 * @param {string} key
 * @private_
 */
org.jboss.core.service.query.SimpleTimeCache.prototype.removeForKey_ = function(key) {
  goog.object.remove(this.cache_, key);
};
