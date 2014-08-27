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
 * @fileoverview List item renderer interface. Implementing classes should
 * behave like a singleton in the sense that they can be reused by multiple
 * {@link ListController}s. They should not hold any state.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */
goog.provide('org.jboss.core.widget.list.ListItemRenderer');

goog.require('org.jboss.core.widget.list.ListItem');



/**
 *
 * @interface
 */
org.jboss.core.widget.list.ListItemRenderer = function() {};


/**
 *
 * @param {org.jboss.core.widget.list.ListItem} listItem
 * @return {Node}
 */
org.jboss.core.widget.list.ListItemRenderer.prototype.render = function(listItem) {};
