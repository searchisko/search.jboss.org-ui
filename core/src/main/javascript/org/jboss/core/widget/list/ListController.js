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

/**
 * @fileoverview
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.widget.list.ListController');

goog.require('goog.Disposable');
goog.require('org.jboss.core.widget.list.ListModelContainer');
goog.require('org.jboss.core.widget.list.ListViewContainer');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener');



/**
 * View controller is the central business logic class that defines control flow
 * involving list views, list models, data sources and possibly other custom objects.
 *
 * Controller constructor is expected to accept both list model controller and
 * list view controller as first two parameters. It can optionally allow additional
 * parameters (depending on implementation needs).
 * See the {@link ListWidgetFactory} for details about how to pass additional constructor parameters.
 *
 * Important: make sure implementing class extends disposable if needed.
 *
 * @param {org.jboss.core.widget.list.ListModelContainer} lmc
 * @param {org.jboss.core.widget.list.ListViewContainer} lvc
 * @interface
 */
org.jboss.core.widget.list.ListController = function(lmc, lvc) {};


/**
 * Pass in client input.  Typically this function is called when user provides a new query text.
 * @param {string} query
 */
org.jboss.core.widget.list.ListController.prototype.input = function(query) {};


/**
 * Stop all active request for data sources.
 * Typically this function is called when user cancels list widget operation. In most cases
 * this is useful if there asynchronous data sources (for example they use XHR to get data).
 */
org.jboss.core.widget.list.ListController.prototype.abortActiveDataResources = function() {};


/**
 * Returns number of active data sources.
 * @return {number}
 */
org.jboss.core.widget.list.ListController.prototype.getActiveDataResourcesCount = function() {};


/**
 * Set keyboard listener.  Controller is not in charge of {@link KeyboardListener} lifecycle. It should
 * for example never call dispose on it.
 * @param {org.jboss.core.widget.list.keyboard.KeyboardListener=} opt_keyboardListener
 */
org.jboss.core.widget.list.ListController.prototype.setKeyboardListener = function(opt_keyboardListener) {};


/**
 * Set mouse listener.  Controller is not in charge of {@link MouseListener} lifecycle. It should
 * for example never call dispose on it.
 * @param {org.jboss.core.widget.list.mouse.MouseListener=} opt_mouseListener
 */
org.jboss.core.widget.list.ListController.prototype.setMouseListener = function(opt_mouseListener) {};
