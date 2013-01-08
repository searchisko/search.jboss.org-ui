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
 * @fileoverview 'POJO' for all HTML elements that are required by the SearchPage.
 * The idea is that this object is passed into SearchPage constructor instead of listing
 * all the elements in the SearchPage constructor parameters.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.SearchPageElements');

goog.require('goog.Disposable');

/**
 * Constructor. All parameters are mandatory.
 * @param {!HTMLInputElement} query_field
 * @param {!HTMLDivElement}   spinner_div
 * @param {!HTMLDivElement}   clear_query_div
 * @param {!HTMLDivElement}   query_suggestions_div
 * @param {!HTMLDivElement}   date_filter_tab_div
 * @param {!HTMLDivElement}   project_filter_tab_div
 * @param {!HTMLDivElement}   author_filter_tab_div
 * @param {!HTMLDivElement}   date_filter_body_div
 * @param {!HTMLDivElement}   project_filter_body_div
 * @param {!HTMLDivElement}   author_filter_body_div
 * @param {!HTMLInputElement} project_filter_query_field
 * @param {!HTMLInputElement} author_filter_query_field
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.page.SearchPageElements = function(
    query_field, spinner_div, clear_query_div, query_suggestions_div,
    date_filter_tab_div, project_filter_tab_div, author_filter_tab_div,
    date_filter_body_div, project_filter_body_div, author_filter_body_div,
    project_filter_query_field, author_filter_query_field
    ) {

    goog.Disposable.call(this);

    /** @type {!HTMLInputElement} */ this.query_field = query_field;
    /** @type {!HTMLDivElement}   */ this.spinner_div = spinner_div;
    /** @type {!HTMLDivElement}   */ this.clear_query_div = clear_query_div;
    /** @type {!HTMLDivElement}   */ this.query_suggestions_div = query_suggestions_div;
    /** @type {!HTMLDivElement}   */ this.date_filter_tab_div = date_filter_tab_div;
    /** @type {!HTMLDivElement}   */ this.project_filter_tab_div = project_filter_tab_div;
    /** @type {!HTMLDivElement}   */ this.author_filter_tab_div = author_filter_tab_div;
    /** @type {!HTMLDivElement}   */ this.date_filter_body_div = date_filter_body_div;
    /** @type {!HTMLDivElement}   */ this.project_filter_body_div = project_filter_body_div;
    /** @type {!HTMLDivElement}   */ this.author_filter_body_div = author_filter_body_div;
    /** @type {!HTMLInputElement} */ this.project_filter_query_field = project_filter_query_field;
    /** @type {!HTMLInputElement} */ this.author_filter_query_field = author_filter_query_field;

}
goog.inherits(org.jboss.search.page.SearchPageElements, goog.Disposable);

/** @inheritDoc */
org.jboss.search.page.SearchPageElements.prototype.disposeInternal = function() {
    delete this.query_field;
    delete this.spinner_div;
    delete this.clear_query_div;
    delete this.query_suggestions_div;
    delete this.date_filter_tab_div;
    delete this.project_filter_tab_div;
    delete this.author_filter_tab_div;
    delete this.date_filter_body_div;
    delete this.project_filter_body_div;
    delete this.author_filter_body_div;
    delete this.project_filter_query_field;
    delete this.author_filter_query_field;
};

/**
 * Object is valid if all the html elements are defined and not null.
 * @return {boolean}
 */
org.jboss.search.page.SearchPageElements.prototype.isValid = function() {
    return goog.isDefAndNotNull(this.query_field)
        && goog.isDefAndNotNull(this.spinner_div)
        && goog.isDefAndNotNull(this.clear_query_div)
        && goog.isDefAndNotNull(this.query_suggestions_div)
        && goog.isDefAndNotNull(this.date_filter_tab_div)
        && goog.isDefAndNotNull(this.project_filter_tab_div)
        && goog.isDefAndNotNull(this.author_filter_tab_div)
        && goog.isDefAndNotNull(this.date_filter_body_div)
        && goog.isDefAndNotNull(this.project_filter_body_div)
        && goog.isDefAndNotNull(this.author_filter_body_div)
        && goog.isDefAndNotNull(this.project_filter_query_field)
        && goog.isDefAndNotNull(this.author_filter_query_field)
};

/** @return {!HTMLInputElement} */
org.jboss.search.page.SearchPageElements.prototype.getQuery_field = function() {
    return this.query_field;
};

/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getSpinner_div = function() {
    return this.spinner_div;
};

/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getClear_query_div = function() {
    return this.clear_query_div;
};

/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getQuery_suggestions_div = function() {
    return this.query_suggestions_div;
};

/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getDate_filter_tab_div = function() {
    return this.date_filter_tab_div;
};

/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getProject_filter_tab_div = function() {
    return this.project_filter_tab_div;
};

/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getAuthor_filter_tab_div = function() {
    return this.author_filter_tab_div;
};

/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getDate_filter_body_div = function() {
    return this.date_filter_body_div;
};

/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getProject_filter_body_div = function() {
    return this.project_filter_body_div;
};

/** @return {!HTMLDivElement} */
org.jboss.search.page.SearchPageElements.prototype.getAuthor_filter_body_div = function() {
    return this.author_filter_body_div;
};

/** @return {!HTMLInputElement} */
org.jboss.search.page.SearchPageElements.prototype.getProject_filter_query_field = function() {
    return this.project_filter_query_field;
};

/** @return {!HTMLInputElement} */
org.jboss.search.page.SearchPageElements.prototype.getAuthor_filter_query_field = function() {
    return this.author_filter_query_field;
};