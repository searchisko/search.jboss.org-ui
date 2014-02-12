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

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.jsunit');
goog.require('org.jboss.core.widget.list.BaseListController');
goog.require('org.jboss.core.widget.list.EchoListControllerTest');
goog.require('org.jboss.core.widget.list.EchoListControllerTest.KEYS');
goog.require('org.jboss.core.widget.list.ListWidgetFactory');

// ---- taken from continuationtestcase_test.html
var original_timeout = goog.testing.ContinuationTestCase.MAX_TIMEOUT;
goog.testing.ContinuationTestCase.MAX_TIMEOUT = 2 * 1000; // prolong default timeout

var testCase = new goog.testing.ContinuationTestCase('Test for org.jboss.core.widget.list.ListWidgetFactory');
testCase.autoDiscoverTests();

// Standalone Closure Test Runner.
if (typeof G_testRunner != 'undefined') {
  G_testRunner.initialize(testCase);
}

var testclass = 'test_only';

function shouldRunTests() {
  // workaround for ContinuationTestCase, see https://github.com/jlgrock/ClosureJavascriptFramework/issues/41
  testCase.saveMessage('Start');
  return true;
}


/**
 * This should remove all testing DIVs from HTML if there are any.
 * It is needed for ClosureTestingMojo to work properly.
 */
function tearDown() {
  goog.array.forEach(
      goog.dom.getElementsByClass(testclass),
      function(element) {
        goog.dom.removeNode(element);
      }
  );
}


/**
 * Test that HTML is generated correctly. First we wait until the first data source delivers data which means
 * that only the first item list HTML should be generated. Next we wait until the second data source delivers
 * data which means the second item list HTML is generated as well. In the end we dispose the controller.
 */
function testEchoListControllerGeneratesHTML() {

  var dataSourceDelay1 = 200;
  var dataSourceDelay2 = 400;
  var smallOffset = 100;
  var shouldHTMLBePartiallyGenerated = false;
  var shouldHTMLBeFullyGenerated = false;
  var firstTestPassed = false;
  var secondTestPassed = false;

  // create and prepare the hosting HTML element
  var hostingDom = goog.dom.createDom('div', testclass);
  goog.dom.removeChildren(hostingDom);
  // we do not need to append the hosting node to the actual Document
  // goog.dom.appendChild(goog.dom.getDocument().body, hostingDom);

  // use factory to create instance of ListController
  var controller = org.jboss.core.widget.list.ListWidgetFactory.build({
    lists: [
      // the first item list is without caption (you can also omit the caption property at all)
      // the second item list has caption
      {key: org.jboss.core.widget.list.EchoListControllerTest.KEYS.KEY1, caption: null},
      {key: org.jboss.core.widget.list.EchoListControllerTest.KEYS.KEY2, caption: 'With Caption'}
    ],
    controllerConstructor: org.jboss.core.widget.list.EchoListControllerTest,
    additionalConstructorParams: [
      {delay: dataSourceDelay1},
      {delay: dataSourceDelay2}
    ],
    attach: hostingDom
  });

  // check controller exists and is of expected type
  assertNotNull(controller);
  assertTrue(controller instanceof org.jboss.core.widget.list.EchoListControllerTest);

  // pass client input into controller
  controller.input('test');

  // give controller some time to do "the stuff" after the first data source delivers data
  // and then check HTML is partially generated
  setTimeout(function() {
    shouldHTMLBePartiallyGenerated = true;
  }, (dataSourceDelay1 + smallOffset));

  // test HTML has been partially generated
  waitForCondition(
      function() { return shouldHTMLBePartiallyGenerated; },
      function() {
        // content of hostingDom -> console.log(hostingDom.innerHTML);
        // <div class="list">
        //     <div id="c1echo0">test</div>
        // </div>
        // <div class="list">
        // </div>
        assertEquals(goog.dom.getChildren(hostingDom).length, 2);
        assertEquals(goog.dom.getChildren(goog.dom.getFirstElementChild(hostingDom)).length, 1);
        assertEquals(goog.dom.getChildren(goog.dom.getLastElementChild(hostingDom)).length, 0);
        firstTestPassed = true;
      }
  );

  // give controller some time to do "all its stuff" and then check HTML is fully generated
  setTimeout(function() {
    shouldHTMLBeFullyGenerated = true;
  }, (dataSourceDelay1 + dataSourceDelay2 + smallOffset));

  // test HTML has been fully generated
  waitForCondition(
      function() { return shouldHTMLBeFullyGenerated; },
      function() {
        // content of hostingDom -> console.log(hostingDom.innerHTML);
        // <div class="list">
        //     <div id="c1echo0">test</div>
        // </div>
        // <div class="list">
        //     <div class="caption">With Caption</div>
        //     <div id="c2echo0">test</div>
        // </div>
        assertEquals(goog.dom.getChildren(hostingDom).length, 2);
        assertEquals(goog.dom.getChildren(goog.dom.getFirstElementChild(hostingDom)).length, 1);
        assertEquals(goog.dom.getChildren(goog.dom.getLastElementChild(hostingDom)).length, 2);
        secondTestPassed = true;
      }
  );

  // in the end we dispose the controller
  waitForCondition(
      function() { return firstTestPassed && secondTestPassed; },
      function() {
        controller.dispose();
        assertTrue(controller.isDisposed());
      }
  );
}


/**
 * Test that if active data sources are aborted (while there are still some active) then they are really aborted
 * and do not cause changes in produced HTML even after expected data delivery interval.
 */
function testEchoListControllerAbortActiveDataResources() {

  var dataSourceDelay1 = 200;
  var dataSourceDelay2 = 400;
  var smallOffset = 100;
  var shouldHTMLBePartiallyGenerated = false;
  var testPassed = false;

  // create and prepare the hosting HTML element
  var hostingDom = goog.dom.createDom('div', testclass);
  goog.dom.removeChildren(hostingDom);
  // we do not need to append the hosting node to the actual Document
  // goog.dom.appendChild(goog.dom.getDocument().body, hostingDom);

  // use factory to create instance of ListController
  var controller = org.jboss.core.widget.list.ListWidgetFactory.build({
    lists: [
      // the first item list is without caption (you can also omit the caption property at all)
      // the second item list has caption
      {key: org.jboss.core.widget.list.EchoListControllerTest.KEYS.KEY1, caption: null},
      {key: org.jboss.core.widget.list.EchoListControllerTest.KEYS.KEY2, caption: 'With Caption'}
    ],
    controllerConstructor: org.jboss.core.widget.list.EchoListControllerTest,
    additionalConstructorParams: [
      {delay: dataSourceDelay1},
      {delay: dataSourceDelay2}
    ],
    attach: hostingDom
  });

  // check controller exists and is of expected type
  assertNotNull(controller);
  assertTrue(controller instanceof org.jboss.core.widget.list.EchoListControllerTest);

  // pass client input into controller
  controller.input('test');
  assertEquals('Expect 2 active data resources', 2, controller.getActiveDataResourcesCount());

  // give controller some time to do "the stuff" after the first data source delivers data
  // and then check HTML is partially generated
  setTimeout(function() {
    shouldHTMLBePartiallyGenerated = true;
  }, (dataSourceDelay1 + smallOffset));

  // abort all active data sources
  waitForCondition(
      function() { return shouldHTMLBePartiallyGenerated; },
      function() {
        controller.abortActiveDataResources();
        assertEquals(0, controller.getActiveDataResourcesCount());
      }
  );

  // wait some more time to see whether controller will do "all its stuff" (meaning generating full HTML)
  // it should not do it since active data sources have been aborted
  setTimeout(function() {
    // content of hostingDom -> console.log(hostingDom.innerHTML);
    // <div class="list">
    //     <div id="c1echo0">test</div>
    // </div>
    // <div class="list">
    // </div>
    assertEquals(goog.dom.getChildren(hostingDom).length, 2);
    assertEquals(goog.dom.getChildren(goog.dom.getFirstElementChild(hostingDom)).length, 1);
    assertEquals(goog.dom.getChildren(goog.dom.getLastElementChild(hostingDom)).length, 0);
    testPassed = true;
  }, (dataSourceDelay1 + dataSourceDelay2 + smallOffset));

  // this step is here to make sure we get timeout error if any of the previous tests did not pass
  waitForCondition(
      function() { return testPassed; },
      function() {
        assertNotNull(controller);
        assertEquals(0, controller.getActiveDataResourcesCount());
      }
  );
}
