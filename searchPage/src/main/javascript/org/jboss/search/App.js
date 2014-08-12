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
 * @fileoverview The main search web application.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.App');

goog.require('goog.Disposable');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.async.Deferred');
goog.require('goog.async.DeferredList');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.Key');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.string');
goog.require('goog.window');
goog.require('org.jboss.core.Constants');
goog.require('org.jboss.core.context.RequestParams');
goog.require('org.jboss.core.context.RequestParams.Order');
goog.require('org.jboss.core.context.RequestParamsFactory');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.service.navigation.NavigationServiceEvent');
goog.require('org.jboss.core.service.navigation.NavigationServiceEventType');
goog.require('org.jboss.core.service.query.QueryServiceEventType');
goog.require('org.jboss.core.util.ImageLoaderNet');
goog.require('org.jboss.core.util.dateTime');
goog.require('org.jboss.core.util.fragmentGenerator');
goog.require('org.jboss.core.util.fragmentParser');
goog.require('org.jboss.core.util.fragmentParser.INTERNAL_param');
goog.require('org.jboss.core.util.fragmentParser.UI_param_suffix');
goog.require('org.jboss.search.Constants');
goog.require('org.jboss.search.Variables');
goog.require('org.jboss.search.list.Project');
goog.require('org.jboss.search.list.Type');
goog.require('org.jboss.search.page.SearchPage');
goog.require('org.jboss.search.page.SearchPageElements');
goog.require('org.jboss.search.page.element.Status');
goog.require('org.jboss.search.page.event.ContributorIdSelected');
goog.require('org.jboss.search.page.event.EventType');
goog.require('org.jboss.search.page.event.QuerySubmitted');
goog.require('org.jboss.search.page.filter.AuthorFilter');
goog.require('org.jboss.search.page.filter.ContentFilter');
goog.require('org.jboss.search.page.filter.DateFilter');
goog.require('org.jboss.search.page.filter.TechnologyFilter');
goog.require('org.jboss.search.service.query.QueryServiceCached');
goog.require('org.jboss.search.service.query.QueryServiceXHR');



/**
 * Constructor of the application for the search page.
 *
 * @param {{
 *    authorElements: !org.jboss.search.page.filter.CommonFilterElements,
 *    technologyElements: !org.jboss.search.page.filter.CommonFilterElements,
 *    contentElements: !org.jboss.search.page.filter.ContentFilterElements,
 *    dateElements: !org.jboss.search.page.filter.DateFilterElements,
 *    searchPageElements: !org.jboss.search.page.SearchPageElements
 * }} params
 * @constructor
 * @extends {goog.Disposable}
 */
org.jboss.search.App = function(params) {
  goog.Disposable.call(this);

  /**
   * Make sure JavaScript is executed on browser BACK button.
   * @type {goog.events.Key}
   * @private
   */
  this.unloadId_ = goog.events.listen(goog.dom.getWindow(), goog.events.EventType.UNLOAD, goog.nullFunction);

  // init Status window (consider doing it earlier)
  var status_window = /** @type {!HTMLDivElement} */ (goog.dom.getElement('status_window'));
  var status = new org.jboss.search.page.element.Status(status_window, 4);
  status.show('Initialization...');

  /**
   * @private
   */
  this.log_ = goog.debug.Logger.getLogger('org.jboss.search.App');
  this.log_.info('Search App initialization...');

  /**
   * @type {!org.jboss.search.service.LookUp}
   * @private
   */
  this.lookup_ = org.jboss.core.service.Locator.getInstance().getLookup();

  /**
   * @param {!org.jboss.core.context.RequestParams} requestParams
   */
  var urlSetFragmentFunction = goog.bind(function(requestParams) {
    var previousParams = this.lookup_.getRequestParams();
    var token = org.jboss.core.util.fragmentGenerator.generate(requestParams, previousParams);
    this.lookup_.getNavigationService().navigate(token);
  }, this);

  var searchPageContext = goog.getObjectByName('document');
  this.searchPage = new org.jboss.search.page.SearchPage(
      searchPageContext,
      {
        authorElements: params.authorElements,
        technologyElements: params.technologyElements,
        contentElements: params.contentElements,
        dateElements: params.dateElements,
        searchPageElements: params.searchPageElements
      });

  this.searchEventListenerId_ = goog.events.listen(
      this.searchPage,
      [
        org.jboss.search.page.event.EventType.QUERY_SUBMITTED,
        org.jboss.search.page.event.EventType.CONTRIBUTOR_ID_SELECTED
      ],
      function(e) {
        var event;
        switch (e.type) {
          case org.jboss.search.page.event.EventType.QUERY_SUBMITTED:
            event = /** @type {org.jboss.search.page.event.QuerySubmitted} */ (e);
            var qp_ = event.getRequestParams();
            urlSetFragmentFunction(qp_);
            break;
          case org.jboss.search.page.event.EventType.CONTRIBUTOR_ID_SELECTED:
            event = /** @type {org.jboss.search.page.event.ContributorIdSelected} */ (e);
            var urlFragment = org.jboss.core.util.fragmentGenerator.generate(
                org.jboss.core.context.RequestParamsFactory.getInstance().reset()
                  .setContributors([event.getContributorId()]).build()
                );
            var uri = [org.jboss.search.Variables.PROFILE_APP_BASE_URL, urlFragment].join('#');
            goog.window.open(uri);
            break;
        }
      }
      );

  // navigation controller
  var navigationController = function(e) {
    var event = /** @type {org.jboss.core.service.navigation.NavigationServiceEvent} */ (e);
    /** @type {org.jboss.core.context.RequestParams} */
    var requestParams = org.jboss.core.util.fragmentParser.parse(event.getToken());
    if (goog.isDefAndNotNull(requestParams.getQueryString())) {
      this.lookup_.getQueryService().userQuery(requestParams);
    } else {
      this.lookup_.getQueryService().userQuery(
          org.jboss.core.context.RequestParamsFactory.getInstance()
          .reset().copy(requestParams).setQueryString(null).build()
      );
    }
  };

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.historyListenerId_ = goog.events.listen(
      this.lookup_.getNavigationServiceDispatcher(),
      [
        org.jboss.core.service.navigation.NavigationServiceEventType.NEW_NAVIGATION
      ],
      goog.bind(navigationController, this));

  // ================================================================
  // Initialization of filters
  // ================================================================

  // ## Date Filter
  var dateFilterDeferred = new goog.async.Deferred();

  // ## Author Filter
  var authorFilterDeferred = new goog.async.Deferred();

  // ## Technology Filter
  var technologyFilterDeferred = new goog.async.Deferred();

  // ## Content Filter
  var contentFilterDeferred = new goog.async.Deferred();

  // Lists will be initialized at some point in the future (they are deferred types) once they are initialized
  // they calls the deferred that is passed as an argument to their constructor.
  var projectList = new org.jboss.search.list.Project(technologyFilterDeferred);
  var typeList = new org.jboss.search.list.Type(contentFilterDeferred);

  technologyFilterDeferred
      .addCallback(goog.bind(function() {
        // keep project list data in the lookup (so it can be easily used by other objects in the application)
        this.lookup_.setProjectMap(projectList.getMap());
        this.lookup_.setProjectArray(projectList.getArray());
      }, this))
      .addCallback(goog.bind(function() {
        // initialize technology filter and keep reference in the lookup
        var technologyFilter = new org.jboss.search.page.filter.TechnologyFilter(
            params.technologyElements.getHostingElement(),
            params.technologyElements.getQueryField(),
            params.technologyElements.getItemsDiv(),
            params.technologyElements.getItemsOrder(),
            // isCollapsed
            function() {
              return goog.dom.classes.has(params.technologyElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
            },
            // expand
            function() {
              goog.dom.classes.remove(params.dateElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.add(params.technologyElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.remove(params.authorElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.remove(params.contentElements.getTabElement(), org.jboss.core.Constants.SELECTED);

              goog.dom.classes.remove(params.technologyElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.add(params.dateElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.add(params.authorElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.add(params.contentElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);

              params.technologyElements.getQueryField().focus();
              params.authorElements.getQueryField().blur();
            },
            // collapse
            function() {
              goog.dom.classes.remove(params.technologyElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.add(params.technologyElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              params.technologyElements.getQueryField().blur();
            }
            );
        this.lookup_.setTechnologyFilter(technologyFilter);
        technologyFilter.init();
      }, this))
      .addCallback(
          goog.bind(function() {
            this.searchPage.listenOnTechnologyFilterChanges(this.lookup_.getTechnologyFilter());
            status.increaseProgress();
          }, this));

  authorFilterDeferred
      .addCallback(goog.bind(function() {
        // initialize author filter and keep reference in the lookup
        var authorFilter = new org.jboss.search.page.filter.AuthorFilter(
            params.authorElements.getHostingElement(),
            params.authorElements.getQueryField(),
            params.authorElements.getItemsDiv(),
            params.authorElements.getItemsOrder(),
            // isCollapsed
            function() {
              return goog.dom.classes.has(params.authorElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
            },
            // expand
            function() {
              goog.dom.classes.remove(params.dateElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.remove(params.technologyElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.add(params.authorElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.remove(params.contentElements.getTabElement(), org.jboss.core.Constants.SELECTED);

              goog.dom.classes.add(params.dateElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.add(params.technologyElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.remove(params.authorElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.add(params.contentElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);

              params.technologyElements.getQueryField().blur();
              params.authorElements.getQueryField().focus();
            },
            // collapse
            function() {
              goog.dom.classes.remove(params.authorElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.add(params.authorElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              params.authorElements.getQueryField().blur();
            }
            );
        this.lookup_.setAuthorFilter(authorFilter);
        authorFilter.init();
      }, this))
      .addCallback(
          goog.bind(function() {
            this.searchPage.listenOnAuthorFilterChanges(this.lookup_.getAuthorFilter());
            status.increaseProgress();
          }, this));

  contentFilterDeferred
      .addCallback(goog.bind(function() {
        // keep type list data in the lookup (so it can be easily used by other objects in the application)
        this.lookup_.setTypeMap(typeList.getMap());
        this.lookup_.setTypeArray(typeList.getArray());
      }, this))
      .addCallback(goog.bind(function() {
        // initialize content filter and keep reference in the lookup
        var contentFilter = new org.jboss.search.page.filter.ContentFilter(
            params.contentElements.getHostingElement(),
            params.contentElements.getItemsDiv(),
            // isCollapsed
            function() {
              return goog.dom.classes.has(params.contentElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
            },
            // expand
            function() {
              goog.dom.classes.remove(params.dateElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.remove(params.technologyElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.remove(params.authorElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.add(params.contentElements.getTabElement(), org.jboss.core.Constants.SELECTED);

              goog.dom.classes.add(params.dateElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.add(params.technologyElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.add(params.authorElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.remove(params.contentElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);

              params.technologyElements.getQueryField().blur(); // TODO needed?
              params.authorElements.getQueryField().blur();  // TODO needed?
            },
            // collapse
            function() {
              goog.dom.classes.remove(params.contentElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.add(params.contentElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              // blur not needed now
            }
            );
        this.lookup_.setContentFilter(contentFilter);
      }, this))
      .addCallback(
          goog.bind(function() {
            this.searchPage.listenOnContentFilterChanges(this.lookup_.getContentFilter());
            status.increaseProgress();
          }, this));

  dateFilterDeferred
      .addCallback(goog.bind(function() {
        // initialization of date filter and keep reference in the lookup
        // first instantiate date filter and push it up into LookUp
        var dateFilter = new org.jboss.search.page.filter.DateFilter(
            params.dateElements.getHostingElement(),
            params.dateElements.getChartDiv(),
            params.dateElements.getDateFromField(),
            params.dateElements.getDateToField(),
            params.searchPageElements.getDate_order(),
            // isCollapsed
            function() {
              return goog.dom.classes.has(params.dateElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
            },
            // expand
            function() {
              goog.dom.classes.add(params.dateElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.remove(params.technologyElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.remove(params.authorElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.remove(params.contentElements.getTabElement(), org.jboss.core.Constants.SELECTED);

              goog.dom.classes.remove(params.dateElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.add(params.technologyElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.add(params.authorElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              goog.dom.classes.add(params.contentElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);

              params.technologyElements.getQueryField().blur();
              params.authorElements.getQueryField().blur();
            },
            // collapse
            function() {
              goog.dom.classes.remove(params.dateElements.getTabElement(), org.jboss.core.Constants.SELECTED);
              goog.dom.classes.add(params.dateElements.getHostingElement(), org.jboss.core.Constants.HIDDEN);
              // blur not needed now
            }
            );
        this.lookup_.setDateFilter(dateFilter);
      }, this))
      // second register listener on the date filter
      .addCallback(
          goog.bind(function() {
            this.searchPage.listenOnDateFilterChanges(this.lookup_.getDateFilter());
            status.increaseProgress();
          }, this));

  // wait for all deferred initializations to finish and enable search GUI only after that
  var asyncInit = new goog.async.DeferredList(
      [dateFilterDeferred, authorFilterDeferred, technologyFilterDeferred, contentFilterDeferred],
      false, // wait for all deferred to success before execution chain is called
      true // if however any deferred fails, calls errback immediately
      );

  asyncInit
    .addErrback(function(err) {
        // TODO: if any of input deferred objects fail then this is called
        // right now it is empty but should be used to let user know that search page initialization did not complete
        // console.log('some deferred failed!', err);
      })
      // this is just an effect to hide status window as it is not needed anymore when this callback is executed
      .addCallback(function(res) {
        /** @type {boolean} */ var allOK = goog.array.reduce(res, function(rval, val, i, arr) {
          return val[0] == true ? rval : false;
        }, true);
        if (allOK) {
          setTimeout(function() {
            status.hide();
          }, 200);
        } else {
          // at least one deferred failed...
        }
      })
      // start history pooling loop after initialization is finished and enable search field for user input
      .addCallback(goog.bind(function(res) {
        this.lookup_.getNavigationService().setEnable(true);
        params.searchPageElements.getQuery_field().placeholder = 'Search';
        params.searchPageElements.getQuery_field().removeAttribute(org.jboss.core.Constants.DISABLED);
      }, this));

  // load technology list data and initialize technologyFilter
  this.lookup_.getXhrManager().send(
      org.jboss.search.Constants.LOAD_PROJECT_LIST_REQUEST_ID,
      goog.Uri.parse(org.jboss.search.Constants.API_URL_PROJECT_LIST_QUERY).toString(),
      org.jboss.core.Constants.GET,
      '', // post_data
      {}, // headers_map
      org.jboss.search.Constants.LOAD_LIST_PRIORITY,
      goog.bind(function(e) {
        var event = /** @type {goog.net.XhrManager.Event} */ (e);
        if (event.target.isSuccess()) {
          this.log_.info('Initialize technology list data.');
          technologyFilterDeferred.callback(event.target.getResponseJson());
        } else {
          this.log_.warning('Initialization of technology list data failed!');
          this.log_.severe('Error: ' + goog.net.ErrorCode.getDebugMessage(event.target.getLastErrorCode()));
          this.log_.warning('Continue with empty technology list data.');
          technologyFilterDeferred.callback({});
        }
      }, this)
  );

  // load type list data and initialize contentFilter
  this.lookup_.getXhrManager().send(
      org.jboss.search.Constants.LOAD_TYPE_LIST_REQUEST_ID,
      goog.Uri.parse(org.jboss.search.Constants.API_URL_TYPE_LIST_QUERY).toString(),
      org.jboss.core.Constants.GET,
      '', // post_data
      {}, // headers_map
      org.jboss.search.Constants.LOAD_LIST_PRIORITY,
      goog.bind(function(e) {
        var event = /** @type {goog.net.XhrManager.Event} */ (e);
        if (event.target.isSuccess()) {
          this.log_.info('Initialize type list data.');
          contentFilterDeferred.callback(event.target.getResponseJson());
        } else {
          this.log_.warning('Initialization of type list data failed!');
          this.log_.severe('Error: ' + goog.net.ErrorCode.getDebugMessage(event.target.getLastErrorCode()));
          this.log_.warning('Continue with empty type list data.');
          contentFilterDeferred.callback({});
        }
      }, this)
  );

  // initialize authorFilter
  authorFilterDeferred.callback({});

  // initialize dateFilter
  dateFilterDeferred.callback({});

  // ================================================================
  // Pre-load images used in UI
  // ================================================================

  this.lookup_.getImageLoader().addImage('wait16trans', 'image/icons/wait16trans.gif');
  this.lookup_.getImageLoader().addImage('arrowUp', 'image/icons/arrow_sans_up_16_717171.png');
  this.lookup_.getImageLoader().addImage('arrowDown', 'image/icons/arrow_sans_down_16_717171.png');
  // this.lookup_.getImageLoader().addImage("toolbar_find", "image/icons/toolbar_find.png");
  this.lookup_.getImageLoader().start();

  // ================================================================
  // A shortcut
  // ================================================================
  var const_ = org.jboss.core.Constants;

  // TODO experiment
  this.finish_ = goog.events.listen(
      this.lookup_.getQueryServiceDispatcher(),
      [
        org.jboss.core.service.query.QueryServiceEventType.SEARCH_FINISHED,
        org.jboss.core.service.query.QueryServiceEventType.SEARCH_ABORTED,
        org.jboss.core.service.query.QueryServiceEventType.SEARCH_ERROR
      ],
      function() {
        goog.dom.classes.add(params.searchPageElements.getSpinner_div(), const_.HIDDEN);
      }, false, this);

  this.start_ = goog.events.listen(
      this.lookup_.getQueryServiceDispatcher(),
      org.jboss.core.service.query.QueryServiceEventType.SEARCH_START,
      function() {
        goog.dom.classes.remove(params.searchPageElements.getSpinner_div(), const_.HIDDEN);
      }, false, this);

};
goog.inherits(org.jboss.search.App, goog.Disposable);


/** @inheritDoc */
org.jboss.search.App.prototype.disposeInternal = function() {
  org.jboss.search.App.superClass_.disposeInternal.call(this);

  goog.dispose(this.searchPage);

  goog.events.unlistenByKey(this.historyListenerId_);
  goog.events.unlistenByKey(this.finish_);
  goog.events.unlistenByKey(this.start_);
  goog.events.unlistenByKey(this.unloadId_);
  goog.events.unlistenByKey(this.searchEventListenerId_);

  delete this.lookup_;
  delete this.log_;

  // TODO: should be moved up the chain (for now we can keep it here)
  org.jboss.core.service.Locator.dispose();
};
