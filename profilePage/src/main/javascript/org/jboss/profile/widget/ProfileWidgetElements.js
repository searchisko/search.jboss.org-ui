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
 * @fileoverview 'POJO' for all HTML elements that are required by the ProfileWidget.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.profile.widget.ProfileWidgetElements');

goog.require('goog.Disposable');

/**
 * @param {!HTMLDivElement}   avatar_div
 * @param {!HTMLDivElement}   name_div
 * @param {!HTMLDivElement}   contributions_div
 * @param {!HTMLDivElement}   top_collaborators_div
 * @param {!HTMLDivElement}   top_projects_div
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.profile.widget.ProfileWidgetElements = function(
	avatar_div, name_div, contributions_div,
	top_collaborators_div, top_projects_div
	) {

	goog.Disposable.call(this);

	/**
	 * @type {!HTMLDivElement}
	 * @private
	 */
	this.avatar_div_ = avatar_div;

	/**
	 * @type {!HTMLDivElement}
	 * @private
	 */
	this.name_div_ = name_div;

	/**
	 * @type {!HTMLDivElement}
	 * @private
	 */
	this.contributions_div_ = contributions_div;

	/**
	 * @type {!HTMLDivElement}
	 * @private
	 */
	this.top_collaborators_div_ = top_collaborators_div;

	/**
	 * @type {!HTMLDivElement}
	 * @private
	 */
	this.top_projects_div_ = top_projects_div;
};
goog.inherits(org.jboss.profile.widget.ProfileWidgetElements, goog.Disposable);

/** @inheritDoc */
org.jboss.profile.widget.ProfileWidgetElements.prototype.disposeInternal = function() {
	org.jboss.profile.widget.ProfileWidgetElements.superClass_.disposeInternal.call(this);
	delete this.avatar_div_;
	delete this.name_div_;
	delete this.contributions_div_;
	delete this.top_collaborators_div_;
	delete this.top_projects_div_;
};

/**
 * Object is valid if all the html elements are defined and not null.
 * @return {boolean}
 */
org.jboss.profile.widget.ProfileWidgetElements.prototype.isValid = function() {
	return goog.isDefAndNotNull(this.avatar_div_)
		&& goog.isDefAndNotNull(this.name_div_)
		&& goog.isDefAndNotNull(this.contributions_div_)
		&& goog.isDefAndNotNull(this.top_collaborators_div_)
		&& goog.isDefAndNotNull(this.top_projects_div_);
};

/** @return {!HTMLDivElement} */
org.jboss.profile.widget.ProfileWidgetElements.prototype.getAvatar_div = function() {
	return this.avatar_div_;
};

/** @return {!HTMLDivElement} */
org.jboss.profile.widget.ProfileWidgetElements.prototype.getName_div = function() {
	return this.name_div_;
};

/** @return {!HTMLDivElement} */
org.jboss.profile.widget.ProfileWidgetElements.prototype.getContributions_div = function() {
	return this.contributions_div_;
};

/** @return {!HTMLDivElement} */
org.jboss.profile.widget.ProfileWidgetElements.prototype.getTop_collaborators_div = function() {
	return this.top_collaborators_div_;
};

/** @return {!HTMLDivElement} */
org.jboss.profile.widget.ProfileWidgetElements.prototype.getTop_projects_div = function() {
	return this.top_projects_div_;
};