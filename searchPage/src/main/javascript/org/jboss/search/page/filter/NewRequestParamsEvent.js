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
 * @fileoverview
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.filter.NewRequestParamsEvent');
goog.provide('org.jboss.search.page.filter.NewRequestParamsEventType');

goog.require('goog.events');
goog.require('goog.events.Event');



/**
 * Filters fire this event whenever client changes selection.
 *
 * @param {string} type
 * @param {!org.jboss.core.context.RequestParams} requestParameters
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.search.page.filter.NewRequestParamsEvent = function(type, requestParameters) {
  goog.events.Event.call(this, type);

  /**
   * @type {!org.jboss.core.context.RequestParams}
   * @private
   */
  this.requestParameters_ = requestParameters;
};
goog.inherits(org.jboss.search.page.filter.NewRequestParamsEvent, goog.events.Event);


/**
 * @return {!org.jboss.core.context.RequestParams}
 */
org.jboss.search.page.filter.NewRequestParamsEvent.prototype.getRequestParameters = function() {
  return this.requestParameters_;
};


/**
 *
 * @enum {string}
 */
org.jboss.search.page.filter.NewRequestParamsEventType = {
  NEW_REQUEST_PARAMETERS: goog.events.getUniqueId('new_request_parameters')
};
