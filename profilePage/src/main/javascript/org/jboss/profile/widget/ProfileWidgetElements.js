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
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.profile.widget.ProfileWidgetElements = function(
	avatar_div, name_div, contributions_div
	) {

	goog.Disposable.call(this);

	/** @type {!HTMLDivElement} */ this.avatar_div = avatar_div;
	/** @type {!HTMLDivElement} */ this.name_div = name_div;
	/** @type {!HTMLDivElement} */ this.contributions_div = contributions_div;
};
goog.inherits(org.jboss.profile.widget.ProfileWidgetElements, goog.Disposable);

/** @inheritDoc */
org.jboss.profile.widget.ProfileWidgetElements.prototype.disposeInternal = function() {
	org.jboss.profile.widget.ProfileWidgetElements.superClass_.disposeInternal.call(this);
	delete this.avatar_div;
	delete this.name_div;
	delete this.contributions_div;
};

/**
 * Object is valid if all the html elements are defined and not null.
 * @return {boolean}
 */
org.jboss.profile.widget.ProfileWidgetElements.prototype.isValid = function() {
	return goog.isDefAndNotNull(this.avatar_div)
		&& goog.isDefAndNotNull(this.name_div)
		&& goog.isDefAndNotNull(this.contributions_div);
};

/** @return {!HTMLDivElement} */
org.jboss.profile.widget.ProfileWidgetElements.prototype.getAvatar_div = function() {
	return this.avatar_div;
};

/** @return {!HTMLDivElement} */
org.jboss.profile.widget.ProfileWidgetElements.prototype.getName_div = function() {
	return this.name_div;
};

/** @return {!HTMLDivElement} */
org.jboss.profile.widget.ProfileWidgetElements.prototype.getContributions_div = function() {
	return this.contributions_div;
};