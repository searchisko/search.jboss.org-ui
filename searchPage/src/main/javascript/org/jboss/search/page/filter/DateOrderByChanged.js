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
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.filter.DateOrderByChanged');

goog.require('goog.events.Event');
goog.require('org.jboss.search.page.filter.DateFilterEventType');



/**
 * @param {!org.jboss.core.context.RequestParams.Order} orderBy
 * @constructor
 * @extends {goog.events.Event}
 */
org.jboss.search.page.filter.DateOrderByChanged = function(orderBy) {
  goog.events.Event.call(this, org.jboss.search.page.filter.DateFilterEventType.DATE_ORDER_BY_CHANGED);

  /**
   * @type {!org.jboss.core.context.RequestParams.Order}
   * @private
   */
  this.orderBy_ = orderBy;
};
goog.inherits(org.jboss.search.page.filter.DateOrderByChanged, goog.events.Event);


/**
 * @return {!org.jboss.core.context.RequestParams.Order}
 */
org.jboss.search.page.filter.DateOrderByChanged.prototype.getOrderBy = function() {
  return this.orderBy_;
};
