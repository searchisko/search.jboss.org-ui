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
 * @fileoverview Technology filter and related classes.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.filter.AllTechnologyDataSource');
goog.provide('org.jboss.search.page.filter.TechnologyFilter');
goog.provide('org.jboss.search.page.filter.TechnologyFilterController');
goog.provide('org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS');
goog.provide('org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.array.ArrayLike');
goog.require('goog.async.Delay');
goog.require('goog.async.nextTick');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.events.Key');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.object');
goog.require('goog.string');
goog.require('org.jboss.core.Constants');
goog.require('org.jboss.core.context.RequestParamsFactory');
goog.require('org.jboss.core.response.ProjectNameSuggestions');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.service.query.QueryServiceEventType');
goog.require('org.jboss.core.util.urlGenerator');
goog.require('org.jboss.core.widget.list.BaseListController');
goog.require('org.jboss.core.widget.list.ListController');
goog.require('org.jboss.core.widget.list.ListItem');
goog.require('org.jboss.core.widget.list.ListModelContainer');
goog.require('org.jboss.core.widget.list.ListViewContainer');
goog.require('org.jboss.core.widget.list.ListWidgetFactory');
goog.require('org.jboss.core.widget.list.datasource.DataSource');
goog.require('org.jboss.core.widget.list.datasource.DataSourceEvent');
goog.require('org.jboss.core.widget.list.datasource.DataSourceEventType');
goog.require('org.jboss.core.widget.list.datasource.RepeaterDataSource');
goog.require('org.jboss.core.widget.list.event.ListModelEvent');
goog.require('org.jboss.core.widget.list.event.ListModelEventType');
goog.require('org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener.EventType');
goog.require('org.jboss.core.widget.list.mouse.MouseListener');
goog.require('org.jboss.core.widget.list.mouse.MouseListener.EventType');
goog.require('org.jboss.search.Constants');
goog.require('org.jboss.search.page.filter.FilterUtils');
goog.require('org.jboss.search.page.filter.NewRequestParamsEvent');
goog.require('org.jboss.search.page.filter.NewRequestParamsEventType');
goog.require('org.jboss.search.page.filter.OrderableSupport');
goog.require('org.jboss.search.page.filter.templates');
goog.require('org.jboss.search.response');



/**
 * All Technology {@link DataSource}.
 * This data source knows how to deliver all technologies from the server
 * along with facet counts form the most recent search results.
 *
 * @constructor
 * @implements {org.jboss.core.widget.list.datasource.DataSource}
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.filter.AllTechnologyDataSource = function() {
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
goog.inherits(org.jboss.search.page.filter.AllTechnologyDataSource, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.search.page.filter.AllTechnologyDataSource.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.AllTechnologyDataSource.superClass_.disposeInternal.call(this);
  delete this.lookup_;
  delete this.order_fn_;
};


/** @inheritDoc */
org.jboss.search.page.filter.AllTechnologyDataSource.prototype.get = function() {

  // get selected technologies
  /** @type {?org.jboss.core.context.RequestParams} */
  var requestParams = this.lookup_.getRequestParams();
  var selectedTechnologies = [];
  if (goog.isDefAndNotNull(requestParams) && goog.isDefAndNotNull(requestParams.getProjects())) {
    selectedTechnologies = requestParams.getProjects();
  }

  // get all technologies array
  /** @type {Array.<{name: string, code: string, orderBy: string, count: number, selected: boolean}>} */
  var techArray = this.lookup_.getProjectArrayClone();

  // set count to zero by default
  goog.array.forEach(techArray, function(item) { item.count = 0; });

  // flag those that are selected
  goog.array.forEach(selectedTechnologies, function(selectedTech) {
    var matching = goog.array.find(techArray, function(item) {
      return item.code == selectedTech;
    });
    if (matching != null) {
      matching['selected'] = true;
    }
  });

  // get recent search results (we will get facets counts from it)
  var recentQueryResults = this.lookup_.getRecentQueryResultData();

  if (goog.isDefAndNotNull(recentQueryResults)) {
    var technologyFacet = /** @type {goog.array.ArrayLike} */ (goog.object.getValueByKeys(recentQueryResults,
        'facets', 'per_project_counts', 'terms'));
    if (goog.isDefAndNotNull(technologyFacet)) {
      goog.array.forEach(technologyFacet, function(item) {
        var techCode = goog.object.getValueByKeys(item, 'term');
        var count = goog.object.getValueByKeys(item, 'count');
        var matchingTech = goog.array.find(techArray, function(i) {
          return i.code == techCode;
        });
        if (matchingTech != null) {
          matchingTech['count'] = count;
        }
      });
    }

    // order data
    this.order_fn_(techArray);

    // dispatch data
    this.dispatchEvent(
        new org.jboss.core.widget.list.datasource.DataSourceEvent(
            org.jboss.search.page.filter.FilterUtils.convertDataToEventData(techArray)
        )
    );
  }
};


/** @inheritDoc */
org.jboss.search.page.filter.AllTechnologyDataSource.prototype.abort = function() {
  // no-op, we are not doing async operation
};


/** @inheritDoc */
org.jboss.search.page.filter.AllTechnologyDataSource.prototype.isActive = function() {
  return false;
};


/**
 *
 * @param {org.jboss.search.page.filter.OrderableSupport.ORDER_FN} orderFn
 * @protected
 */
org.jboss.search.page.filter.AllTechnologyDataSource.prototype.setOrderFunction = function(orderFn) {
  this.order_fn_ = orderFn;
};



/**
 * TechnologyFilterController is used to manage behaviour of technology filter.
 * Namely it is responsible for displaying technology suggestions and list of technologies relevant to actual query.
 * It also allow users to do selections from these lists.
 *
 * @param {!org.jboss.core.widget.list.ListModelContainer} lmc
 * @param {!org.jboss.core.widget.list.ListViewContainer} lvc
 * @constructor
 * @implements {org.jboss.core.widget.list.ListController}
 * @extends {org.jboss.core.widget.list.BaseListController}
 */
org.jboss.search.page.filter.TechnologyFilterController = function(lmc, lvc) {
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
   * @type {!org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY}
   * @private
   */
  this.items_order_ = org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY.FREQUENCY;

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
   * Update project name suggestions on relevant event.
   * @type {goog.events.Key}
   * @private
   */
  this.projectNameSuggestionsKey_ = goog.events.listen(
      this.queryServiceDispatcher_,
      [
        org.jboss.core.service.query.QueryServiceEventType.PROJECT_NAME_SEARCH_SUGGESTIONS_SUCCEEDED
      ],
      goog.bind(function(e) {
        var tf_ = this.lookup_.getTechnologyFilter();
        if (goog.isDefAndNotNull(tf_) && tf_.isExpanded()) {

          /**
           * Function to lookup a count for given technology code from recent search results aggregation.
           * Note: We should find more elegant way how to get counts for technology codes.
           *       See the AllTechnologyDataSource which contains similar logic (we should refactor this).
           *
           * @param {string} code
           * @return {number} contains either
           */
          var getRecentCountForTechnology_ = function(code) {
            var recentQueryResults = org.jboss.core.service.Locator.getInstance().getLookup().getRecentQueryResultData();
            if (goog.isDefAndNotNull(recentQueryResults)) {
              var technologyFacet = /** @type {goog.array.ArrayLike} */ (goog.object.getValueByKeys(recentQueryResults,
                'facets', 'per_project_counts', 'terms'));
              if (goog.isDefAndNotNull(technologyFacet)) {
                var matching = goog.array.find(technologyFacet, function(tech) {
                  return (goog.object.getValueByKeys(tech, 'term') === code);
                });
                if (goog.isDefAndNotNull(matching)) {
                  var count = goog.object.getValueByKeys(matching, 'count');
                }
                if (goog.isDefAndNotNull(count)) {
                  return +count;
                }
              }
            }
            return 0;
          };

          var event = /** @type {org.jboss.core.service.query.QueryServiceEvent} */ (e);
          var data = /** @type {org.jboss.core.response.ProjectNameSuggestions} */ (event.getMetadata());

          // get selected technologies
          /** @type {?org.jboss.core.context.RequestParams} */
          var requestParams = org.jboss.core.service.Locator.getInstance().getLookup().getRequestParams();
          var selectedTechnologies = [];
          if (goog.isDefAndNotNull(requestParams)) {
            selectedTechnologies = requestParams.getProjects();
          }

          // handle matching items
          var matching_items = data.matching_items;
          /** @type {!Array.<{name: string, code: string, orderBy: string, count: number, selected: boolean}>} */
          var mi = [];
          if (goog.isDef(matching_items) && goog.isArrayLike(matching_items)) {
            goog.array.forEach(/** @type {goog.array.ArrayLike} */ (matching_items), function(item) {
              var code = item['code'];
              var name = (item['name'][0]).toString(); // TODO: better input preprocessing
              mi.push({
                'code': code,
                'name': name,
                'count': getRecentCountForTechnology_(code),
                'orderBy': code.toLowerCase(), // name contains the <em> tag! thus using code for now
                'selected': goog.array.contains(selectedTechnologies, code)
              });
            });
            // order
            switch (this.items_order_) {
              case org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY.NAME:
                org.jboss.search.page.filter.OrderableSupport.ORDER_FN.NAME(mi);
                break;
              case org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY.FREQUENCY:
                org.jboss.search.page.filter.OrderableSupport.ORDER_FN.FREQUENCY(mi);
                break;
              default:
                org.jboss.search.page.filter.OrderableSupport.ORDER_FN.FREQUENCY(mi);
                break;
            }
          }
          this.matchingDataSource_.repeat(
              org.jboss.search.page.filter.FilterUtils.convertDataToEventData(mi)
          );

          // handle did_you_mean items
          var did_you_mean_items = data.did_you_mean_items;
          /** @type {!Array.<{name: string, code: string, orderBy: string, count: number, selected: boolean}>} */
          var dymi = [];
          if (goog.isDef(did_you_mean_items) && goog.isArrayLike(did_you_mean_items)) {
            var codeExistsFn = function(matching_item) {
              return matching_item.code == this;
            };
            goog.array.forEach(/** @type {goog.array.ArrayLike} */ (did_you_mean_items), function(dym_item) {
              // include only if code does not already exists in matching_items
              if (!goog.array.findIndex(mi, codeExistsFn, dym_item['code']) > -1) {
                var code = dym_item['code'];
                var name = (dym_item['name']).toString(); // TODO: better input preprocessing
                dymi.push({
                  'code': code,
                  'name': name,
                  'count': getRecentCountForTechnology_(code),
                  'orderBy': name.toLowerCase(),
                  'selected': goog.array.contains(selectedTechnologies, code)
                });
              }
            });
            // order
            switch (this.items_order_) {
              case org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY.NAME:
                org.jboss.search.page.filter.OrderableSupport.ORDER_FN.NAME(dymi);
                break;
              case org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY.FREQUENCY:
                org.jboss.search.page.filter.OrderableSupport.ORDER_FN.FREQUENCY(dymi);
                break;
              default:
                org.jboss.search.page.filter.OrderableSupport.ORDER_FN.FREQUENCY(dymi);
                break;
            }
          }
          this.didYouMeanDataSource_.repeat(
              org.jboss.search.page.filter.FilterUtils.convertDataToEventData(dymi)
          );
        }
      }, this));

  /**
   * 'All Technologies' data source.
   *
   * @type {!org.jboss.search.page.filter.AllTechnologyDataSource}
   * @private
   */
  this.queryContextDataSource_ = new org.jboss.search.page.filter.AllTechnologyDataSource();

  /**
   * 'Did you mean?' data source.
   *
   * @type {!org.jboss.core.widget.list.datasource.RepeaterDataSource}
   * @private
   */
  this.didYouMeanDataSource_ = new org.jboss.core.widget.list.datasource.RepeaterDataSource();

  /**
   * 'Matching technologies' data source.
   *
   * @type {!org.jboss.core.widget.list.datasource.RepeaterDataSource}
   * @private
   */
  this.matchingDataSource_ = new org.jboss.core.widget.list.datasource.RepeaterDataSource();

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
            org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS.QUERY_CONTEXT
            );
        if (model != null) {
          model.setData(e.getData());
        }
      }, this));

  /**
   * Subscribe on new data event of 'Did you mean?' data source.
   *
   * @type {goog.events.Key}
   * @private
   */
  this.didYouMeanDSListenerId_ = goog.events.listen(
      this.didYouMeanDataSource_,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      goog.bind(function(event) {
        var e = /** @type {org.jboss.core.widget.list.datasource.DataSourceEvent} */ (event);
        var model = this.getListModelContainer().getListModelById(
            org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS.DID_YOU_MEAN
            );
        if (model != null) {
          model.setData(e.getData());
        }
      }, this));

  /**
   * Subscribe on new data event of 'Matching technologies' data source.
   *
   * @type {goog.events.Key}
   * @private
   */
  this.matchingDSListenerId_ = goog.events.listen(
      this.matchingDataSource_,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      goog.bind(function(event) {
        var e = /** @type {org.jboss.core.widget.list.datasource.DataSourceEvent} */ (event);
        var model = this.getListModelContainer().getListModelById(
            org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS.MATCHING
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
goog.inherits(org.jboss.search.page.filter.TechnologyFilterController, org.jboss.core.widget.list.BaseListController);


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyFilterController.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.TechnologyFilterController.superClass_.disposeInternal.call(this);

  goog.events.unlistenByKey(this.listItemSelectedKey_);
  goog.events.unlistenByKey(this.queryContextDSListenerId_);
  goog.events.unlistenByKey(this.didYouMeanDSListenerId_);
  goog.events.unlistenByKey(this.matchingDSListenerId_);
  goog.events.unlistenByKey(this.projectNameSuggestionsKey_);
  goog.events.unlistenByKey(this.keyboardListenerKey_);
  goog.events.unlistenByKey(this.mouseListenerKey_);

  goog.dispose(this.queryContextDataSource_);
  goog.dispose(this.didYouMeanDataSource_);
  goog.dispose(this.matchingDataSource_);

  delete this.queryService_;
  delete this.queryServiceDispatcher_;
  delete this.lookup_;
  delete this.keyboardListener_;
  delete this.mouseListener_;
};


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyFilterController.prototype.input = function(query) {
  this.abortActiveDataResources();
  this.getListModelContainer().depointPointedListItem();

  // set order for all technology DS
  var order_function_;
  switch (this.items_order_) {
    case org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY.FREQUENCY:
      order_function_ = org.jboss.search.page.filter.OrderableSupport.ORDER_FN.FREQUENCY;
      break;
    case org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY.NAME:
      order_function_ = org.jboss.search.page.filter.OrderableSupport.ORDER_FN.NAME;
      break;
    default:
      // sanity check, possibly log unknown order?
      order_function_ = org.jboss.search.page.filter.OrderableSupport.ORDER_FN.FREQUENCY;
      break;
  }
  this.queryContextDataSource_.setOrderFunction(order_function_);
  this.queryContextDataSource_.get(query);

  // order is handled inside the TechnologyFilterController internal listener
  this.queryService_.projectNameSuggestions(query);
};


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyFilterController.prototype.abortActiveDataResources = function() {
  this.abortActiveDataResourcesInternal([this.queryContextDataSource_]);
  this.queryService_.abortProjectNameSuggestions();
};


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyFilterController.prototype.getActiveDataResourcesCount = function() {
  return this.getActiveDataResourcesCountInternal([this.queryContextDataSource_]) +
      (this.queryService_.isProjectNameSuggestionsRunning() ? 1 : 0);
};


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyFilterController.prototype.setKeyboardListener = function(opt_keyboardListener) {
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
org.jboss.search.page.filter.TechnologyFilterController.prototype.setMouseListener = function(opt_mouseListener) {
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
 * @param {!org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY} order
 * @protected
 */
org.jboss.search.page.filter.TechnologyFilterController.prototype.setOrder = function(order) {
  this.items_order_ = order;
};


/**
 * Constants for list keys.
 *
 * @enum {string}
 */
org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS = {
  QUERY_CONTEXT: 'query_context',
  DID_YOU_MEAN: 'did_you_mean',
  MATCHING: 'matching'
};


/**
 * Constant representing order in which list items should be displayed.
 *
 * @enum {string}
 */
org.jboss.search.page.filter.TechnologyFilterController.ORDER_KEY = {
  NAME: 'name',
  FREQUENCY: 'frequency'
};



/**
 * Technology filter is responsible for managing the technology filter.
 * It dispatches {@link TechnologyFilterEvent} whenever a new {@link RequestParams} is available
 * as a result of user interaction with the filter.
 *
 * @param {!HTMLElement} element to host the technology filter
 * @param {!HTMLInputElement} query_field to host the technology filter
 * @param {!HTMLDivElement} technology_filter_items_div where projects are listed
 * @param {!HTMLSelectElement} technology_filter_order select element to drive order of items
 * @param {function(): boolean=} opt_isCollapsed a function that is used to learn if filter is collapsed
 * @param {Function=} opt_expandFilter a function that is used to show/expand the filter DOM elements
 * @param {Function=} opt_collapseFilter a function that is used to hide/collapse the filter DOM elements
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.filter.TechnologyFilter = function(element, query_field, technology_filter_items_div,
                                                         technology_filter_order,
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
  this.items_div_ = technology_filter_items_div;

  /**
   * @type {!HTMLSelectElement}
   * @private
   */
  this.items_order_ = technology_filter_order;

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
  this.technologyFilterController_ = org.jboss.core.widget.list.ListWidgetFactory.build({
    lists: [
      {
        caption: 'Matching Technologies',
        key: org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS.MATCHING
      },
      {
        caption: 'Did You Mean?',
        key: org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS.DID_YOU_MEAN
      },
      {
        caption: 'All Technologies',
        key: org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS.QUERY_CONTEXT
      }
    ],
    controllerConstructor: org.jboss.search.page.filter.TechnologyFilterController,
    attach: this.items_div_
  });
  // ... and set keyboard and mouse listeners for it
  this.keyboardListener_ = new org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener(this.query_field_);
  this.technologyFilterController_.setKeyboardListener(this.keyboardListener_);
  this.mouseListener_ = new org.jboss.core.widget.list.mouse.MouseListener(this.items_div_);
  this.technologyFilterController_.setMouseListener(this.mouseListener_);

  this.technologyFilterControllerKey_ = goog.events.listen(
      this.technologyFilterController_,
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
            var filterArray = rp.getProjects();

            // depending on event type update filterArray
            switch (event.type) {
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
            var new_rp = rpf.reset().copy(rp).setProjects(filterArray).setPage(null).build();
            this.dispatchEvent(
                new org.jboss.search.page.filter.NewRequestParamsEvent(
                    org.jboss.search.page.filter.NewRequestParamsEventType.NEW_REQUEST_PARAMETERS,
                    new_rp)
            );
          }
        }
      }, this));

  /**
   * If the filter is expanded and the ESC key is caught on the document then collapse the filter.
   * @type {goog.events.Key}
   * @private
   */
  this.collapseKeyListenerKey_ = goog.events.listen(
      new goog.events.KeyHandler(goog.dom.getDocument()),
      [
        goog.events.KeyHandler.EventType.KEY
      ],
      goog.bind(function(event) {
        var e = /** @type {goog.events.BrowserEvent} */ (event);
        if (e.keyCode == goog.events.KeyCodes.ESC) {
          if (!this.isCollapsed_()) {
            this.collapseFilter();
          }
        }
      }, this));

  /**
   * Handle keys on the query input field.
   * @type {goog.events.Key}
   * @private
   */
  this.queryFieldListenerKey_ = goog.events.listen(
      new goog.events.KeyHandler(this.query_field_),
      [
        goog.events.KeyHandler.EventType.KEY
      ],
      goog.bind(function(event) {
        var e = /** @type {goog.events.BrowserEvent} */ (event);
        if (goog.events.KeyCodes.isTextModifyingKeyEvent(e)) {
          goog.async.nextTick(
              function() {
                this.technologyFilterController_.input(this.query_field_.value);
                // console.log(this.items_div_, this.items_div_.offsetHeight,  this.items_div_.scrollHeight);
              }, this
          );
        } else if (e.keyCode == goog.events.KeyCodes.ESC) {
          if (this.query_field_.value != '') {
            // clear the query input field on ESC key and block event propagation
            this.query_field_.value = '';
            this.technologyFilterController_.input(this.query_field_.value);
            e.stopPropagation();
          }
        }
      }, this));

  /**
   * Handle change of "order by".
   * @type {goog.events.Key}
   * @private
   */
  this.technologyFilterOrderKey_ = goog.events.listen(
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
goog.inherits(org.jboss.search.page.filter.TechnologyFilter, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyFilter.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.TechnologyFilter.superClass_.disposeInternal.call(this);

  goog.events.unlistenByKey(this.technologyFilterControllerKey_);
  goog.events.unlistenByKey(this.collapseKeyListenerKey_);
  goog.events.unlistenByKey(this.queryFieldListenerKey_);
  goog.events.unlistenByKey(this.technologyFilterOrderKey_);
  goog.events.unlistenByKey(this.updateOnSearchSuccessKey_);

  // dispose ListWidget related objects
  goog.dispose(this.technologyFilterController_);
  goog.dispose(this.keyboardListener_);
  goog.dispose(this.mouseListener_);

  delete this.items_div_;
  delete this.items_order_;
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
org.jboss.search.page.filter.TechnologyFilter.prototype.refreshItems = function(opt_force) {
  var force = !!(opt_force || false);
  if (!this.isCollapsed_() || force) {
    this.technologyFilterController_.setOrder(this.getOrder_());
    this.technologyFilterController_.input(this.query_field_.value);
  }
};


/**
 * (Re)generate HTML of filter items
 * @param {Array} data
 * @private
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.updateItems_ = function(data) {
  // TODO: remove if not needed
  // scroll to top when changing the content of the filter
  if (this.items_div_.scrollTop && goog.isNumber(this.items_div_.scrollTop)) {
    this.items_div_.scrollTop = 0;
  }
};


/**
 * Calls opt_expandFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.expandFilter = function() {
  this.refreshItems(true);
  this.expandFilter_();
};


/**
 * Abort any active {@link DataSource}s and calls the opt_collapseFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.collapseFilter = function() {
  this.technologyFilterController_.abortActiveDataResources();
  this.collpaseFilter_();
};


/**
 * Returns true if filter is expanded.
 * @return {boolean}
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.isExpanded = function() {
  return !this.isCollapsed_();
};


/**
 * Initialization of technology filter.
 * TODO: move to common abstract parent
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.init = function() {
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
org.jboss.search.page.filter.TechnologyFilter.prototype.getOrder_ = function() {
  var so = goog.object.getValueByKeys(this.items_order_, 'selectedOptions');
  if (so != undefined && goog.isFunction(so.item)) {
    var item = so.item(0);
    if (goog.isDefAndNotNull(item))
      return item.value;
  }
  return null;
};
