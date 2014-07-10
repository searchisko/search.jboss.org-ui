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
 * @fileoverview Filter utils.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.filter.FilterUtils');

goog.require('goog.array');
goog.require('org.jboss.core.widget.list.ListItem');


/**
 * Convert data in array to another array of data that that can be dispatched by the {@link DataSource}.
 *
 * @param {Array.<{name: string, code: string, orderBy: string, count: number, selected: boolean}>} data
 * @return {!Array.<org.jboss.core.widget.list.ListItem>}
 */
org.jboss.search.page.filter.FilterUtils.convertDataToEventData = function(data) {
  var a = [];
  if (goog.isDefAndNotNull(data) && goog.isArrayLike(data)) {
    goog.array.forEach(data, function(item) {
      var name = (item.hasOwnProperty('count') && item.count > 0) ?
          item['name'] + ' (' + item['count'] + ')' : item['name'];
      var selected = (item.hasOwnProperty('selected') && item['selected'] == true) ? true : false;
      a.push(new org.jboss.core.widget.list.ListItem(item['code'], name, selected));
    });
  }
  return a;
};
