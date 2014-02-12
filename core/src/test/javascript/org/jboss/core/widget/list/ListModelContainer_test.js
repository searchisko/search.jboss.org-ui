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

goog.require('goog.events');
goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.jsunit');
goog.require('org.jboss.core.widget.list.ListModel');
goog.require('org.jboss.core.widget.list.ListModelContainer');
goog.require('org.jboss.core.widget.list.event.ListModelEvent');
goog.require('org.jboss.core.widget.list.event.ListModelEventType');

// ---- taken from continuationtestcase_test.html
var original_timeout = goog.testing.ContinuationTestCase.MAX_TIMEOUT;
goog.testing.ContinuationTestCase.MAX_TIMEOUT = 2 * 1000; // prolong default timeout

var testCase = new goog.testing.ContinuationTestCase('Test for org.jboss.core.widget.list.ListModelContainer');
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
 * Test that {@link ListModelContainer} propagates events from all the internal {@link ListModel}s.
 * The test also rely on the fact (thus test it) that the {@link ListModelEvent#target} references
 * the ListModel instance that dispatched the event.
 */
function testListModelContainerShouldPropagateListModelEvents() {

  var lm1_has_fired, lm2_has_fired, lm3_has_fired = false;

  var lm1 = new org.jboss.core.widget.list.ListModel('A1', 'Caption A1');
  var lm2 = new org.jboss.core.widget.list.ListModel('A2', 'Caption A2');
  var lm3 = new org.jboss.core.widget.list.ListModel('A3', 'Caption A3');

  var models = [lm1, lm2, lm3];

  var container = new org.jboss.core.widget.list.ListModelContainer(models);

  goog.events.listen(
      container,
      org.jboss.core.widget.list.event.ListModelEventType.NEW_DATA_SET,
      function(e) {
        var event = /** @type {org.jboss.core.widget.list.event.ListModelEvent} */ (e);
        var lm = event.target;
        assertNotNull(lm);
        var lm_id = lm.getId();
        assertNotNull(lm_id);
        switch (lm_id) {
          case lm1.getId():
            assertTrue(lm === lm1);
            lm1_has_fired = true;
            break;
          case lm2.getId():
            assertTrue(lm === lm2);
            lm2_has_fired = true;
            break;
          case lm3.getId():
            assertTrue(lm === lm3);
            lm3_has_fired = true;
            break;
          default:
            fail('unexpected ListModel.getId() value [' + lm_id + ']');
        }
      },
      false, this
  );

  waitForCondition(
      function() {
        return lm1_has_fired;
      },
      function() {
        lm2.setData([]);
      }
  );

  waitForCondition(
      function() {
        return lm2_has_fired;
      },
      function() {
        lm3.setData([]);
      }
  );

  waitForCondition(
      function() {
        return lm1_has_fired && lm2_has_fired && lm3_has_fired;
      },
      goog.nullFunction
  );

  // fire the first NEW_DATA_SET event
  lm1.setData([]);
}
