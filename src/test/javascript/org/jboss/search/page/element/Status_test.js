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

goog.require('org.jboss.search.page.element.Status');

goog.require('goog.dom');

goog.require('goog.testing.jsunit');

// this div host status window
var div;

// create div element, assign style and if possible inject into DOM
var setUp = function() {
    div = goog.dom.createElement('div');
    goog.dom.setProperties(div,{ 'id': 'status_window'});
    var container = goog.dom.getElement('body');
    if (goog.isDefAndNotNull(container)) {
        // if running in browser append element to the body so we can actually see it
        goog.dom.append(container, [div]);
    }
};

// cleanup
var tearDown = function() {
    goog.dom.removeNode(div);
};

/**
 * Test basic status window functionality
 */
var testBasicStatus = function() {

    var status = new org.jboss.search.page.element.Status(div);

    status.setProgressValue(0.5);
    assertEquals(0.5, status.getProgressValue());

    status.setStatus('Loading...');
    assertEquals('Loading...', status.getStatus());

    status.dispose();
    assertTrue(status.isDisposed());
    assertEquals('parent div is empty',0, goog.dom.getChildren(div).length);
};

/**
 * Make sure progress bar value can not be set out of [0..1] range.
 */
var testStatusProgressValueRange = function() {

    var status = new org.jboss.search.page.element.Status(div);

    status.setProgressValue(0.5);
    assertEquals(0.5, status.getProgressValue());

    status.setProgressValue(-0.5);
    assertEquals(0, status.getProgressValue());

    status.setProgressValue(1);
    assertEquals(1, status.getProgressValue());

    status.setProgressValue(0);
    status.setProgressValue(2);
    assertEquals(1, status.getProgressValue());

    status.dispose();
    assertTrue(status.isDisposed());
    assertEquals('parent div is empty',0, goog.dom.getChildren(div).length);
};
