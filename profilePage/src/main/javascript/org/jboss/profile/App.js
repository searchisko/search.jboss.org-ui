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
 * @fileoverview Configuration of the profile application.  This class is the only place where
 * we locate HTML elements in the DOM and configure LookUp.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.profile.App');

goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.context.RequestParamsFactory');
goog.require('org.jboss.core.util.fragmentGenerator');
goog.require('org.jboss.core.util.fragmentParser');
goog.require('org.jboss.profile.service.query.QueryServiceXHR');
goog.require('goog.Disposable');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.History');
goog.require('goog.history.EventType');

/**
 * @extends {goog.Disposable}
 * @constructor
 */
org.jboss.profile.App = function() {

	goog.Disposable.call(this);

	// prevent page being cached by browser
	// this ensures JavaScript is executed on browser BACK button
	this.unloadId_ = goog.events.listen(goog.dom.getWindow(), goog.events.EventType.UNLOAD, goog.nullFunction);

	var log = goog.debug.Logger.getLogger('org.jboss.profile.App');
	log.info("Profile App initialization...");

	// ================================================================
	// Configure LookUp instance
	// ================================================================
	var lookup_ = org.jboss.core.service.Locator.getInstance().getLookup();

	// setup production QueryService (cached version)
	lookup_.setQueryService(
//		new org.jboss.search.service.query.QueryServiceCached(
			new org.jboss.profile.service.query.QueryServiceXHR( lookup_.getQueryServiceDispatcher() )
//		)
	);

	// ================================================================
	// Get necessary HTML elements
	// ================================================================

	// ...

	// ================================================================
	// Define internal variables and objects
	// ================================================================

	/** @type {goog.History} */ var history_ = lookup_.getHistory();

	/**
	 * Sets given query string to URL fragment.
	 * Basically, this function is called by the app whenever user selects or input search query.
	 * It changes URL fragment and thus calls navigatorController.
	 *
	 * @param {!org.jboss.core.context.RequestParams} requestParams
	 */
	var urlSetFragmentFunction = function(requestParams) {
		history_.setToken(
			org.jboss.core.util.fragmentGenerator.generate(requestParams,
				org.jboss.core.util.fragmentParser.parse(history_.getToken())
			)
		);
	};

	// ...

	// navigation controller
	var navigationController = goog.bind(function (e) {
		// e.isNavigate (true if value in browser address bar is changed manually)
		/** @type {org.jboss.core.context.RequestParams} */
		var requestParams = org.jboss.core.util.fragmentParser.parse(e.token);
		var contributor = requestParams.getContributors().length > 0 ? requestParams.getContributors()[0] : "";
		if (!goog.string.isEmptySafe(contributor)) {
			var sanitizedParams = org.jboss.core.context.RequestParamsFactory.getInstance().reset().setContributors([contributor]).build();
			lookup_.getQueryService().userQuery(sanitizedParams);
		}
	}, this);

	// activate URL History manager
	this.historyListenerId_ = goog.events.listen(history_, goog.history.EventType.NAVIGATE, navigationController);
	history_.setEnabled(true);

};
goog.inherits(org.jboss.profile.App, goog.Disposable);

/** @inheritDoc */
org.jboss.profile.App.prototype.disposeInternal = function() {

	// Call the superclass's disposeInternal() method.
	org.jboss.profile.App.superClass_.disposeInternal.call(this);

	// dispose Locator (does not implement Disposable API)
	org.jboss.core.service.Locator.dispose();

	// Dispose of all Disposable objects owned by this class.
//	goog.dispose(this.___);

	// Remove listeners added by this class
	goog.events.unlistenByKey(this.historyListenerId_);
	goog.events.unlistenByKey(this.unloadId_);

	// Remove references to COM objects.
	// Remove references to DOM nodes, which are COM objects in IE.
};