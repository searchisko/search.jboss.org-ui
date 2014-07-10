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

goog.require('goog.testing.jsunit');
goog.require('org.jboss.core.widget.list.ListItem');
goog.require('org.jboss.core.widget.list.ListItemId');
goog.require('org.jboss.core.widget.list.ListModel');
goog.require('org.jboss.core.widget.list.event.ListModelEvent');
goog.require('org.jboss.core.widget.list.event.ListModelEventType');

var testData = function() {
  /**
   * @param {string} value
   * @return {org.jboss.core.widget.list.ListItemId}
   */
  function itemId(value) {
    return /** @type {org.jboss.core.widget.list.ListItemId} */ (value);
  }

  var model = new org.jboss.core.widget.list.ListModel('m1', 'caption');
  assertNotNull(model);
  assertEquals(0, model.getSize());

  var data = [];

  {
    data.push(new org.jboss.core.widget.list.ListItem(itemId('1'), '1'));
    data.push(new org.jboss.core.widget.list.ListItem(itemId('2'), '2'));
    data.push(new org.jboss.core.widget.list.ListItem(itemId('3'), '3'));

    model.setData(data);

    assertEquals(3, model.getSize());
    assertEquals(0, model.getSelectedSize());

    assertFalse(model.isItemSelected(itemId(0)));
    assertFalse(model.isItemSelected(itemId(1)));
    assertFalse(model.isItemSelected(itemId(2)));

    assertEquals('2', model.getListItem(1).getId());

    model.toggleSelectedItemIndex(1);
    assertEquals(1, model.getSelectedSize());
    assertFalse(model.isItemSelected(itemId(1)));
    assertTrue(model.isItemSelected(itemId(2)));
    assertFalse(model.isItemSelected(itemId(3)));
  }

  {
    data = [];
    data.push(new org.jboss.core.widget.list.ListItem(itemId('1'), '1'));
    data.push(new org.jboss.core.widget.list.ListItem(itemId('2'), '2'));

    model.setData(data);
    assertEquals(2, model.getSize());
    assertEquals(0, model.getSelectedSize());

    assertFalse(model.isItemSelected(itemId(1)));
    assertFalse(model.isItemSelected(itemId(2)));
  }

  {
    data = [];
    data.push(new org.jboss.core.widget.list.ListItem(itemId('1'), '1'));
    data.push(new org.jboss.core.widget.list.ListItem(itemId('3'), '3'));

    model.setData(data);
    assertEquals(2, model.getSize());
    assertEquals(0, model.getSelectedSize());

    assertFalse(model.isItemSelected(itemId(1)));
    assertFalse(model.isItemSelected(itemId(3)));

    model.toggleSelectedItemIndex(0);
    assertEquals(1, model.getSelectedSize());
    assertTrue(model.isItemSelected(itemId(1)));

    model.toggleSelectedItemIndex(0);
    assertEquals(0, model.getSelectedSize());
    assertFalse(model.isItemSelected(itemId(1)));
  }
};
