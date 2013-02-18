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
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.filter.ProjectFilter');

goog.require('org.jboss.search.page.filter.templates');
goog.require('goog.dom');
goog.require('goog.Disposable');

/**
 * Create a new project filter.
 * It requires an element as a parameter, it assumes there is one element with class='filter_items' found inside.
 * @param {!Element} element to host the project filter
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.filter.ProjectFilter = function(element) {
    goog.Disposable.call(this);
    this.items_div = goog.dom.getElementByClass('filter_items',element);
};
goog.inherits(org.jboss.search.page.filter.ProjectFilter, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.filter.ProjectFilter.prototype.disposeInternal = function() {
    org.jboss.search.page.filter.ProjectFilter.superClass_.disposeInternal.call(this);
    delete this.items_div;
};

/**
 * Populate a new items into the filter. Drops all existing.
 * @param {!Array.<{name: string, code: string}>} items
 */
org.jboss.search.page.filter.ProjectFilter.prototype.replaceItems = function(items) {
    var html = org.jboss.search.page.filter.templates.project_filter_items({ 'items': items });
    this.items_div.innerHTML = html;
};
