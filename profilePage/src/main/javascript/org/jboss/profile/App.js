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

goog.require("goog.array");
goog.require("org.jboss.core.service.query.QueryServiceEventType");
goog.require("org.jboss.profile.Constants");
goog.require('goog.Disposable');
goog.require('goog.History');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.history.EventType');
goog.require('goog.string');
goog.require("org.jboss.core.service.query.QueryServiceEvent");
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.context.RequestParamsFactory');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.util.emailName');
goog.require('org.jboss.core.util.fragmentGenerator');
goog.require('org.jboss.core.util.fragmentParser');
goog.require('org.jboss.core.util.gravatar');
goog.require('org.jboss.profile.service.query.QueryServiceXHR');
goog.require('org.jboss.profile.widget.ProfileWidget');
goog.require('org.jboss.profile.widget.ProfileWidgetElements');

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

	var avatar_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('avatar_container'));
	var name_div   = /** @type {!HTMLDivElement} */ (goog.dom.getElement('name_container'));
	var contributions_div     = /** @type {!HTMLDivElement} */ (goog.dom.getElement('contributions_chart'));
	var top_collaborators_div = /** @type {!HTMLDivElement} */ (goog.dom.getElement('top_collaborators'));
	var top_projects_div      = /** @type {!HTMLDivElement} */ (goog.dom.getElement('top_projects'));

	// ================================================================
	// Define internal variables and objects
	// ================================================================

	this.widgetElements_ = new org.jboss.profile.widget.ProfileWidgetElements(
		avatar_div, name_div, contributions_div,
		top_collaborators_div, top_projects_div
	);

	if (!this.widgetElements_.isValid()) {
		throw new Error('Missing some HTML elements!');
	}

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

	var widgetContext = goog.getObjectByName('document');
	this.profileWidget_ = new org.jboss.profile.widget.ProfileWidget(widgetContext, this.widgetElements_);

	// ...

	// navigation controller
	var navigationController = goog.bind(function (e) {
		// e.isNavigate (true if value in browser address bar is changed manually)
		/** @type {org.jboss.core.context.RequestParams} */
		var requestParams = org.jboss.core.util.fragmentParser.parse(e.token);
		var contributor = requestParams.getContributors().length > 0 ? requestParams.getContributors()[0] : "";
		if (!goog.string.isEmptySafe(contributor)) {
			var sanitizedParams = org.jboss.core.context.RequestParamsFactory.getInstance()
				.reset().setQueryString('sys_contributors:"'+contributor+'"').setContributors([contributor]).build();
			lookup_.getQueryService().userQuery(sanitizedParams);

			// update contributor info in DOM
			this.profileWidget_.setContributorName(org.jboss.core.util.emailName.extractNameFromMail(contributor));
			this.profileWidget_.setAvatarImage(org.jboss.core.util.gravatar.gravatarURI(contributor, org.jboss.profile.Constants.AVATAR_HEIGHT));
		}
	}, this);

	// activate URL History manager
	this.historyListenerId_ = goog.events.listen(history_, goog.history.EventType.NAVIGATE, navigationController);
	history_.setEnabled(true);

	this.contributorDataAvailableId_ = goog.events.listen(
		lookup_.getQueryServiceDispatcher(),
		[
			org.jboss.core.service.query.QueryServiceEventType.SEARCH_SUCCEEDED
		],
		function(e) {
			var event = /** @type {org.jboss.core.service.query.QueryServiceEvent} */ (e);

			// TODO: quick and ugly code (re-implement correctly going forward)
			try {
				var facets = event.getMetadata()['facets'];
//				console.log(facets);
				// update histogram
				var interval = event.getMetadata()['activity_dates_histogram_interval'];
				this.profileWidget_.updateContributionsHistogramChart(facets['activity_dates_histogram']['entries'], interval);

				// contributors
				var contributors = /** @type {Array} */ (facets['top_contributors']['terms']);
				goog.array.forEach (contributors, function(c){
					var id = c['term'];
					var name = org.jboss.core.util.emailName.extractNameFromMail(id).valueOf();
					var gravatarURL16 = org.jboss.core.util.gravatar.gravatarURI_Memo(id,16).valueOf();
					c['gURL16'] = gravatarURL16;
					c['name'] = name;
				});
				this.renderTopContributors_(contributors);

				// projects
				var projects = /** @type {Array} */ (facets['per_project_counts']['terms']);
				this.renderTopProjects_(projects);
			} catch (err) {
//				console.log(err);
			}

		}, false, this
	);

};
goog.inherits(org.jboss.profile.App, goog.Disposable);

/** @inheritDoc */
org.jboss.profile.App.prototype.disposeInternal = function() {

	// Call the superclass's disposeInternal() method.
	org.jboss.profile.App.superClass_.disposeInternal.call(this);

	// dispose Locator (does not implement Disposable API)
	org.jboss.core.service.Locator.dispose();

	// Dispose of all Disposable objects owned by this class.
	goog.dispose(this.widgetElements_);
	goog.dispose(this.profileWidget_);

	// Remove listeners added by this class
	goog.events.unlistenByKey(this.historyListenerId_);
	goog.events.unlistenByKey(this.contributorDataAvailableId_);
	goog.events.unlistenByKey(this.unloadId_);

	// Remove references to COM objects.
	// Remove references to DOM nodes, which are COM objects in IE.
};

/**
 * TODO: remove
 * @param {Array} data
 * @private
 */
org.jboss.profile.App.prototype.renderTopContributors_ = function(data) {
//	console.log(data);
	goog.dom.removeChildren(this.widgetElements_.getTop_collaborators_div());
	goog.array.forEach(data, function(c, i){
		if (i > 30) return;
		var div = goog.dom.createDom("div");
		goog.dom.appendChild(div, goog.dom.createDom("img", { "class": "avatar", "src": c.gURL16 }));
		goog.dom.appendChild(div, goog.dom.createTextNode(c.name + " ("+ c.count+")"));
		goog.dom.appendChild(
			this.widgetElements_.getTop_collaborators_div(),
			div
		)
	}, this);
};

/**
 * TODO: remove
 * @param {Array} data
 * @private
 */
org.jboss.profile.App.prototype.renderTopProjects_ = function(data) {
//	console.log(data);
	goog.dom.removeChildren(this.widgetElements_.getTop_projects_div());
	goog.array.forEach(data, function(p){
		var div = goog.dom.createDom("div");
		goog.dom.appendChild(div, goog.dom.createTextNode(p['term'] /*+ " ("+ p.count+")"*/));
		goog.dom.appendChild(
			this.widgetElements_.getTop_projects_div(),
			div
		)
	}, this);
};