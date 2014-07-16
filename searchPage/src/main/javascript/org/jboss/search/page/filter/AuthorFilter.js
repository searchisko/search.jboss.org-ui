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
 * @fileoverview Author filter.
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.filter.AuthorDataSource');
goog.provide('org.jboss.search.page.filter.AuthorFilter');
goog.provide('org.jboss.search.page.filter.AuthorFilterController');
goog.provide('org.jboss.search.page.filter.AuthorFilterController.LIST_KEY');

goog.require('goog.array');
goog.require('goog.array.ArrayLike');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.events.Key');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.object');
goog.require('goog.string');
goog.require('org.jboss.core.context.RequestParamsFactory');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.service.query.QueryServiceEventType');
goog.require('org.jboss.core.util.emailName');
goog.require('org.jboss.core.util.gravatar');
goog.require('org.jboss.core.widget.list.BaseListController');
goog.require('org.jboss.core.widget.list.ListController');
goog.require('org.jboss.core.widget.list.ListItem');
goog.require('org.jboss.core.widget.list.ListModelContainer');
goog.require('org.jboss.core.widget.list.ListViewContainer');
goog.require('org.jboss.core.widget.list.ListWidgetFactory');
goog.require('org.jboss.core.widget.list.datasource.DataSource');
goog.require('org.jboss.core.widget.list.datasource.DataSourceEvent');
goog.require('org.jboss.core.widget.list.datasource.DataSourceEventType');
goog.require('org.jboss.core.widget.list.event.ListModelEvent');
goog.require('org.jboss.core.widget.list.event.ListModelEventType');
goog.require('org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener.EventType');
goog.require('org.jboss.core.widget.list.mouse.MouseListener');
goog.require('org.jboss.core.widget.list.mouse.MouseListener.EventType');
goog.require('org.jboss.search.page.filter.FilterUtils');
goog.require('org.jboss.search.page.filter.NewRequestParamsEvent');
goog.require('org.jboss.search.page.filter.NewRequestParamsEventType');
goog.require('org.jboss.search.page.filter.OrderableSupport');



/**
 *
 * @constructor
 * @implements {org.jboss.core.widget.list.datasource.DataSource}
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.filter.AuthorDataSource = function() {
  goog.events.EventTarget.call(this);

  /**
   * @private
   */
  this.lookup_ = org.jboss.core.service.Locator.getInstance().getLookup();

  /**
   * @type {org.jboss.search.page.filter.OrderableSupport.ORDER_FN}
   * @private
   */
  this.order_fn_ = org.jboss.search.page.filter.OrderableSupport.ORDER_FN.FREQUENCY;
};
goog.inherits(org.jboss.search.page.filter.AuthorDataSource, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.search.page.filter.AuthorDataSource.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.AuthorDataSource.superClass_.disposeInternal.call(this);
  delete this.lookup_;
  delete this.order_fn_;
};


/** @inheritDoc */
org.jboss.search.page.filter.AuthorDataSource.prototype.get = function() {

  // get selected people
  /** @type {?org.jboss.core.context.RequestParams} */
  var requestParams = this.lookup_.getRequestParams();
  var selectedPeople = [];
  if (goog.isDefAndNotNull(requestParams) && goog.isDefAndNotNull(requestParams.getContributors())) {
    selectedPeople = requestParams.getContributors();
  }

  /** @type {Array.<{name: string, code: string, orderBy: string, count: number, selected: boolean}>} */
  var peopleArray = [];

  // get recent search results
  var recentQueryResults = this.lookup_.getRecentQueryResultData();

  if (goog.isDefAndNotNull(recentQueryResults)) {

    var peopleFacet = /** @type {goog.array.ArrayLike} */ (goog.object.getValueByKeys(recentQueryResults,
        'facets', 'top_contributors', 'terms'));
    if (goog.isDefAndNotNull(peopleFacet)) {
      goog.array.forEach(peopleFacet, function(item) {
        var code = goog.object.getValueByKeys(item, 'term');
        var name = goog.object.getValueByKeys(item, 'name');
        var gURL16 = goog.object.getValueByKeys(item, 'gURL16');
        var count = goog.object.getValueByKeys(item, 'count');
        var selected = goog.array.find(selectedPeople, function(i) {
          return i === code;
        }) != null;
        peopleArray.push({
          'code': code,
          'name': name,
          'orderBy': name.toLowerCase(),
          'count': count,
          'selected': selected,
          'gURL16': gURL16
        });
      });
    }

    // add selected authors that are not found in peopleFacet
    // TODO: Do we want to adjust 'count' value for selected authors that are found in peopleFacet?
    //       This could be confusing if items are ordered by count (they can change position).
    var peopleFacetFilter = /** @type {goog.array.ArrayLike} */ (goog.object.getValueByKeys(recentQueryResults,
        'facets', 'top_contributors_filter', 'terms'));
    if (goog.isDefAndNotNull(peopleFacetFilter) && selectedPeople.length > 0) {
      goog.array.forEach(selectedPeople, function(selected) {
        var matchFn = function(item) { return item.term === selected; };
        // check if selected record is in facet
        var inFacet = goog.array.find(peopleFacet, matchFn) != null;
        if (!inFacet) {
          // try to get record from facet filter
          var matchingFilter = goog.array.find(peopleFacetFilter, matchFn);
          if (matchingFilter != null) {
            peopleArray.push({
              'code': matchingFilter.term,
              'name': matchingFilter.name,
              'orderBy': matchingFilter.name.toLowerCase(),
              'count': matchingFilter.count,
              'selected': true,
              'gURL16': matchingFilter.gURL16
            });
          }
        }
        if (!inFacet && matchingFilter == null) {
          // not found, but it is selected so we want to display it in the list (this is a rare situation)
          peopleArray.push({
            'code': selected,
            'name': org.jboss.core.util.emailName.extractNameFromMail(selected).valueOf(),
            'orderBy': selected.toLowerCase(),
            'count': 0,
            'selected': true,
            'gURL16': org.jboss.core.util.gravatar.gravatarURI_Memo(selected, 16).valueOf()
          });
        }
      });
    }
  }

  // order data
  this.order_fn_(peopleArray);

  // dispatch data
  this.dispatchEvent(
      new org.jboss.core.widget.list.datasource.DataSourceEvent(
          org.jboss.search.page.filter.FilterUtils.convertDataToEventData(peopleArray)
      )
  );

};


/** @inheritDoc */
org.jboss.search.page.filter.AuthorDataSource.prototype.abort = function() {
  // no-op, we are not doing async operation
};


/** @inheritDoc */
org.jboss.search.page.filter.AuthorDataSource.prototype.isActive = function() {
  return false;
};


/**
 *
 * @param {org.jboss.search.page.filter.OrderableSupport.ORDER_FN} orderFn
 * @protected
 */
org.jboss.search.page.filter.AuthorDataSource.prototype.setOrderFunction = function(orderFn) {
  this.order_fn_ = orderFn;
};



/**
 *
 * @param {!org.jboss.core.widget.list.ListModelContainer} lmc
 * @param {!org.jboss.core.widget.list.ListViewContainer} lvc
 * @constructor
 * @implements {org.jboss.core.widget.list.ListController}
 * @extends {org.jboss.core.widget.list.BaseListController}
 */
org.jboss.search.page.filter.AuthorFilterController = function(lmc, lvc) {
  org.jboss.core.widget.list.BaseListController.call(this, lmc, lvc);

  /**
   * @type {!org.jboss.core.service.LookUp}
   * @private
   */
  this.lookup_ = org.jboss.core.service.Locator.getInstance().getLookup();

  /**
   * @type {org.jboss.core.service.query.QueryService}
   * @private
   */
  this.queryService_ = this.lookup_.getQueryService();

  /**
   * @type {!org.jboss.core.service.query.QueryServiceDispatcher}
   * @private
   */
  this.queryServiceDispatcher_ = this.lookup_.getQueryServiceDispatcher();

  /**
   * Order of list items, defaults to 'frequency'.
   * @type {!org.jboss.search.page.filter.AuthorFilterController.ORDER_KEY}
   * @private
   */
  this.items_order_ = org.jboss.search.page.filter.AuthorFilterController.ORDER_KEY.FREQUENCY;

  this.listItemSelectedKey_ = goog.events.listen(
      this.getListModelContainer(),
      [
        org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED,
        org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED
      ],
      goog.bind(function(e) {
        var event = /** @type {org.jboss.core.widget.list.event.ListModelEvent} */ (e);
        this.dispatchEvent(event);
      }, this));

  /**
   * 'Relevant People' data source.
   *
   * @type {!org.jboss.search.page.filter.AuthorDataSource}
   * @private
   */
  this.queryContextDataSource_ = new org.jboss.search.page.filter.AuthorDataSource();

  /**
   * Subscribe on new data event of 'All Technologies' data source.
   *
   * @type {goog.events.Key}
   * @private
   */
  this.queryContextDSListenerId_ = goog.events.listen(
      this.queryContextDataSource_,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      goog.bind(function(event) {
        var e = /** @type {org.jboss.core.widget.list.datasource.DataSourceEvent} */ (event);
        var model = this.getListModelContainer().getListModelById(
            org.jboss.search.page.filter.AuthorFilterController.LIST_KEY.QUERY_CONTEXT
            );
        if (model != null) {
          model.setData(e.getData());
        }
      }, this));


  /**
   * @type {org.jboss.core.widget.list.keyboard.KeyboardListener}
   * @private
   */
  this.keyboardListener_ = null;

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.keyboardListenerKey_ = null;

  /**
   * @type {org.jboss.core.widget.list.mouse.MouseListener}
   * @private
   */
  this.mouseListener_ = null;

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.mouseListenerKey_ = null;
};
goog.inherits(org.jboss.search.page.filter.AuthorFilterController, org.jboss.core.widget.list.BaseListController);


/** @inheritDoc */
org.jboss.search.page.filter.AuthorFilterController.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.AuthorFilterController.superClass_.disposeInternal.call(this);

  goog.events.unlistenByKey(this.listItemSelectedKey_);
  goog.events.unlistenByKey(this.queryContextDSListenerId_);
  // goog.events.unlistenByKey(this.matchingDSListenerId_);
  goog.events.unlistenByKey(this.keyboardListenerKey_);
  goog.events.unlistenByKey(this.mouseListenerKey_);

  goog.dispose(this.queryContextDataSource_);
  // goog.dispose(this.matchingDataSource_);

  delete this.queryService_;
  delete this.queryServiceDispatcher_;
  delete this.lookup_;
  delete this.keyboardListener_;
  delete this.mouseListener_;
};


/** @inheritDoc */
org.jboss.search.page.filter.AuthorFilterController.prototype.input = function(query) {
  this.abortActiveDataResources();
  this.getListModelContainer().depointPointedListItem();

  // set order for all technology DS
  var order_function_;
  switch (this.items_order_) {
    case org.jboss.search.page.filter.AuthorFilterController.ORDER_KEY.FREQUENCY:
      order_function_ = org.jboss.search.page.filter.OrderableSupport.ORDER_FN.FREQUENCY;
      break;
    case org.jboss.search.page.filter.AuthorFilterController.ORDER_KEY.NAME:
      order_function_ = org.jboss.search.page.filter.OrderableSupport.ORDER_FN.NAME;
      break;
    default:
      // sanity check, possibly log unknown order?
      order_function_ = org.jboss.search.page.filter.OrderableSupport.ORDER_FN.FREQUENCY;
      break;
  }
  this.queryContextDataSource_.setOrderFunction(order_function_);
  this.queryContextDataSource_.get(query);
//  this.queryService_.contributorNameSuggestions(query);
};


/** @inheritDoc */
org.jboss.search.page.filter.AuthorFilterController.prototype.abortActiveDataResources = function() {
  this.abortActiveDataResourcesInternal([this.queryContextDataSource_]);
//  this.queryService_.abortContributorNameSuggestions();
};


/** @inheritDoc */
org.jboss.search.page.filter.AuthorFilterController.prototype.getActiveDataResourcesCount = function() {
  return this.getActiveDataResourcesCountInternal([this.queryContextDataSource_]); /*+
      (this.queryService_.isContributorNameSuggestionsRunning() ? 1 : 0)*/
};


/** @inheritDoc */
org.jboss.search.page.filter.AuthorFilterController.prototype.setKeyboardListener = function(opt_keyboardListener) {
  if (this.keyboardListenerKey_ != null) {
    goog.events.unlistenByKey(this.keyboardListenerKey_);
  }
  this.keyboardListener_ = goog.isDefAndNotNull(opt_keyboardListener) ? opt_keyboardListener : null;
  if (goog.isDefAndNotNull(this.keyboardListener_)) {
    this.keyboardListenerKey_ = goog.events.listen(
        this.keyboardListener_,
        [
          org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.UP,
          org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.DOWN,
          org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.ENTER
        ],
        goog.bind(function(e) {
          var event = /** @type {goog.events.Event} */ (e);
          switch (event.type) {
            case org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.UP:
              this.getListModelContainer().pointPreviousListItem();
              break;
            case org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.DOWN:
              this.getListModelContainer().pointNextListItem();
              break;
            case org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.ENTER:
              if (this.getListModelContainer().isAnyItemPointed()) {
                this.getListModelContainer().toggleSelectedPointedListItem();
              }
              break;
          }
        }, this));
  }
};


/** @inheritDoc */
org.jboss.search.page.filter.AuthorFilterController.prototype.setMouseListener = function(opt_mouseListener) {
  if (this.mouseListenerKey_ != null) {
    goog.events.unlistenByKey(this.mouseListenerKey_);
  }
  this.mouseListener_ = goog.isDefAndNotNull(opt_mouseListener) ? opt_mouseListener : null;
  if (goog.isDefAndNotNull(this.mouseListener_)) {
    this.mouseListenerKey_ = goog.events.listen(
        this.mouseListener_,
        [
          org.jboss.core.widget.list.mouse.MouseListener.EventType.CLICK,
          org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSEENTER,
          org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSELEAVE
        ],
        goog.bind(function(e) {
          var event = /** @type {goog.events.Event} */ (e);
          switch (event.type) {
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSEENTER:
              this.getListModelContainer().pointListItemById(event.target.id);
              break;
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSELEAVE:
              this.getListModelContainer().depointPointedListItem();
              break;
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.CLICK:
              this.getListModelContainer().pointListItemById(event.target.id);
              this.getListModelContainer().toggleSelectedPointedListItem();
              break;
          }
        }, this));
  }
};


/**
 *
 * @param {!org.jboss.search.page.filter.AuthorFilterController.ORDER_KEY} order
 * @protected
 */
org.jboss.search.page.filter.AuthorFilterController.prototype.setOrder = function(order) {
  this.items_order_ = order;
};


/**
 * Constants for list keys.
 *
 * @enum {string}
 */
org.jboss.search.page.filter.AuthorFilterController.LIST_KEY = {
  MATCHING: 'matching',
  QUERY_CONTEXT: 'query_context'
};


/**
 * Constant representing order in which list items should be displayed.
 *
 * @enum {string}
 */
org.jboss.search.page.filter.AuthorFilterController.ORDER_KEY = {
  NAME: 'name',
  FREQUENCY: 'frequency'
};



/**
 * Create a new author filter.
 * It requires an element as the parameter, it assumes there is one element with class='filter_items' found inside.
 * @param {!HTMLElement} element to host the author filter
 * @param {!HTMLInputElement} query_field to host the technology filter
 * @param {!HTMLDivElement} author_filter_items_div where authors are listed
 * @param {!HTMLSelectElement} author_filter_order select element to drive order of items
 * @param {function(): boolean=} opt_isCollapsed a function that is used to learn if filter is collapsed
 * @param {Function=} opt_expandFilter a function that is used to show/expand the filter DOM elements
 * @param {Function=} opt_collapseFilter a function that is used to hide/collapse the filter DOM elements
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.filter.AuthorFilter = function(element, query_field, author_filter_items_div,
                                                     author_filter_order,
                                                     opt_isCollapsed, opt_expandFilter, opt_collapseFilter) {
  goog.events.EventTarget.call(this);

  /**
   * @type {!Function}
   * @private
   */
  this.expandFilter_ = /** @type {!Function} */ (goog.isFunction(opt_expandFilter) ?
      opt_expandFilter : goog.nullFunction);

  /**
   * @type {!Function}
   * @private
   */
  this.collpaseFilter_ = /** @type {!Function} */ (goog.isFunction(opt_collapseFilter) ?
      opt_collapseFilter : goog.nullFunction);

  /**
   * @type {function(): boolean}
   * @private
   */
  this.isCollapsed_ = /** @type {function(): boolean} */ (goog.isFunction(opt_isCollapsed) ?
      opt_isCollapsed : function() { return true; });

  /**
   * @type {!HTMLDivElement}
   * @private
   */
  this.items_div_ = author_filter_items_div;

  /**
   * @type {!HTMLSelectElement}
   * @private
   */
  this.items_order_ = author_filter_order;

  /**
   * @type {!HTMLInputElement}
   * @private */
  this.query_field_ = query_field;

  /**
   * @type {!org.jboss.core.service.query.QueryServiceDispatcher}
   * @private
   */
  this.queryServiceDispatcher_ = org.jboss.core.service.Locator.getInstance().getLookup().getQueryServiceDispatcher();

  /**
   * @type {org.jboss.core.widget.list.ListController}
   * @private
   */
  this.authorFilterController_ = org.jboss.core.widget.list.ListWidgetFactory.build({
    lists: [
      {
        caption: 'Matching Contributors',
        key: org.jboss.search.page.filter.AuthorFilterController.LIST_KEY.MATCHING
      },
      {
        caption: 'Top Contributors',
        key: org.jboss.search.page.filter.AuthorFilterController.LIST_KEY.QUERY_CONTEXT
      }
    ],
    controllerConstructor: org.jboss.search.page.filter.AuthorFilterController,
    attach: this.items_div_
  });
  // ... and set keyboard and mouse listeners for it
  this.keyboardListener_ = new org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener(this.query_field_);
  this.authorFilterController_.setKeyboardListener(this.keyboardListener_);
  this.mouseListener_ = new org.jboss.core.widget.list.mouse.MouseListener(this.items_div_);
  this.authorFilterController_.setMouseListener(this.mouseListener_);

  this.authorFilterControllerKey_ = goog.events.listen(
      this.authorFilterController_,
      [
        org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED,
        org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED
      ],
      goog.bind(function(e) {
        var event = /** @type {org.jboss.core.widget.list.event.ListModelEvent} */ (e);
        var data = event.target.getData();
        var index = event.getItemIndex();

        if (index < data.length) {
          /** @type {org.jboss.core.widget.list.ListItem} */
          var selected = data[index];
          var selectedId = selected.getId();
          var rp = org.jboss.core.service.Locator.getInstance().getLookup().getRequestParams();
          if (goog.isDefAndNotNull(rp)) {
            var filterArray = rp.getContributors();

            // depending on event type update filterArray
            switch (event.getType()) {
              case org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED:
                if (!goog.array.contains(filterArray, selectedId)) {
                  filterArray = goog.array.concat(filterArray, selectedId);
                }
                break;

              case org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED:
                if (goog.array.contains(filterArray, selectedId)) {
                  goog.array.remove(filterArray, selectedId);
                }
                break;
            }

            var rpf = org.jboss.core.context.RequestParamsFactory.getInstance();
            // set new project filters and reset page
            var new_rp = rpf.reset().copy(rp).setContributors(filterArray).setPage(null).build();
            this.dispatchEvent(
                new org.jboss.search.page.filter.NewRequestParamsEvent(
                    org.jboss.search.page.filter.NewRequestParamsEventType.NEW_REQUEST_PARAMETERS,
                    new_rp)
            );
          }
        }
      }, this));

  /**
   * Handle change of "order by".
   * @type {goog.events.Key}
   * @private
   */
  this.authorFilterOrderKey_ = goog.events.listen(
      this.items_order_,
      [
        goog.events.EventType.CHANGE
      ],
      goog.bind(function() {
        this.refreshItems();
      }, this));

  /**
   * We need to update list items on search success event.
   * @type {goog.events.Key}
   * @private
   */
  this.updateOnSearchSuccessKey_ = goog.events.listen(
      this.queryServiceDispatcher_,
      [
        org.jboss.core.service.query.QueryServiceEventType.SEARCH_SUCCEEDED
      ],
      goog.bind(function() {
        this.refreshItems();
      }, this));

};
goog.inherits(org.jboss.search.page.filter.AuthorFilter, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.search.page.filter.AuthorFilter.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.AuthorFilter.superClass_.disposeInternal.call(this);

  goog.events.unlistenByKey(this.authorFilterControllerKey_);
  goog.events.unlistenByKey(this.authorFilterOrderKey_);
  goog.events.unlistenByKey(this.updateOnSearchSuccessKey_);

  goog.dispose(this.authorFilterController_);
  goog.dispose(this.keyboardListener_);
  goog.dispose(this.mouseListener_);

  delete this.query_field_;
  delete this.expandFilter_;
  delete this.collpaseFilter_;
  delete this.queryServiceDispatcher_;
};


/**
 * Refresh filter items (meaning update to the latest search result data). By default
 * this does nothing if the filter is collapsed.
 * @param {boolean=} opt_force refresh even if filter is collapsed. Defaults to false.
 */
org.jboss.search.page.filter.AuthorFilter.prototype.refreshItems = function(opt_force) {
  var force = !!(opt_force || false);
  if (!this.isCollapsed_() || force) {
    this.authorFilterController_.setOrder(this.getOrder_());
    this.authorFilterController_.input(this.query_field_.value);
  }
};


/**
 * (Re)generate HTML of filter items
 * @param {Array} data
 * @private
 */
org.jboss.search.page.filter.AuthorFilter.prototype.updateItems_ = function(data) {
  // TODO: remove if not needed
  // scroll to top when changing the content of the filter
  if (this.items_div_.scrollTop) {
    this.items_div_.scrollTop = 0;
  }
};


/**
 * Calls opt_expandFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.AuthorFilter.prototype.expandFilter = function() {
  this.refreshItems(true);
  this.expandFilter_();
};


/**
 * Calls opt_collapseFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.AuthorFilter.prototype.collapseFilter = function() {
  this.authorFilterController_.abortActiveDataResources();
  this.collpaseFilter_();
};


/**
 * Returns true if filter is expanded.
 * @return {boolean}
 */
org.jboss.search.page.filter.AuthorFilter.prototype.isExpanded = function() {
  return !this.isCollapsed_();
};


/**
 * Initialization of author filter.
 * TODO: move to common abstract parent
 */
org.jboss.search.page.filter.AuthorFilter.prototype.init = function() {
  if (this.getOrder_() != null) {
    // The only thing we can do now is to setup the default order to 'frequency'.
    var options = goog.object.getValueByKeys(this.items_order_, 'options');
    if (goog.isDefAndNotNull(options) && goog.isArrayLike(options)) {
      var option = goog.array.find(/** @type {goog.array.ArrayLike} */ (options), function(item) {
        return (item.label && item.label == 'frequency');
      });
      if (option != null) {
        option.setAttribute('selected', true);
      }
    }
  }
};


/**
 * @return {?string}
 * @private
 * TODO: move to common abstract parent
 */
org.jboss.search.page.filter.AuthorFilter.prototype.getOrder_ = function() {
  var so = goog.object.getValueByKeys(this.items_order_, 'selectedOptions');
  if (so != undefined && goog.isFunction(so.item)) {
    var item = so.item(0);
    if (goog.isDefAndNotNull(item))
      return item.value;
  }
  return null;
};
