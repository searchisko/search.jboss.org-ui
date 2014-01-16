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
 *  @fileoverview Object represents the main search page.
 *  @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.page.SearchPage');

goog.require('org.jboss.search.LookUp');
goog.require('org.jboss.search.context.RequestParams');
goog.require('org.jboss.search.util.urlGenerator');
goog.require('org.jboss.search.request');
goog.require('org.jboss.search.response');
goog.require('org.jboss.search.page.templates');
goog.require('org.jboss.search.page.SearchPageElements');
goog.require('org.jboss.search.page.UserIdle');
goog.require('org.jboss.search.Variables');
goog.require('org.jboss.search.Constants');
goog.require('org.jboss.search.page.element.SearchFieldHandler');
goog.require('org.jboss.search.suggestions.query.view.View');
goog.require('org.jboss.search.suggestions.event.EventType');
goog.require('org.jboss.search.page.event.QuerySubmitted');
goog.require('org.jboss.search.service.QueryServiceEventType');
goog.require('org.jboss.search.visualization.HistogramEventType');
goog.require('org.jboss.search.page.filter.DateFilterEventType');

goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.events.EventTarget');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.Uri');

goog.require('goog.debug.Logger');

/**
 * @param {EventTarget|goog.events.EventTarget} context element to catch click events and control behaviour of the UI. Typically, this is the document.
 * @param {!org.jboss.search.page.SearchPageElements} elements HTML elements required by the search page
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.SearchPage = function(context, elements) {

    goog.events.EventTarget.call(this);

    var thiz_ = this;

    /** @private */ this.log_ = goog.debug.Logger.getLogger('org.jboss.search.page.SearchPage');

    /**
     * @private
     * @type {org.jboss.search.page.SearchPageElements} */
    this.elements_ = elements;

    /**
     * @private
     * @type {!goog.net.XhrManager} */
    this.xhrManager_ = org.jboss.search.LookUp.getInstance().getXhrManager();

    /** @private */ this.context = context;

    /** @private */ this.query_suggestions_view_ = new org.jboss.search.suggestions.query.view.View(this.elements_.getQuery_suggestions_div());
    /** @private */ this.query_suggestions_model = {};

    /**
     * @type {!org.jboss.search.service.QueryServiceDispatcher}
     * @private
     */
    this.queryServiceDispatcher_ = org.jboss.search.LookUp.getInstance().getQueryServiceDispatcher();

    /**
     * Listener ID, this listener handles events for user query (the query based on text from main search field).
     * @type {goog.events.Key}
     * @private
     */
    this.userQueryServiceDispatcherListenerId_ = goog.events.listen(
        this.queryServiceDispatcher_,
        [
            org.jboss.search.service.QueryServiceEventType.NEW_REQUEST_PARAMETERS,
            org.jboss.search.service.QueryServiceEventType.SEARCH_START,
            org.jboss.search.service.QueryServiceEventType.SEARCH_ABORTED,
            org.jboss.search.service.QueryServiceEventType.SEARCH_FINISHED,
            org.jboss.search.service.QueryServiceEventType.SEARCH_SUCCEEDED,
            org.jboss.search.service.QueryServiceEventType.SEARCH_ERROR
        ],
        goog.bind(function(e) {
            var event = /** @type {org.jboss.search.service.QueryServiceEvent} */ (e);
            switch (event.getType())
            {
                case org.jboss.search.service.QueryServiceEventType.NEW_REQUEST_PARAMETERS:
                    var requestParams = /** @type {org.jboss.search.context.RequestParams} */ (event.getMetadata());
                    org.jboss.search.LookUp.getInstance().setRequestParams(requestParams);
                    break;

				/*
					As soon as user query is started we update couple of HTML elements:
					 - user query field
					 - date filter: from date field
					 - date filter: to date field
					 - date filter: order box
				 */
                case org.jboss.search.service.QueryServiceEventType.SEARCH_START:
                    var metadata_ = event.getMetadata();
                    /** @type {org.jboss.search.context.RequestParams} */
                    var requestParams_ = metadata_["requestParams"];
                    this.log_.info("Search request for ["+requestParams_.getQueryString()+"] started. URL: ["+metadata_["url"]+"]");
                    this.setUserQuery_(requestParams_.getQueryString());
                    this.disableSearchResults_();
                    // update date filter fields in date filter
                    var filter = org.jboss.search.LookUp.getInstance().getDateFilter();
                    if (goog.isDefAndNotNull(filter)) {
						var from_ = requestParams_.getFrom();
						var to_ = requestParams_.getTo();
						filter.setFromValue(goog.isDefAndNotNull(from_) ? from_ : null);
						filter.setToValue(goog.isDefAndNotNull(to_) ? to_ : null);
                        filter.setOrder(requestParams_.getOrder());
                    }
                    break;

                case  org.jboss.search.service.QueryServiceEventType.SEARCH_ABORTED:
                    this.log_.fine("Search request aborted");
                    this.enableSearchResults_();
                    break;

                case  org.jboss.search.service.QueryServiceEventType.SEARCH_FINISHED:
                    this.log_.info("Search request finished");
                    this.disposeUserEntertainment_();
                    break;

                case  org.jboss.search.service.QueryServiceEventType.SEARCH_SUCCEEDED:
                    var response = event.getMetadata();
//                    console.log("response > ",response);
                    this.log_.info("Search request succeeded, took " + response["took"] + "ms, uuid [" +response["uuid"] + "]");
                    org.jboss.search.LookUp.getInstance().setRecentQueryResultData(response);
					// render new HTML for search results first
                    this.renderQueryResponse_();
                    this.enableSearchResults_();
					// refresh histogram chart only if filter expanded
					var dateFilter_ = org.jboss.search.LookUp.getInstance().getDateFilter();
					if (goog.isDefAndNotNull(dateFilter_)) { dateFilter_.refreshChart(false) }
					// refresh author filter
					var authorFilter_ = org.jboss.search.LookUp.getInstance().getAuthorFilter();
					if (goog.isDefAndNotNull(authorFilter_)) { authorFilter_.refreshItems(false) }
					// refresh project filter
					var projectFilter_ = org.jboss.search.LookUp.getInstance().getProjectFilter();
					if (goog.isDefAndNotNull(projectFilter_)) { projectFilter_.refreshItems(false) }
                    break;

                case  org.jboss.search.service.QueryServiceEventType.SEARCH_ERROR:
                    this.log_.info("Search request error");
                    org.jboss.search.LookUp.getInstance().setRecentQueryResultData(null);
                    var metadata_ = event.getMetadata();
                    this.renderQueryResponseError_(metadata_["query_string"], metadata_["error"]);
                    this.enableSearchResults_();
                    break;

                default:
                    this.log_.info("Unknown search event type [" + event.getType() + "]");
            }
        }, this)
    );

    /**
     * Listener ID, this listener handles events for user query suggestions.
     * @type {goog.events.Key}
     * @private
     */
    this.userSuggestionsQueryServiceDispatcherListenerId_ = goog.events.listen(
        this.queryServiceDispatcher_,
        [
//            org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_START,
            org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_ABORTED,
//            org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_FINISHED,
            org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_SUCCEEDED,
            org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_ERROR
        ],
        goog.bind(function(e) {
            var event = /** @type {org.jboss.search.service.QueryServiceEvent} */ (e);
            switch (event.getType())
            {
//                case org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_START:
//                    break;

                case org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_ABORTED:
                    this.hideAndCleanSuggestionsElementAndModel_();
                    break;

//                case org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_FINISHED:
//                    break;

                case org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_SUCCEEDED:
                    var response = /** @type {!Object} */ (event.getMetadata());
                    var model = /** @type {!Object} */ (goog.object.get(response, "model", {}));
                    this.query_suggestions_model = this.parseQuerySuggestionsModel_(model);

                    if (goog.object.containsKey(response, "view")) {
                        var view = /** @type {!Object} */ (goog.object.get(response, "view", {}));

                        this.query_suggestions_view_.update(view);
                        this.query_suggestions_view_.show();

                    } else {
                        this.hideAndCleanSuggestionsElementAndModel_();
                    }
                    break;

                case org.jboss.search.service.QueryServiceEventType.SEARCH_SUGGESTIONS_ERROR:
                    this.hideAndCleanSuggestionsElementAndModel_();
                    break;

                default:
                    this.log_.info("Unknown search suggestions event type [" + event.getType() + "]");
            }
        }, this)
    );

    /**
     * Listener ID, this listener is invoked when date filter interval is changed.
     * Client needs to remember that this listener can be initiated only after the date filter has been instantiated!
     * @type {goog.events.Key}
     * @private
     */
    this.dateFilterIntervalSelectedId_;

    /**
     * Listener ID, this listener is invoked when date orderBy value is changed.
     * Client needs to remember that this listener can be initiated only after the date filter has been instantiated!
     * @type {goog.events.Key}
     * @private
     */
    this.dateOrderByChangedId_;

	/**
	 * Listener ID, this listener is invoked when selected date range is changed. I.e. FROM or TO or both dates changes.
	 * Client needs to remember that this listener can be initiated only after the date filter has been instantiated!
	 * @type {goog.events.Key}
	 * @private
	 */
	this.dateRangeChangedId_;

    /**
     * @type {goog.events.Key}
     * @private
     */
    this.xhrReadyListenerId_ = goog.events.listen(this.xhrManager_, goog.net.EventType.READY, function(e) {
        thiz_.dispatchEvent(org.jboss.search.suggestions.event.EventType.SEARCH_START);
    });

    /**
     * @type {goog.events.Key}
     * @private
     */
    this.xhrCompleteListenerId_ = goog.events.listen(this.xhrManager_, goog.net.EventType.COMPLETE, function(e) {
        thiz_.dispatchEvent(org.jboss.search.suggestions.event.EventType.SEARCH_FINISH);
    });

    /**
     * @type {goog.events.Key}
     * @private
     */
    this.xhrErrorListenerId_ = goog.events.listen(this.xhrManager_, goog.net.EventType.ERROR, function(e) {
        thiz_.dispatchEvent(org.jboss.search.suggestions.event.EventType.SEARCH_FINISH);
    });

    /**
     * @type {goog.events.Key}
     * @private
     */
    this.xhrAbortListenerId_ = goog.events.listen(this.xhrManager_, goog.net.EventType.ABORT, function(e) {
        thiz_.dispatchEvent(org.jboss.search.suggestions.event.EventType.SEARCH_FINISH);
    });

    this.query_suggestions_view_.setClickCallbackFunction(
        function() {
            var selectedIndex = thiz_.query_suggestions_view_.getSelectedIndex();
            thiz_.hideAndCleanSuggestionsElementAndModel_();
            thiz_.elements_.getQuery_field().focus();

            (function(selectedIndex) {
                // TODO get query_string from model at the selectedIndex position
                thiz_.dispatchEvent(
                    new org.jboss.search.page.event.QuerySubmitted(
                        new org.jboss.search.context.RequestParams("option was selected by pointer (index: "+selectedIndex+")",1)
                    )
                );

            })(selectedIndex);
        }
    );

    var suggestionsCallback = function(query_string) {
        org.jboss.search.LookUp.getInstance()
            .getQueryService()
            .userSuggestionQuery(query_string);
    };

    /**
     * @type {goog.events.Key}
     * @private
     */
    this.dateClickListenerId_ = goog.events.listen(this.elements_.getDate_filter_tab_div(),
        goog.events.EventType.CLICK,
        function() {
            thiz_.isDateFilterExpanded_() ? thiz_.collapseDateFilter_() : thiz_.expandDateFilter_()
        }
    );

    /**
     * @type {goog.events.Key}
     * @private
     */
    this.projectClickListenerId_ = goog.events.listen(this.elements_.getProject_filter_tab_div(),
        goog.events.EventType.CLICK,
        function() {
            thiz_.isProjectFilterExpanded_() ? thiz_.collapseProjectFilter_() : thiz_.expandProjectFilter_()
        }
    );

    /**
     * @type {goog.events.Key}
     * @private
     */
    this.authorClickListenerId_ = goog.events.listen(this.elements_.getAuthor_filter_tab_div(),
        goog.events.EventType.CLICK,
        function() {
            thiz_.isAuthorFilterExpanded_() ? thiz_.collapseAuthorFilter_() : thiz_.expandAuthorFilter_()
        }
    );

	/**
	 * @type {goog.events.Key}
	 * @private
	 */
	this.contentClickListenerId_ = goog.events.listen(this.elements_.getContent_filter_tab_div(),
		goog.events.EventType.CLICK,
		function() {
			thiz_.isContentFilterExpanded_() ? thiz_.collapseContentFilter_() : thiz_.expandContentFilter_()
		}
	);

    /**
     * @type {goog.events.Key}
     * @private
     */
    this.contextClickListenerId_ = goog.events.listen(
        thiz_.context,
        goog.events.EventType.CLICK,
        function(event) {
			var e = /** @type {goog.events.Event} */ (event);
//            thiz_.log_.info("Context clicked: " + goog.debug.expose(e));

            // if search field is clicked then do not hide search suggestions
            if (e.target !== thiz_.elements_.getQuery_field()) {
                thiz_.hideAndCleanSuggestionsElementAndModel_();
            }

            // if date filter (sub)element is clicked do not hide date filter
            if (e.target !== thiz_.elements_.getDate_filter_tab_div() &&
                !goog.dom.contains(thiz_.elements_.getDate_filter_body_div(), /** @type {Node} */ (e.target))) {
                thiz_.collapseDateFilter_();
            }

            // if project filter (sub)element is clicked do not hide project filter
            if (e.target !== thiz_.elements_.getProject_filter_tab_div() &&
                !goog.dom.contains(thiz_.elements_.getProject_filter_body_div(), /** @type {Node} */ (e.target))) {
                thiz_.collapseProjectFilter_();
            }

            // if author filter (sub)element is clicked do not hide author filter
            if (e.target !== thiz_.elements_.getAuthor_filter_tab_div() &&
                !goog.dom.contains(thiz_.elements_.getAuthor_filter_body_div(), /** @type {Node} */ (e.target))) {
                thiz_.collapseAuthorFilter_();
            }

			// if content filter (sub)element is clicked do not hide content filter
			if (e.target !== thiz_.elements_.getContent_filter_tab_div() &&
				!goog.dom.contains(thiz_.elements_.getContent_filter_body_div(), /** @type {Node} */ (e.target))) {
				thiz_.collapseContentFilter_();
			}

        });

    /**
     * This listener can catch events when the user navigates to the query field by other means then clicking,
     * for example by TAB key or by selecting text in the field by cursor (does not fire click event).
     * We want to hide filter tabs in such case.
     * @type {goog.events.Key}
     * @private
     */
    this.query_field_focus_id_ = goog.events.listen(
        this.elements_.getQuery_field(),
        goog.events.EventType.INPUT,
        function(){
            thiz_.collapseAllFilters();
        }
    );

    /** @private */
    this.userQuerySearchField_ = new org.jboss.search.page.element.SearchFieldHandler(
        this.elements_.getQuery_field(),
        100,
        suggestionsCallback,
        null,
        this.getPresetKeyHandlers_()
    );


    /**
     * ID of listener which catches user clicks on top of search results.
     * @type {goog.events.Key}
     * @private
     */
    this.searchResultsClickId_ = goog.events.listen(
        this.elements_.getSearch_results_div(),
        goog.events.EventType.MOUSEUP,
        goog.bind(function(event) {
			var e = /** @type {goog.events.Event} */ (event);
            var element = /** @type {Element} */ (e.target);
            while (element) {
                // user clicked individual search hit, we want to record click-stream
                if (goog.dom.classes.has(element, org.jboss.search.Constants.CLICK_STREAM_CLASS)) {
                    var hitNumber = element.getAttribute(org.jboss.search.Constants.HIT_NUMBER);
                    if (hitNumber) {
                        try { hitNumber = +hitNumber } catch(err) { /* ignore */ }
                        if (goog.isNumber(hitNumber)) {
                            var d = org.jboss.search.LookUp.getInstance().getRecentQueryResultData();
                            var clickedHit = d && d.hits && d.hits.hits && d.hits.hits[hitNumber];
                            if (clickedHit) {
                                var _id = clickedHit._id;
                                var uuid = d.uuid;
                                if (_id && uuid) {
                                    org.jboss.search.request.writeClickStreamStatistics(thiz_.getUserClickStreamUri(), uuid, _id);
                                }
                            }
                        }
                    }
                    break;
                }
                // user clicked pagination, we want to record click-stream and issue a new search request
                if (goog.dom.classes.has(element, org.jboss.search.Constants.PAGINATION_CLASS)) {
                    var pageNumber = element.getAttribute(org.jboss.search.Constants.PAGINATION_NUMBER);
                    if (pageNumber) {
                        try { pageNumber = +pageNumber } catch(err) { /* ignore */ }
                        if (goog.isNumber(pageNumber)) {
                            var rp_ = org.jboss.search.LookUp.getInstance().getRequestParams();
                            rp_ = rp_.mixin(rp_, undefined, /** @type {number} */ (pageNumber));
                            this.dispatchEvent(
                                new org.jboss.search.page.event.QuerySubmitted(rp_)
                            );
                            // TODO: call writeClickStreamStatistics
                        }
                    }
                    break;
                }
                element = goog.dom.getParentElement(element);
            }
        }, this)
    );

    /**
     * ID of listener which catches mouse over events for contributor icons.
     * @type {goog.events.Key}
     * @private
     */
    this.contributorMouseOverId_ = goog.events.listen(
        this.elements_.getSearch_results_div(),
        goog.events.EventType.MOUSEOVER,
        function(event) {
			var e = /** @type {goog.events.Event} */ (event);
            var element = /** @type {Element} */ (e.target);
            while (element) {
                // When mouse is over small contributor avatar then do two things:
                // - change name to selected contributor
                // - change src of large avatar img on the left to search hit
                // (this is one nasty piece of code...)
                if (goog.dom.classes.has(element, org.jboss.search.Constants.CONTRIBUTOR_CLASS)) {
                    var hitNumber = element.getAttribute(org.jboss.search.Constants.HIT_NUMBER);
                    var contributorNumber = element.getAttribute(org.jboss.search.Constants.CONTRIBUTOR_NUMBER);
                    if (hitNumber && contributorNumber) {
                        // we have both values: hit number and contributor number
                        try {hitNumber = +hitNumber } catch(err) { /* ignore */ }
                        try {contributorNumber = +contributorNumber } catch(err) { /* ignore */ }
                        if (goog.isNumber(hitNumber) && goog.isNumber(contributorNumber)) {
                            // both are numbers, good...
                            var d = org.jboss.search.LookUp.getInstance().getRecentQueryResultData();
                            var currentHit = d && d.hits && d.hits.hits && d.hits.hits[hitNumber];
                            if (currentHit && currentHit.fields && currentHit.fields.sys_contributors_view) {
                                var contributor = currentHit.fields.sys_contributors_view[contributorNumber];
                                if (contributor) {
                                    // contributor data found in query response
                                    var contributorListElement = goog.dom.getParentElement(element);
                                    var nameElement = goog.dom.getElementByClass(
                                        "selected_contributor_name",
                                        contributorListElement
                                    );
                                    if (nameElement) {
                                        // Element holding the name of contributor found
                                        var valueElement = goog.dom.getElementByClass("value", nameElement);
                                        if (valueElement && valueElement != contributor.name) {
                                            goog.dom.setTextContent(
                                                valueElement,
                                                contributor.name
                                            );
                                        }
                                    }
                                    var hitElement = goog.dom.getParentElement(
                                        goog.dom.getParentElement(contributorListElement)
                                    );
                                    if (hitElement) {
                                        var leftElement = goog.dom.getElementByClass("left", hitElement);
                                        if (leftElement) {
                                            var avatarElement = goog.dom.getElementByClass("avatar", leftElement);
                                            if (avatarElement) {
                                                var avatarImg = goog.dom.getFirstElementChild(avatarElement);
                                                if (avatarImg) {
                                                    // img Element holding contributor large avatar found
                                                    var currentSRC = avatarImg.getAttribute("src");
                                                    if (currentSRC && currentSRC != contributor.gURL40) {
                                                        avatarImg.setAttribute("src", contributor.gURL40);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
                element = goog.dom.getParentElement(element);
            }
        }
    );

    /** @private */
    this.userIdle_ = new org.jboss.search.page.UserIdle(this.elements_.getSearch_results_div());

    /** @private */
    this.userIdleDelay_ = new goog.async.Delay(
        goog.bind(this.userIdle_.start,this.userIdle_),
        org.jboss.search.Variables.USER_IDLE_INTERVAL
    );

    this.userIdleDelay_.start();

};
goog.inherits(org.jboss.search.page.SearchPage, goog.events.EventTarget);

/** @inheritDoc */
org.jboss.search.page.SearchPage.prototype.disposeInternal = function() {

    // Call the superclass's disposeInternal() method.
    org.jboss.search.page.SearchPage.superClass_.disposeInternal.call(this);

    // Dispose of all Disposable objects owned by this class.
    goog.dispose(this.elements_);
    goog.dispose(this.userQuerySearchField_);
    goog.dispose(this.query_suggestions_view_);
    goog.dispose(this.userIdle_);
    goog.dispose(this.userIdleDelay_);

    // Remove listeners added by this class.
    goog.events.unlistenByKey(this.dateClickListenerId_);
    goog.events.unlistenByKey(this.projectClickListenerId_);
    goog.events.unlistenByKey(this.authorClickListenerId_);
    goog.events.unlistenByKey(this.contentClickListenerId_);
    goog.events.unlistenByKey(this.contextClickListenerId_);
    goog.events.unlistenByKey(this.xhrReadyListenerId_);
    goog.events.unlistenByKey(this.xhrCompleteListenerId_);
    goog.events.unlistenByKey(this.xhrErrorListenerId_);
    goog.events.unlistenByKey(this.xhrAbortListenerId_);
    goog.events.unlistenByKey(this.query_field_focus_id_);
    goog.events.unlistenByKey(this.searchResultsClickId_);
    goog.events.unlistenByKey(this.contributorMouseOverId_);
    goog.events.unlistenByKey(this.userQueryServiceDispatcherListenerId_);
    goog.events.unlistenByKey(this.userSuggestionsQueryServiceDispatcherListenerId_);

    // initiated later, thus we have to check first
    if (goog.isDefAndNotNull(this.dateFilterIntervalSelectedId_)) {
        goog.events.unlistenByKey(this.dateFilterIntervalSelectedId_);
    }
    if (goog.isDefAndNotNull(this.dateOrderByChangedId_)) {
        goog.events.unlistenByKey(this.dateOrderByChangedId_);
    }
	if (goog.isDefAndNotNull(this.dateRangeChangedId_)) {
		goog.events.unlistenByKey(this.dateRangeChangedId_);
	}

    // Remove references to COM objects.

    // Remove references to DOM nodes, which are COM objects in IE.
    this.log_ = null;
    delete this.xhrManager_;
    this.context = null;
    this.query_suggestions_model = null;
    delete this.queryServiceDispatcher_;
};

/**
 * @return {goog.Uri} Search Suggestions Service URI
 */
org.jboss.search.page.SearchPage.prototype.getSuggestionsUri = function() {
    return this.SUGGESTIONS_URI_.clone();
};

/**
 * @return {goog.Uri} Query Search Service URI
 */
org.jboss.search.page.SearchPage.prototype.getSearchUri = function() {
    return this.SEARCH_URI_.clone();
};

/**
 * @return {goog.Uri} URI of service to record user click stream.
 */
org.jboss.search.page.SearchPage.prototype.getUserClickStreamUri = function() {
    return this.USER_CLICK_STREAM_URI_.clone();
};

/**
 *
 * @param {org.jboss.search.page.filter.DateFilter} dateFilter
 */
org.jboss.search.page.SearchPage.prototype.registerListenerOnDateFilterChanges = function(dateFilter) {
    // unlisten if already registered
    if (goog.isDefAndNotNull(this.dateFilterIntervalSelectedId_)) {
        goog.events.unlistenByKey(this.dateFilterIntervalSelectedId_);
    }
    if (goog.isDefAndNotNull(this.dateOrderByChangedId_)) {
        goog.events.unlistenByKey(this.dateOrderByChangedId_);
    }

    if (goog.isDefAndNotNull(dateFilter)) {

        // register listener on date filter interval changes caused by histogram chart brush
        if (goog.isDefAndNotNull(dateFilter.getHistogramChart())) {
            this.dateFilterIntervalSelectedId_ = goog.events.listen(
                dateFilter.getHistogramChart(),
                org.jboss.search.visualization.HistogramEventType.INTERVAL_SELECTED,
                goog.bind(function(e) {
                    var event = /** @type {org.jboss.search.visualization.IntervalSelected} */ (e);
                    // update dates in the web form
                    dateFilter.setFromValue(event.getFrom());
                    dateFilter.setToValue(event.getTo());
                    // if last, then fire an event
                    if (event.isLast()) {
                        var rp = org.jboss.search.LookUp.getInstance().getRequestParams();
                        if (goog.isDefAndNotNull(rp)) {
                            // TODO: consider rounding 'from' and 'to' to hours or days (for monthly granular chart it makes little sense to use minutes...)
                            // set 'page' to 1
                            rp = rp.mixin(rp, undefined, 1, event.getFrom(), event.getTo());
                            this.dispatchEvent(
                                new org.jboss.search.page.event.QuerySubmitted(rp)
                            );
                        }
                    }
                }, this)
            );
        }

        // register listener on date orderBy changes
        this.dateOrderByChangedId_ = goog.events.listen(
            dateFilter,
            org.jboss.search.page.filter.DateFilterEventType.DATE_ORDER_BY_CHANGED,
            goog.bind(function(e){
                var event = /** @type {org.jboss.search.page.filter.DateOrderByChanged} */ (e);
                var orderBy = event.getOrderBy();
                if (goog.isDefAndNotNull(orderBy)) {
                    var rp = org.jboss.search.LookUp.getInstance().getRequestParams();
                    if (goog.isDefAndNotNull(rp)) {
                        rp = rp.mixin(rp, undefined, undefined, undefined, undefined, orderBy);
                        this.dispatchEvent(
                            new org.jboss.search.page.event.QuerySubmitted(rp)
                        );
                    }
                }
            }, this)
        );

		// register listener on date range changes caused by manual date selection
		this.dateRangeChangedId_ = goog.events.listen(
			dateFilter,
			org.jboss.search.page.filter.DateFilterEventType.DATE_RANGE_CHANGED,
			goog.bind(function(e){
				var event = /** @type {org.jboss.search.page.filter.DateRangeChanged} */ (e);
				var from = event.getFrom();
				var to = event.getTo();
				if (goog.isDef(from) || goog.isDef(to)) {
					var rp = org.jboss.search.LookUp.getInstance().getRequestParams();
					if (goog.isDefAndNotNull(rp)) {
						rp = rp.mixin(rp, undefined, undefined, from, to);
						this.dispatchEvent(
							new org.jboss.search.page.event.QuerySubmitted(rp)
						);
					}
				}
			}, this)
		);
    }
};

/**
 * Set user query and execute the query.
 * @param {!org.jboss.search.context.RequestParams} requestParams
 */
org.jboss.search.page.SearchPage.prototype.runSearch = function(requestParams) {
    var queryService = org.jboss.search.LookUp.getInstance().getQueryService();
    queryService.userQuery(requestParams);
};

/**
 * Render HTML representation of search results.
 * It assumes the search results are stored in the lookup.
 * @private
 */
org.jboss.search.page.SearchPage.prototype.renderQueryResponse_ = function() {
    var normalizedResponse = org.jboss.search.LookUp.getInstance().getRecentQueryResultData();
    try {
        // generate HTML for search results
        var html = org.jboss.search.page.templates.search_results(normalizedResponse);
        this.elements_.getSearch_results_div().innerHTML = html;
        // pre-load avatar images
        this.preLoadAvatarImages_(normalizedResponse);
    } catch(error) {
        // Something went wrong when generating search results
        // TODO fire event (with error)
        this.log_.severe("Something went wrong",error);
    }
};

/**
 *
 * @private
 */
org.jboss.search.page.SearchPage.prototype.renderQueryResponseError_ = function(query_string, error) {
    var html = org.jboss.search.page.templates.request_error({
        'user_query': query_string,
        'error': error
    });
    this.elements_.getSearch_results_div().innerHTML = html;
};

/**
 * Clear (remove) all search results from the screen.
 */
org.jboss.search.page.SearchPage.prototype.clearSearchResults = function() {
    // TODO: check if we need stop any listeners
    this.elements_.getSearch_results_div().innerHTML = '';
};

/**
 * Collapse all filter tabs.
 * @private
 */
org.jboss.search.page.SearchPage.prototype.collapseAllFilters = function() {
    if (this.isAuthorFilterExpanded_()) this.collapseAuthorFilter_();
    if (this.isProjectFilterExpanded_()) this.collapseProjectFilter_();
    if (this.isDateFilterExpanded_()) this.collapseDateFilter_();
};

/**
 * Prototype URI
 * @private
 * @type {goog.Uri}
 * @const
 */
org.jboss.search.page.SearchPage.prototype.SUGGESTIONS_URI_ = goog.Uri.parse(org.jboss.search.Constants.API_URL_SUGGESTIONS_QUERY);

/**
 * Prototype URI
 * @private
 * @type {goog.Uri}
 * @const
 */
org.jboss.search.page.SearchPage.prototype.SEARCH_URI_ = goog.Uri.parse(org.jboss.search.Constants.API_URL_SEARCH_QUERY);

/**
 * Prototype URI
 * @private
 * @type {goog.Uri}
 * @const
 */
org.jboss.search.page.SearchPage.prototype.USER_CLICK_STREAM_URI_ = goog.Uri.parse(org.jboss.search.Constants.API_URL_RECORD_USER_CLICK_STREAM);

/**
 * Set value of query field.
 * @param {?string} query
 * @private
 */
org.jboss.search.page.SearchPage.prototype.setUserQuery_ = function(query) {
    var newValue = "";
    if (!goog.string.isEmptySafe(query)) {
        newValue = query.trim();
    }
    this.elements_.getQuery_field().value = newValue;
};

/**
 * Stop and release (dispose) all resources related to user entertainment.
 * @private
 */
org.jboss.search.page.SearchPage.prototype.disposeUserEntertainment_ = function() {
    this.userIdleDelay_.stop();
    goog.dispose(this.userIdle_);
};

/** @private */
org.jboss.search.page.SearchPage.prototype.disableSearchResults_ = function () {
    goog.dom.classes.add(this.elements_.getSearch_results_div(), org.jboss.search.Constants.DISABLED);
};

/** @private */
org.jboss.search.page.SearchPage.prototype.enableSearchResults_ = function () {
    goog.dom.classes.remove(this.elements_.getSearch_results_div(), org.jboss.search.Constants.DISABLED);
};

/**
 * @return {!Object.<(goog.events.KeyCodes|number), function(goog.events.KeyEvent, goog.async.Delay)>}
 * @private
 */
org.jboss.search.page.SearchPage.prototype.getPresetKeyHandlers_ = function() {

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeEscHandler = goog.bind(function(event, delay) {
        if (!event.repeat) {
            delay.stop();
            this.hideAndCleanSuggestionsElementAndModel_();
        }
    }, this);

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeDownHandler = goog.bind(function(event, delay) {
        event.preventDefault();
        if (this.query_suggestions_view_.isVisible()) {
            this.query_suggestions_view_.selectNext();
        }
    }, this);

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeUpHandler = goog.bind(function(event, delay) {
        event.preventDefault();
        if (this.query_suggestions_view_.isVisible()) {
            this.query_suggestions_view_.selectPrevious();
        }
    }, this);

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeRightHandler = function(event, delay) {
        // will do something later...
    };

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeTabHandler = goog.bind(function(event, delay) {
        delay.stop();
        this.hideAndCleanSuggestionsElementAndModel_();
    }, this);

    /**
     * @param {goog.events.KeyEvent} event
     * @param {goog.async.Delay} delay
     */
    var keyCodeEnterHandler = goog.bind(function(event, delay) {
        var selectedIndex = this.query_suggestions_view_.getSelectedIndex();
        this.hideAndCleanSuggestionsElementAndModel_();
        event.preventDefault();
        delay.stop();
        if (selectedIndex < 0) {
            // user hit enter and no suggestions are displayed (yet) use content of query field
            var query = this.elements_.getQuery_field().value;
            this.dispatchEvent(
                new org.jboss.search.page.event.QuerySubmitted(
                    new org.jboss.search.context.RequestParams(query,1)
                )
            );
        } else if (selectedIndex == 0) {
            // suggestions are displayed, user selected the first one (use what is in query field)
            var query = this.elements_.getQuery_field().value;
            this.dispatchEvent(
                new org.jboss.search.page.event.QuerySubmitted(
                    new org.jboss.search.context.RequestParams(query,1)
                )
            );
        } else if (selectedIndex > 0) {
            // user selected from suggestions, use what is in model
            // TODO get query_string from model at the selectedIndex position
            this.dispatchEvent(
                new org.jboss.search.page.event.QuerySubmitted(
                    new org.jboss.search.context.RequestParams("option was selected by keys (index: "+selectedIndex+")",1)
                )
            );
        }
    }, this);

    // prepare keyHandlers for the main search field
    var keyHandlers = {};

    keyHandlers[goog.events.KeyCodes.ESC] = keyCodeEscHandler;
    keyHandlers[goog.events.KeyCodes.UP] = keyCodeUpHandler;
    keyHandlers[goog.events.KeyCodes.DOWN] = keyCodeDownHandler;
    keyHandlers[goog.events.KeyCodes.RIGHT] = keyCodeRightHandler;
    keyHandlers[goog.events.KeyCodes.ENTER] = keyCodeEnterHandler;

    // TAB key does not seem to yield true in @see {goog.events.KeyCodes.isTextModifyingKeyEvent}
    // thus we have to handle it
    keyHandlers[goog.events.KeyCodes.TAB] = keyCodeTabHandler;

    return keyHandlers;
};

/**
 * Hide and clean suggestions element and empty the suggestions model.
 * @private
 */
org.jboss.search.page.SearchPage.prototype.hideAndCleanSuggestionsElementAndModel_ = function() {

    this.xhrManager_.abort(org.jboss.search.Constants.SEARCH_SUGGESTIONS_REQUEST_ID, true);
    // abort with 'true' does not fire any event, thus we have to fire our own event
    this.dispatchEvent(org.jboss.search.suggestions.event.EventType.SEARCH_FINISH);

    this.query_suggestions_view_.hide();
    this.query_suggestions_model = {};
};

/**
 * TODO
 * @param {!Object} model
 * @return {!Object}
 * @private
 */
org.jboss.search.page.SearchPage.prototype.parseQuerySuggestionsModel_ = function(model) {
    return model;
};

/**
 * @return {boolean}
 * @private
 */
org.jboss.search.page.SearchPage.prototype.isDateFilterExpanded_ = function () {
    return !goog.dom.classes.has(this.elements_.getDate_filter_body_div(), org.jboss.search.Constants.HIDDEN);
};

/**
 * @return {boolean}
 * @private
 */
org.jboss.search.page.SearchPage.prototype.isProjectFilterExpanded_ = function () {
    return !goog.dom.classes.has(this.elements_.getProject_filter_body_div(), org.jboss.search.Constants.HIDDEN);
};

/**
 * @return {boolean}
 * @private
 */
org.jboss.search.page.SearchPage.prototype.isAuthorFilterExpanded_ = function () {
    return !goog.dom.classes.has(this.elements_.getAuthor_filter_body_div(), org.jboss.search.Constants.HIDDEN);
};

/**
 * @return {boolean}
 * @private
 */
org.jboss.search.page.SearchPage.prototype.isContentFilterExpanded_ = function () {
	return !goog.dom.classes.has(this.elements_.getContent_filter_body_div(), org.jboss.search.Constants.HIDDEN);
};

/** @private */
org.jboss.search.page.SearchPage.prototype.expandDateFilter_ = function () {
    var filter = org.jboss.search.LookUp.getInstance().getDateFilter();
    if (goog.isDefAndNotNull(filter)) {
        filter.expandFilter()
    }
};

/** @private */
org.jboss.search.page.SearchPage.prototype.expandAuthorFilter_ = function () {
    var filter = org.jboss.search.LookUp.getInstance().getAuthorFilter();
    if (goog.isDefAndNotNull(filter)) {
        filter.expandFilter()
    }
};

/** @private */
org.jboss.search.page.SearchPage.prototype.expandContentFilter_ = function () {
	var filter = org.jboss.search.LookUp.getInstance().getContentFilter();
	if (goog.isDefAndNotNull(filter)) {
		filter.expandFilter()
	}
};

/** @private */
org.jboss.search.page.SearchPage.prototype.expandProjectFilter_ = function () {
    var filter = org.jboss.search.LookUp.getInstance().getProjectFilter();
    if (goog.isDefAndNotNull(filter)) {
        filter.expandFilter()
    }
};

/** @private */
org.jboss.search.page.SearchPage.prototype.collapseDateFilter_ = function () {
    var filter = org.jboss.search.LookUp.getInstance().getDateFilter();
    if (goog.isDefAndNotNull(filter)) {
        filter.collapseFilter()
    }
};

/** @private */
org.jboss.search.page.SearchPage.prototype.collapseProjectFilter_ = function () {
    var filter = org.jboss.search.LookUp.getInstance().getProjectFilter();
    if (goog.isDefAndNotNull(filter)) {
        filter.collapseFilter()
    }
};

/** @private */
org.jboss.search.page.SearchPage.prototype.collapseAuthorFilter_ = function () {
    var filter = org.jboss.search.LookUp.getInstance().getAuthorFilter();
    if (goog.isDefAndNotNull(filter)) {
        filter.collapseFilter()
    }
};

/** @private */
org.jboss.search.page.SearchPage.prototype.collapseContentFilter_ = function () {
	var filter = org.jboss.search.LookUp.getInstance().getContentFilter();
	if (goog.isDefAndNotNull(filter)) {
		filter.collapseFilter()
	}
};

/**
 * Pre-load large avatar images of contributors found in the data.
 * <p/>
 * First, it grab all contributors from search results and start pre-loading large
 * 40x40px avatars. This is to ensure that when user mouseover small avatars the large avatar changes instantly without
 * noticeable loading.
 * <p/>
 * Second, it pre-load avatar icons found in the top_contributor facet. This to make sure there is minimal visual
 * distraction when the author filter is opened. Number of avatars pre-loaded is limited
 * by org.jboss.search.Variables.CONTRIBUTOR_FACET_AVATAR_PRELOAD_CNT.
 * @param {Object} data
 * @private
 */
org.jboss.search.page.SearchPage.prototype.preLoadAvatarImages_ = function(data) {
	var imageLoader = org.jboss.search.LookUp.getInstance().getImageLoader();
    if (data && data.hits && data.hits.hits) {
        goog.array.forEach(
            data.hits.hits,
            function(hit) {
                if (hit.fields && hit.fields.sys_contributors_view) {
                    goog.array.forEach(
                        hit.fields.sys_contributors_view,
                        function(c) {
                            if (goog.isString(c.gURL40)) {
                                imageLoader.addImage(c.gURL40, c.gURL40);
                            }
                        }
                    )
                }
            }
        );
        imageLoader.start();
    }
	if (data && data.facets && data.facets.top_contributors && data.facets.top_contributors.terms) {
		var cnt = org.jboss.search.Variables.CONTRIBUTOR_FACET_AVATAR_PRELOAD_CNT;
		// sanity check
		cnt = cnt < 0 ? 0 : cnt;
		goog.array.forEach(
			data.facets.top_contributors.terms,
			function(term) {
				if (cnt > 0 && goog.isString(term.gURL16)) {
					imageLoader.addImage(term.gURL16, term.gURL16);
					cnt -= 1;
				}
			}
		);
		imageLoader.start();
	}
};