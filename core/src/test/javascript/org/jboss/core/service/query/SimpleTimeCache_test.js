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

goog.require('goog.events');
goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.jsunit');
goog.require('org.jboss.core.service.query.SimpleTimeCache');

// ---- taken from continuationtestcase_test.html
var original_timeout = goog.testing.ContinuationTestCase.MAX_TIMEOUT;
goog.testing.ContinuationTestCase.MAX_TIMEOUT = 2 * 1000; // prolong default timeout

var testCase = new goog.testing.ContinuationTestCase('Test for org.jboss.core.service.query.SimpleTimeCache');
testCase.autoDiscoverTests();

// Standalone Closure Test Runner.
if (typeof G_testRunner != 'undefined') {
  G_testRunner.initialize(testCase);
}

function shouldRunTests() {
  // workaround for ContinuationTestCase, see https://github.com/jlgrock/ClosureJavascriptFramework/issues/41
  testCase.saveMessage('Start');
  return true;
}


/**
 * Test the cache. First we set two objects and test they expire after specified interval.
 * We set another object into the cache in the meantime and test it expires later as well.
 * In the end we test that the cache can be disposed.
 */
function testSimpleCache() {

  var firstExpiration = false;
  var secondExpiration = false;

  var cache = new org.jboss.core.service.query.SimpleTimeCache(0.4); // 400ms
  assertNotNull(cache);

  setTimeout(function() { firstExpiration = true; }, 500);
  setTimeout(function() { secondExpiration = true; }, 1000);

  {
    assertTrue(cache.getCacheSize() == 0);
    assertFalse(cache.containsForKey('1'));
    assertFalse(cache.containsForKey('2'));
    assertFalse(cache.containsForKey('3'));

    cache.put('1', 'One');
    cache.put('2', 'Two');
    setTimeout(function() { cache.put('3', 'Three'); }, 400);

    assertTrue(cache.getCacheSize() == 2);
    assertTrue(cache.containsForKey('1'));
    assertTrue(cache.containsForKey('2'));
    assertFalse(cache.containsForKey('3'));
  }

  waitForCondition(
      function() {
        return firstExpiration;
      },
      function() {
        assertTrue(cache.getCacheSize() == 1);
        assertFalse(cache.containsForKey('1'));
        assertFalse(cache.containsForKey('2'));
        assertTrue(cache.containsForKey('3'));
      }
  );

  waitForCondition(
      function() {
        return secondExpiration;
      },
      function() {
        assertTrue(cache.getCacheSize() == 0);
        assertFalse(cache.containsForKey('1'));
        assertFalse(cache.containsForKey('2'));
        assertFalse(cache.containsForKey('3'));
      }
  );

  setTimeout(function() {goog.dispose(cache)}, 1500);

  waitForCondition(
      function() {
        return cache.isDisposed();
      },
      function() {
        // if this is not executed the test will timeout (which should be considered an error!)
        try {
          // this should fire an error because cache has been disposed
          cache.get('1');
        } catch (e) {
          assertTrue(e instanceof TypeError);
        }
      }
  );
}

/**
 * This test that expired cache records are removed when internal cache check is executed.
 * Frequency of this check is driven by the 'validation' value passed into constructor (usually
 * the 'validation' value should be much smaller then the 'expiration' value).
 * In this test we use a small trick to test the effect of internal validation check by setting
 * the 'validation' value to greater value then the 'expiration' value.
 */
function testSimpleCacheExpirationCheckInterval() {

  var firstExpiration = false;
  var secondExpiration = false;
  setTimeout(function() { firstExpiration = true; }, 300);
  setTimeout(function() { secondExpiration = true; }, 500);

  var cache = new org.jboss.core.service.query.SimpleTimeCache(0.2, 0.4); // 200ms
  assertNotNull(cache);

  cache.put('1', 'One');
  cache.put('2', 'Two');

  // no records from cache are removed despite records are already expired
  waitForCondition(
      function() {
        return firstExpiration;
      },
      function() {
        assertEquals(2, cache.getCacheSize());
      }
  );

  // but now they are removed
  waitForCondition(
    function() {
      return secondExpiration;
    },
    function() {
      assertEquals(0, cache.getCacheSize());
    }
  );
}

/**
 * Test the cache correctly clone objects on both the 'put' and 'get' operations.
 */
function testSimpleCacheCloneObject() {

  var cache = new org.jboss.core.service.query.SimpleTimeCache(1);

  var model = { value: 'original' };
  cache.put('1', model);

  // change value in model object and test that the cached version
  // is intact and still keeps the original value
  {
    model.value = 'changed';
    var clone = cache.get('1');

    // references not equal
    assertTrue(model != clone);
    assertEquals('original', clone.value);
  }

  // change value of clone after it has been retrieved from the cache
  // and verify this does not affect future clones
  {
    clone.value = 'overridden';
    var nextClone = cache.get('1');

    // references not equal
    assertTrue(model != clone);
    assertEquals('original', nextClone.value);
  }

  goog.dispose(cache);
}
