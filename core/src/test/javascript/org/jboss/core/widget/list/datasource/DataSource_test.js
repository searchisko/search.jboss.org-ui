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
goog.require('org.jboss.core.widget.list.datasource.DataSource');
goog.require('org.jboss.core.widget.list.datasource.DataSourceEventType');
goog.require('org.jboss.core.widget.list.datasource.EchoDataSource');

var testCase = new goog.testing.ContinuationTestCase('Test for org.jboss.core.widget.list.datasource.DataSource');
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
 * Basic test of EchoDataSource.
 */
function testEchoDataSourceWithoutDelay() {
  var message = 'Hello!';
  var echoDS = new org.jboss.core.widget.list.datasource.EchoDataSource({});
  var event = null;

  goog.events.listenOnce(
      echoDS,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      function(e) {
        event = e;
      }, false, this
  );

  waitForCondition(
      function() {
        return event != null;
      },
      function() {
        assertNotNull(event);
        assertEquals(1, event.getData().length);
        assertEquals(message, event.getData()[0].getValue());
      },
      this
  );

  echoDS.get(message);
}


/**
 * Basic test of EchoDataSource with decent delay, testing it is in active state during action.
 */
function testEchoDataSourceIsActiveDuringAction() {
  var message = 'Hello!';
  var echoDS = new org.jboss.core.widget.list.datasource.EchoDataSource({delay: 400});
  var event = null;

  goog.events.listenOnce(
      echoDS,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      function(e) {
        event = e;
      }, false, this
  );

  waitForCondition(
      function() {
        return event != null;
      },
      function() {
        assertNotNull(event);
        assertEquals(1, event.getData().length);
        assertEquals(message, event.getData()[0].getValue());
        assertFalse(echoDS.isActive());
      },
      this
  );

  echoDS.get(message);
  assertTrue(echoDS.isActive());
}

function testEchoDataSourceCanBeAbortedWithoutFiringEvent() {

  var delay = 600;
  var message = 'Hello!';
  var echoDS = new org.jboss.core.widget.list.datasource.EchoDataSource({delay: delay});
  var event = null;

  var hasBeenAborted = false;
  var afterDelay = false;

  goog.events.listenOnce(
      echoDS,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      function(e) {
        event = e;
        fail('should not happen');
      }, false, this
  );

  // abort data source as soon as it becomes active
  waitForCondition(
      function() {
        return echoDS.isActive();
      },
      function() {
        assertTrue(echoDS.isActive());
        echoDS.abort();
        hasBeenAborted = true;
      }
  );

  // data source is not active after it has been aborted
  waitForCondition(
      function() {
        return hasBeenAborted;
      },
      function() {
        assertFalse(echoDS.isActive());
      }
  );

  // event has not been fired after the data source was aborted and the EchoDataSource delay is passed
  waitForCondition(
      function() {
        return afterDelay;
      },
      function() {
        assertNull(event);
      }
  );

  // start action in data source
  echoDS.get(message);

  setTimeout(function() {
    // We after EchoDataSource delay, at this point the event should
    // have been fired if the the data source hasn't been aborted.
    afterDelay = true;
  }, delay + 100);
}
