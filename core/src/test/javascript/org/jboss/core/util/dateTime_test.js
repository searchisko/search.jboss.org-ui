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

goog.require('goog.testing.jsunit');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.service.LookUpImpl');
goog.require('org.jboss.core.util.dateTime');

var setUpPage = function() {
  // setup service locator
  new org.jboss.core.service.Locator(
      new org.jboss.core.service.LookUpImpl()
  );
};

var tearDownPage = function() {
  // dispose service locator
  org.jboss.core.service.Locator.dispose();
};

var testFloorToDays = function() {

  var dt = new goog.date.DateTime(2006, 11, 6, 10, 4, 2);
  var ndt = org.jboss.core.util.dateTime.floorToDays(dt);

  assertEquals(2006, dt.getYear());
  assertEquals(11, dt.getMonth());
  assertEquals(6, dt.getDate());
  assertEquals(10, dt.getHours());
  assertEquals(4, dt.getMinutes());
  assertEquals(2, dt.getSeconds());
  assertEquals(0, dt.getMilliseconds());

  assertEquals(2006, ndt.getYear());
  assertEquals(11, ndt.getMonth());
  assertEquals(6, ndt.getDate());
  assertEquals(0, ndt.getHours());
  assertEquals(0, ndt.getMinutes());
  assertEquals(0, ndt.getSeconds());
  assertEquals(0, ndt.getMilliseconds());

  assertFalse(dt.equals(ndt));
};

var testDateFormatter = function() {

  /** @type {string} */ var formatterDate;
  var dt = new goog.date.DateTime(2006, 11, 6, 10, 4, 2);

  var formatter = new goog.i18n.DateTimeFormat(org.jboss.core.Variables.SHORT_DATE_FORMAT);
  formatterDate = org.jboss.core.util.dateTime.format(dt, formatter);

  assertEquals('2006-12-06', formatterDate);

  formatter = new goog.i18n.DateTimeFormat(org.jboss.core.Variables.MEDIUM_DATE_FORMAT);
  formatterDate = org.jboss.core.util.dateTime.format(dt, formatter);

  assertEquals('2006-12-6, 10:04AM', formatterDate);
};

var testShortDateFormatter = function() {

  /** @type {string} */ var formatterDate;
  var dt = new goog.date.DateTime(2006, 11, 6, 10, 4, 2);
  formatterDate = org.jboss.core.util.dateTime.formatShortDate(dt);

  assertEquals('2006-12-06', formatterDate);
};

var testMediumDateFormatter = function() {

  /** @type {string} */ var formatterDate;
  var dt = new goog.date.DateTime(2006, 11, 6, 10, 4, 2);
  formatterDate = org.jboss.core.util.dateTime.formatMediumDate(dt);

  assertEquals('2006-12-6, 10:04am', formatterDate);
};
