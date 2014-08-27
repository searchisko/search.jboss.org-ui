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
goog.require('org.jboss.core.widget.list.BasicListItemRenderer');
goog.require('org.jboss.core.widget.list.ListItem');
goog.require('org.jboss.core.widget.list.ListModel');
goog.require('org.jboss.core.widget.list.ListModelContainer');
goog.require('org.jboss.core.widget.list.ListView');
goog.require('org.jboss.core.widget.list.ListViewContainer');
goog.require('org.jboss.core.widget.list.event.ListViewEventType');

// ---- taken from continuationtestcase_test.html
var original_timeout = goog.testing.ContinuationTestCase.MAX_TIMEOUT;
goog.testing.ContinuationTestCase.MAX_TIMEOUT = 2 * 1000; // prolong default timeout

var testCase = new goog.testing.ContinuationTestCase('Test for org.jboss.core.widget.list.ListViewContainer');
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
 * This should remove all testing DIVs from HTML.
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
 * This tests that after couple of async model updates the views are
 * representing expected content.
 */
function testHostingDOMContentAfterViewesWereUpdates() {

  var hostingDom = goog.dom.createDom('div', testclass);
  goog.dom.removeChildren(hostingDom);
  goog.dom.appendChild(goog.dom.getDocument().body, hostingDom);

  var lv1_has_fired = false;
  var lv3_has_fired = false;

  // setup models
  var lm1 = new org.jboss.core.widget.list.ListModel('a1', 'caption a1');
  var lm2 = new org.jboss.core.widget.list.ListModel('a2', 'caption a2');
  var lm3 = new org.jboss.core.widget.list.ListModel('a3', 'caption a3');
  var lmc = new org.jboss.core.widget.list.ListModelContainer([lm1, lm2, lm3]);

  var renderer = new org.jboss.core.widget.list.BasicListItemRenderer();

  // setup views and tell them which models they should observe for changes
  var lv1 = new org.jboss.core.widget.list.ListView('a1', 'caption a1', renderer);
  var lv2 = new org.jboss.core.widget.list.ListView('a2', 'caption a2', renderer);
  var lv3 = new org.jboss.core.widget.list.ListView('a3', 'caption a3', renderer);
  var lvc = new org.jboss.core.widget.list.ListViewContainer([lv1, lv2, lv3], lmc, hostingDom);

  goog.events.listen(
      lvc,
      org.jboss.core.widget.list.event.ListViewEventType.VIEW_UPDATE,
      function(e) {
        assertNotNull(e.target);
        var listView = /** @type {org.jboss.core.widget.list.ListView} */ (e.target);
        var id = listView.getId();
        assertNotNull(id);
        switch (id) {
          case lv1.getId():
            lv1_has_fired = true;
            break;
          case lv3.getId():
            lv3_has_fired = true;
            break;
        }
      }
  );

  waitForCondition(
      function() { return lv1_has_fired; },
      function() {
        setTimeout(function() {
          // update model
          lm1.setData([
            new org.jboss.core.widget.list.ListItem('2', 'item 2'),
            new org.jboss.core.widget.list.ListItem('3', 'item 3'),
            new org.jboss.core.widget.list.ListItem('4', 'item 4'),
            new org.jboss.core.widget.list.ListItem('5', 'item 5')
          ]);
        }, 20);
      }
  );

  waitForCondition(
      function() { return lv1_has_fired; },
      function() {
        setTimeout(function() {
          // update model
          lm3.setData([
            new org.jboss.core.widget.list.ListItem('1', 'item 1'),
            new org.jboss.core.widget.list.ListItem('2', 'item 2')
          ]);
        }, 50);
      }
  );

  waitForCondition(
      function() { return lv1_has_fired && lv3_has_fired; },
      function() {
        // verify content of hostingDom
        var children = goog.dom.getChildren(hostingDom);

        assertEquals('there are three child elements (three list views) in hosting element', 3, children.length);

        assertEquals(
            '<div class="list">' +
            '<div class="caption">caption a1</div>' +
            '<div id="a12" class="li">item 2</div>' +
            '<div id="a13" class="li">item 3</div>' +
            '<div id="a14" class="li">item 4</div>' +
            '<div id="a15" class="li">item 5</div>' +
            '</div>',
            children[0].outerHTML.toLowerCase()
        );

        assertEquals('', children[1].innerHTML);
        assertEquals('<div class="list"></div>', children[1].outerHTML.toLowerCase());
      }
  );

  // update first model
  lm1.setData([
    new org.jboss.core.widget.list.ListItem('1', 'item 1'),
    new org.jboss.core.widget.list.ListItem('2', 'item 2')
  ]);
}


/**
 * This test demonstrates that there are created as many empty lists as there are input {@link ListView}s
 * to the constructor of {@link ListViewContainer}.
 * Then is shows that if the list is not empty but model is updated with no data, the list becomes empty again.
 */
function testEmptyListDiv() {

  var hostingDom = goog.dom.createDom('div', testclass);
  goog.dom.removeChildren(hostingDom);
  goog.dom.appendChild(goog.dom.getDocument().body, hostingDom);

  assertEquals('hosting element is empty now', 0, goog.dom.getChildren(hostingDom).length);

  var lv1_has_fired1 = false;
  var lv1_has_fired2 = false;

  var lm1 = new org.jboss.core.widget.list.ListModel('a1', 'caption a1');
  var lmc = new org.jboss.core.widget.list.ListModelContainer([lm1]);

  var renderer = new org.jboss.core.widget.list.BasicListItemRenderer();

  var lv1 = new org.jboss.core.widget.list.ListView('a1', 'caption a1', renderer);
  var lvc = new org.jboss.core.widget.list.ListViewContainer([lv1], lmc, hostingDom);

  assertEquals('hosting element contains 1 list', 1, goog.dom.getChildren(hostingDom).length);
  assertEquals('and the list is empty', 0, goog.dom.getChildren(goog.dom.getChildren(hostingDom)[0]).length);

  goog.events.listen(
      lvc,
      org.jboss.core.widget.list.event.ListViewEventType.VIEW_UPDATE,
      function(e) {
        assertNotNull(e.target);
        var listView = /** @type {org.jboss.core.widget.list.ListView} */ (e.target);
        var id = listView.getId();
        assertNotNull(id);
        switch (id) {
          case lv1.getId():
            if (lv1_has_fired1 == false) {
              lv1_has_fired1 = true;
            } else {
              lv1_has_fired2 = true;
            }
            break;
        }
      }
  );

  // update model for the first time, put some data in it
  lm1.setData([
    new org.jboss.core.widget.list.ListItem('1', 'item 1')
  ]);

  waitForCondition(
      function() {
        return lv1_has_fired1;
      },
      function() {
        assertTrue('the list is not empty', goog.dom.getChildren(goog.dom.getChildren(hostingDom)[0]).length > 0);

        // update model for the second time, put in empty data
        lm1.setData([]);
      }
  );

  waitForCondition(
      function() { return lv1_has_fired2; },
      function() {
        assertEquals('the list is empty', 0, goog.dom.getChildren(goog.dom.getChildren(hostingDom)[0]).length);
      }
  );
}


/**
 * Testing the DOM manipulation: specifically the selecting and deselecting elements.
 */
function testDOMwithActiveItems() {
  var hostingDom = goog.dom.createDom('div', testclass);
  goog.dom.removeChildren(hostingDom);

  var new_data_in_model = false;
  var first_test_passed = false;
  var second_test_passed = false;

  var lm1 = new org.jboss.core.widget.list.ListModel('a1', 'caption a1');
  var lm2 = new org.jboss.core.widget.list.ListModel('a2', 'caption a2');
  var lmc = new org.jboss.core.widget.list.ListModelContainer([lm1, lm2]);

  var renderer = new org.jboss.core.widget.list.BasicListItemRenderer();

  var lv1 = new org.jboss.core.widget.list.ListView('a1', 'caption a1', renderer);
  var lv2 = new org.jboss.core.widget.list.ListView('a2', 'caption a2', renderer);
  var lvc = new org.jboss.core.widget.list.ListViewContainer([lv1, lv2], lmc, hostingDom);

  goog.events.listen(
      lvc,
      org.jboss.core.widget.list.event.ListViewEventType.VIEW_UPDATE,
      function(e) {
        assertNotNull(e.target);
        new_data_in_model = true;
      }
  );

  // once we have some data we want to select some of the list items
  waitForCondition(
      function() {
        return new_data_in_model;
      },
      function() {
        lv1.pointInDOM(lvc.getViewDoms()['a1'], 1);
        lv2.pointInDOM(lvc.getViewDoms()['a2'], 0);

        //console.log(lvc.getViewDoms()['a1'].outerHTML.toLowerCase());
        assertEquals(
            '<div class="list">' +
            '<div class="caption">caption a1</div>' +
            '<div id="a11" class="li">item 1</div>' +
            '<div id="a12" class="li pointed">item 2</div>' +
            '<div id="a13" class="li">item 3</div>' +
            '</div>',
            lvc.getViewDoms()['a1'].outerHTML.toLowerCase()
        );

        //console.log(lvc.getViewDoms()['a2'].outerHTML.toLowerCase());
        assertEquals(
            '<div class="list">' +
            '<div class="caption">caption a2</div>' +
            '<div id="a21" class="li pointed">item 1</div>' +
            '<div id="a22" class="li">item 2</div>' +
            '</div>',
            lvc.getViewDoms()['a2'].outerHTML.toLowerCase()
        );

        first_test_passed = true;
      }
  );

  // deselect items in the second model
  waitForCondition(
      function() {
        return first_test_passed;
      },
      function() {
        lv2.depointInDOM(lvc.getViewDoms()['a2']);

        // should be still selected
        //console.log(lvc.getViewDoms()['a1'].outerHTML.toLowerCase());
        assertEquals(
            '<div class="list">' +
            '<div class="caption">caption a1</div>' +
            '<div id="a11" class="li">item 1</div>' +
            '<div id="a12" class="li pointed">item 2</div>' +
            '<div id="a13" class="li">item 3</div>' +
            '</div>',
            lvc.getViewDoms()['a1'].outerHTML.toLowerCase()
        );

        //console.log(lvc.getViewDoms()['a2'].outerHTML.toLowerCase());
        assertEquals(
            '<div class="list">' +
            '<div class="caption">caption a2</div>' +
            '<div id="a21" class="li">item 1</div>' +
            '<div id="a22" class="li">item 2</div>' +
            '</div>',
            lvc.getViewDoms()['a2'].outerHTML.toLowerCase()
        );

        second_test_passed = true;
      }
  );

  waitForCondition(
      function() {
        return first_test_passed && second_test_passed;
      },
      function() {
        assertTrue('Both test passed', true);
      }
  );

  // update models
  lm1.setData([
    new org.jboss.core.widget.list.ListItem('1', 'item 1'),
    new org.jboss.core.widget.list.ListItem('2', 'item 2'),
    new org.jboss.core.widget.list.ListItem('3', 'item 3')
  ]);

  lm2.setData([
    new org.jboss.core.widget.list.ListItem('1', 'item 1'),
    new org.jboss.core.widget.list.ListItem('2', 'item 2')
  ]);

}
