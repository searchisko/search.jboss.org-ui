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

goog.provide('org.jboss.search.page.filter.OrderableSupport');

goog.require('goog.array');


/**
 * Functions that put specific order to input data. They can change data in-place.
 * @enum {function(!Array.<{name: string, code: string, orderBy: string, count: number, selected: boolean}>)}
 */
org.jboss.search.page.filter.OrderableSupport.ORDER_FN = {
  NAME: function(data) {
    goog.array.sort(data, function(one, two) {
      return goog.array.defaultCompare(one.orderBy, two.orderBy);
    });
  },
  FREQUENCY: function(data) {
    goog.array.sort(data, function(one, two) {
      // descending, thus '-'
      var r = -goog.array.defaultCompare(one.count, two.count);
      // secondary order is by name
      return r == 0 ? goog.array.defaultCompare(one.orderBy, two.orderBy) : r;
    });
  }
};
