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
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.profile.service.LookUp');

goog.require("org.jboss.core.service.query.QueryService");
goog.require("org.jboss.core.service.query.QueryServiceDispatcher");
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.service.LookUpImpl');

/**
 *
 * @constructor
 * @extends {org.jboss.core.service.LookUpImpl}
 * @final
 */
org.jboss.profile.service.LookUp = function() {
	org.jboss.core.service.LookUpImpl.call(this);

	/**
	 * @type {?org.jboss.core.context.RequestParams}
	 * @private
	 */
	this.requestParams_ = null;

	/**
	 * @type {Object}
	 * @private
	 */
	this.recentQueryResultData_;

};
goog.inherits(org.jboss.profile.service.LookUp, org.jboss.core.service.LookUpImpl);

/**
 * Set the latest JSON response date of user query.
 * @param {Object} json
 */
org.jboss.profile.service.LookUp.prototype.setRecentQueryResultData = function(json) {
	this.recentQueryResultData_ = json;
};

/**
 * Get the latest JSON response date of user query.
 * @return {Object}
 */
org.jboss.profile.service.LookUp.prototype.getRecentQueryResultData = function() {
	return this.recentQueryResultData_;
};

/**
 * @param {org.jboss.core.context.RequestParams} requestParams
 */
org.jboss.profile.service.LookUp.prototype.setRequestParams = function(requestParams) {
	this.requestParams_ = requestParams;
};

/**
 * @return {?org.jboss.core.context.RequestParams}
 */
org.jboss.profile.service.LookUp.prototype.getRequestParams = function() {
	return this.requestParams_;
};