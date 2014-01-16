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
 * @fileoverview Basic implementation of LookUp interface.  It is assumed that other modules will
 * extend this class and add more services according to their needs.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.core.service.LookUpImpl');

goog.require('org.jboss.core.service.LookUp');
goog.require('goog.History');
goog.require('goog.net.XhrManager');
goog.require('org.jboss.core.util.ImageLoader');
goog.require('org.jboss.core.util.ImageLoaderNoop');

/**
 * LookUp implementation that provides just basic services (XhrManager, History and ImageLoader).
 * Extend this class to add more services.
 * @constructor
 * @implements {org.jboss.core.service.LookUp}
 */
org.jboss.core.service.LookUpImpl = function() {

	/**
	 * @type {goog.net.XhrManager}
	 * @private
	 */
	this.xhrManager_;

	/**
	 * @type {goog.History}
	 * @private
	 */
	this.history_;

	/**
	 * @type {org.jboss.core.util.ImageLoader}
	 * @private
	 */
	this.imageLoader_;
};

/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getXhrManager = function () {
	if (!goog.isDefAndNotNull(this.xhrManager_)) {
		this.xhrManager_ = new goog.net.XhrManager();
	}
	return this.xhrManager_;
};

/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getHistory = function () {
	if (!goog.isDefAndNotNull(this.history_)) {
		this.history_ = new goog.History();
	}
	return this.history_;
};

/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.getImageLoader = function () {
	if (!goog.isDefAndNotNull(this.imageLoader_)) {
		this.imageLoader_ = new org.jboss.core.util.ImageLoaderNoop();
	}
	return this.imageLoader_;
};

/** @inheritDoc */
org.jboss.core.service.LookUpImpl.prototype.setImageLoader = function (imageLoader) {
	// TODO: make sure to dispose all resources kept by imageLoader_ if it is already set.
	this.imageLoader_ = imageLoader;
};