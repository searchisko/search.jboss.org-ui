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
 * @fileoverview
 * TODO: remove if not used
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.widget.list.datasource.XHRDataSource');

goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrManager.Event');
goog.require('org.jboss.core.Constants');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.widget.list.ListItem');
goog.require('org.jboss.core.widget.list.datasource.DataSource');
goog.require('org.jboss.core.widget.list.datasource.DataSourceEvent');



/**
 *
 * @param {string} uri
 * @param {string} requestId
 * @param {string} requestPriority
 * @param {function(Object): !Array.<org.jboss.core.widget.list.ListItem>} dataTransformation
 * @constructor
 * @implements {org.jboss.core.widget.list.datasource.DataSource}
 * @extends {goog.events.EventTarget}
 */
org.jboss.core.widget.list.datasource.XHRDataSource = function(uri, requestId, requestPriority, dataTransformation) {
  goog.events.EventTarget.call(this);

  /**
   * @type {string}
   * @private
   */
  this.uri_ = uri;

  /**
   * @type {string}
   * @private
   */
  this.requestId_ = requestId;

  /**
   * @type {string}
   * @private
   */
  this.requestPriority_ = requestPriority;

  /**
   * @type {function(Object): !Array.<org.jboss.core.widget.list.ListItem>}
   * @private
   */
  this.dataTransformation_ = dataTransformation;
};
goog.inherits(org.jboss.core.widget.list.datasource.XHRDataSource, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.core.widget.list.datasource.XHRDataSource.prototype.disposeInternal = function() {
  org.jboss.core.widget.list.datasource.XHRDataSource.superClass_.disposeInternal.call(this);
  delete this.dataTransformation_;
};


/** @inheritDoc */
org.jboss.core.widget.list.datasource.XHRDataSource.prototype.abort = function() {

};


/** @inheritDoc */
org.jboss.core.widget.list.datasource.XHRDataSource.prototype.isActive = function() {

};


/** @inheritDoc */
org.jboss.core.widget.list.datasource.XHRDataSource.prototype.get = function(query) {
  var xhrManager = org.jboss.core.service.Locator.getInstance().getLookup().getXhrManager();

  var ids = xhrManager.getOutstandingRequestIds();
  if (goog.array.contains(ids, this.requestId_)) {
    xhrManager.abort(this.requestId_, true);
    //this.dispatcher_.dispatchUserQueryAbort();
  }

  xhrManager.send(
      this.requestId_,
      '', //query_url_string_,
      org.jboss.core.Constants.GET,
      '', // post_data
      {}, // headers_map
      this.requestPriority_,
      // callback, The only param is the event object from the COMPLETE event.
      goog.bind(function(e) {
        //this.dispatcher_.dispatchUserQueryFinished();
        var event = /** @type {goog.net.XhrManager.Event} */ (e);
        if (event.target.isSuccess()) {
          /*
           try {
             this.dispatcher_.dispatchNewRequestParameters(requestParams);
             var response = event.target.getResponseJson();
             var normalizedResponse = org.jboss.search.response.normalizeSearchResponse(response, requestParams);
             this.dispatcher_.dispatchUserQuerySucceeded(normalizedResponse);
           } catch (err) {
             this.dispatcher_.dispatchUserQueryError(requestParams.getQueryString(), err);
           }
          */
        } else {
          // We failed getting search results data
          // this.dispatcher_.dispatchUserQueryError(requestParams.getQueryString(), event.target.getLastError());
        }
      }, this)
  );

  this.dispatchEvent(
      new org.jboss.core.widget.list.datasource.DataSourceEvent(
          []
      )
  );
};

