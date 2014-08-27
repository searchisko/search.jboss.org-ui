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

goog.require('goog.dom');
goog.require('goog.string.html.htmlSanitize');
goog.require('goog.testing.jsunit');
goog.require('org.jboss.core.widget.list.BasicListItemRenderer');
goog.require('org.jboss.core.widget.list.ListItem');
goog.require('org.jboss.core.widget.list.ListItemRenderer');
goog.require('org.jboss.core.widget.list.SafeHTMLListItemRenderer');


/**
 * Test {@link BasicListItemRenderer}.
 */
var testBasicListItemRenderer = function() {
  var renderer = new org.jboss.core.widget.list.BasicListItemRenderer();
  var item = new org.jboss.core.widget.list.ListItem('1', 'Foo');
  /** @type {Node} */ var node = renderer.render(item);
  assertEquals(node.nodeType, Node.TEXT_NODE);
  assertTrue(node instanceof Text);
  var n = /** @type {Text} */ (node);
  assertEquals('Foo', n.wholeText);

};


/**
 * Test {@link SafeHTMLListItemRenderer}.
 */
var testSafeHTMLListItemRenderer = function() {
  var item;
  var renderer = new org.jboss.core.widget.list.SafeHTMLListItemRenderer();
  // test: if input if a nice HTML fragment
  {
    item = new org.jboss.core.widget.list.ListItem('1', 'Foo <b>Bar<em>X</em></b>');
    /** @type {Node} */ var node = renderer.render(item);
    assertEquals(node.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
    assertTrue(node instanceof Node);
    assertEquals('Foo BarX', node.textContent);
    var e = /** @type {Element} */ (node); // we know value so we can do this in this test
    assertEquals('Foo <b>Bar<em>X</em></b>', goog.dom.getOuterHtml(e));
    var child = goog.dom.getFirstElementChild(e);
    assertEquals('Bar<em>X</em>', child.innerHTML);
    child = goog.dom.getFirstElementChild(child);
    assertEquals('X', child.innerHTML);
  }
  // test: if input is dangerous HTML fragment then it should be sanitized
  {
    item = new org.jboss.core.widget.list.ListItem('1', '<script>evil();</script>I am a <em>nice</em> guy!');
    /** @type {Node} */ var node = renderer.render(item);
    assertEquals(node.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
    var e = /** @type {Element} */ (node); // we know value so we can do this in this test
    assertEquals('I am a <em>nice</em> guy!', goog.dom.getOuterHtml(e));
  }
  // test: if input contains <img> then it is sanitized too (by default it is very strict)
  {
    item = new org.jboss.core.widget.list.ListItem('1', '<a href="https://#"><img src="https://#1" longdesc="https://#2" onload="javascript:alert();"></a> Click my avatar icon!');
    /** @type {Node} */ var node = renderer.render(item);
    assertEquals(node.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
    var e = /** @type {Element} */ (node); // we know value so we can do this in this test
    assertEquals('<a><img></a> Click my avatar icon!', goog.dom.getOuterHtml(e));
  }
};
