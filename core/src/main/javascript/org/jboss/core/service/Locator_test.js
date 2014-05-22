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
 * @fileoverview Tests of service Locator.
 * The reason why this file is in 'src/main/javascript' and not in 'src/test/javascript' is that we want to benefit from
 * advanced compiler checks. Service locator class uses generics JSDoc and we want to make sure is it used correctly
 * in the test (in other words, that the usage in the test allows a real use cases).
 * <p/>
 * There is a relevant test file in 'src/test/javascript' that is used as a shell to include this file into regular
 * unit test run.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.service.LocatorTest');

goog.require('goog.string');
goog.require('goog.testing.jsunit');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.service.LookUpImpl');


/*
// Can not create Locator instance without passing Lookup instance into constructor.
// Expected compilation error:
// JSC_WRONG_ARGUMENT_COUNT. Function org.jboss.core.service.Locator: called with 0 argument(s).
org.jboss.core.service.LocatorTest.compilationFails = function() {
	var locator = new org.jboss.core.service.Locator();
};
*/

/*
// Can not get lookup from locator if Locator hasn't been instantiated before.
// Expected compilation error:
// JSC_INEXISTENT_PROPERTY. Property getLookup never defined on org.jboss.core.service.Locator
org.jboss.core.service.LocatorTest.getLookupFails = function() {
	assertThrows("Lookup not initiated.", function() {
 		org.jboss.core.service.Locator.getLookup();
 	});
};
*/

org.jboss.core.service.LocatorTest.getInstanceFails = function() {
  org.jboss.core.service.Locator.dispose();
  assertThrows('Locator instance does not exist.', function() {
    org.jboss.core.service.Locator.getInstance();
  });
};

org.jboss.core.service.LocatorTest.locatorIsNotNull = function() {
  org.jboss.core.service.Locator.dispose();
  var lookup = new org.jboss.core.service.LookUpImpl();
  var locator = new org.jboss.core.service.Locator(lookup);
  assertNotNull(locator);
  assertNotNull(org.jboss.core.service.Locator.getInstance());
  assertNotNull(org.jboss.core.service.Locator.getInstance().getLookup());
};

org.jboss.core.service.LocatorTest.locatorIsSingleton = function() {
  org.jboss.core.service.Locator.dispose();
  var lookup = new org.jboss.core.service.LookUpImpl();
  var locator1 = new org.jboss.core.service.Locator(lookup);
  var locator2 = new org.jboss.core.service.Locator(lookup);
  var locator3 = org.jboss.core.service.Locator.getInstance();
  assertTrue(locator1 === locator2);
  assertTrue(locator1 === locator3);
  assertTrue(locator2 === locator3);
};

org.jboss.core.service.LocatorTest.lookupIsSingleton = function() {
  org.jboss.core.service.Locator.dispose();
  var lookup = new org.jboss.core.service.LookUpImpl();
  new org.jboss.core.service.Locator(lookup);
  assertTrue(lookup === org.jboss.core.service.Locator.getInstance().getLookup());
};

org.jboss.core.service.LocatorTest.onlySingleLookupInstanceIsKeptAround = function() {
  org.jboss.core.service.Locator.dispose();
  var lookup1 = new org.jboss.core.service.LookUpImpl();
  new org.jboss.core.service.Locator(lookup1);
  var locator1 = org.jboss.core.service.Locator.getInstance();
  var lookup2 = new org.jboss.core.service.LookUpImpl();
  new org.jboss.core.service.Locator(lookup2);
  var locator2 = org.jboss.core.service.Locator.getInstance();

  assertTrue(locator1 === locator2);
  assertNotNull(lookup1);
  assertNotNull(locator1.getLookup());

  assertTrue(goog.isObject(lookup1));
  assertTrue(goog.isObject(locator1.getLookup()));
  assertObjectEquals(lookup1, locator1.getLookup());
  assertTrue(lookup1 === locator1.getLookup());
  assertTrue(lookup1 === locator2.getLookup());
};
