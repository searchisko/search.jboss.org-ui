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

/**
 * @fileoverview Basic List item renderer. It outputs a simple Text Node which
 * is getting content from {@link ListItem#getValue()}. This renderer is the default
 * one used by {@link ListController} if not stated otherwise.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */
goog.provide('org.jboss.core.widget.list.BasicListItemRenderer');

goog.require('goog.dom');
goog.require('org.jboss.core.widget.list.ListItemRenderer');



/**
 *
 * @constructor
 * @implements {org.jboss.core.widget.list.ListItemRenderer}
 */
org.jboss.core.widget.list.BasicListItemRenderer = function() {};


/** @override */
org.jboss.core.widget.list.BasicListItemRenderer.prototype.render = function(listItem) {
  // TODO: we need to be careful about XSS and catching click event with nested elements!
  return goog.dom.createTextNode(listItem.getValue());
//  return goog.dom.htmlToDocumentFragment(listItem.getValue());
};
