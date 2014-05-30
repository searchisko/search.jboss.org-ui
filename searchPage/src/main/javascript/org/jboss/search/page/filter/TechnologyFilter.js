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
 * @fileoverview Technology filter.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.filter.TechnologyDataSource');
goog.provide('org.jboss.search.page.filter.TechnologyFilter');
goog.provide('org.jboss.search.page.filter.TechnologyFilterController');
goog.provide('org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.array.ArrayLike');
goog.require('goog.async.Delay');
goog.require('goog.async.nextTick');
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
goog.require('org.jboss.core.service.Locator');
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
goog.require('org.jboss.core.widget.list.datasource.EchoDataSource');
goog.require('org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener');
goog.require('org.jboss.core.widget.list.keyboard.KeyboardListener.EventType');
goog.require('org.jboss.core.widget.list.mouse.MouseListener');
goog.require('org.jboss.core.widget.list.mouse.MouseListener.EventType');
goog.require('org.jboss.search.Constants');
goog.require('org.jboss.search.page.filter.templates');
goog.require('org.jboss.search.response');



/**
 * Technology {@link DataSource}.
 * @constructor
 * @implements {org.jboss.core.widget.list.datasource.DataSource}
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.filter.TechnologyDataSource = function() {
  goog.events.EventTarget.call(this);
};
goog.inherits(org.jboss.search.page.filter.TechnologyDataSource, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyDataSource.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.TechnologyDataSource.superClass_.disposeInternal.call(this);
};


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyDataSource.prototype.get = function(query) {
  var projectMap = org.jboss.core.service.Locator.getInstance().getLookup().getProjectMapClone();
  var recentQueryResults = org.jboss.core.service.Locator.getInstance().getLookup().getRecentQueryResultData();
  if (goog.isDefAndNotNull(recentQueryResults)) {
    var technologyFacet = /** @type {goog.array.ArrayLike} */ (goog.object.getValueByKeys(recentQueryResults,
        'facets', 'per_project_counts', 'terms'));
    if (goog.isDefAndNotNull(technologyFacet)) {
      goog.array.forEach(technologyFacet, function(item) {
        var projectCode = goog.object.getValueByKeys(item, 'term');
        var count = goog.object.getValueByKeys(item, 'count');
        if (projectMap.hasOwnProperty(projectCode)) {
          projectMap[projectCode] += ' (' + count + ')';
        }
      });
    }
  }
  this.dispatchEvent(
      new org.jboss.core.widget.list.datasource.DataSourceEvent(this.convertCacheToEventDate_(projectMap))
  );
};


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyDataSource.prototype.abort = function() {
  // noop, we are not doing async operation
};


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyDataSource.prototype.isActive = function() {
  return false;
};


/**
 * @param {!Object} data
 * @return {!Array.<org.jboss.core.widget.list.ListItem>}
 * @private
 */
org.jboss.search.page.filter.TechnologyDataSource.prototype.convertCacheToEventDate_ = function(data) {
  var a = [];
  for (var property in data) {
    if (data.hasOwnProperty(property)) {
      a.push(new org.jboss.core.widget.list.ListItem(property, data[property]));
    }
  }
  return a;
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
   * @type {!org.jboss.search.page.filter.TechnologyDataSource}
   * @private
   */
  this.queryContextDataSource_ = new org.jboss.search.page.filter.TechnologyDataSource();

  /**
   * @type {!org.jboss.core.widget.list.datasource.EchoDataSource}
   * @private
   */
  this.didYouMeanDataSource_ = new org.jboss.core.widget.list.datasource.EchoDataSource();

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.queryContextDSListenerId_ = goog.events.listen(
      this.queryContextDataSource_,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      function(event) {
        var e = /** @type {org.jboss.core.widget.list.datasource.DataSourceEvent} */ (event);
        var model = lmc.getListModelById(org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS.QUERY_CONTEXT);
        if (model != null) {
          model.setData(e.getData());
        }
      },
      false, this
      );

  /**
   * @type {goog.events.Key}
   * @private
   */
  this.didYouMeanDSListenerId_ = goog.events.listen(
      this.didYouMeanDataSource_,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      function(event) {
        var e = /** @type {org.jboss.core.widget.list.datasource.DataSourceEvent} */ (event);
        var model = lmc.getListModelById(org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS.DID_YOU_MEAN);
        if (model != null) {
          model.setData(e.getData());
        }
      },
      false, this
      );

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
  goog.events.unlistenByKey(this.queryContextDSListenerId_);
  goog.events.unlistenByKey(this.didYouMeanDSListenerId_);
  goog.dispose(this.queryContextDataSource_);
  goog.dispose(this.didYouMeanDataSource_);
};


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyFilterController.prototype.input = function(query) {
  // console.log('query >', query);
  this.abortActiveDataResources();
  this.lmc_.depointPointedListItem();
  this.queryContextDataSource_.get(query);
  this.didYouMeanDataSource_.get(query);
};


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyFilterController.prototype.abortActiveDataResources = function() {
  this.abortActiveDataResourcesInternal([this.queryContextDataSource_, this.didYouMeanDataSource_]);
};


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyFilterController.prototype.getActiveDataResourcesCount = function() {
  return this.getActiveDataResourcesCountInternal([this.queryContextDataSource_, this.didYouMeanDataSource_]);
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
        function(e) {
          var event = /** @type {goog.events.Event} */ (e);
          switch (event.type) {
            case org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.UP:
              this.lmc_.pointPreviousListItem();
              break;
            case org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.DOWN:
              this.lmc_.pointNextListItem();
              break;
            case org.jboss.core.widget.list.keyboard.KeyboardListener.EventType.ENTER:
              if (this.lmc_.isAnyItemPointed()) {
                this.lmc_.selectPointedListItem();
              }
              break;
          }
        }, false, this
        );
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
        function(e) {
          var event = /** @type {goog.events.Event} */ (e);
          switch (event.type) {
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSEENTER:
              this.lmc_.pointListItemById(event.target.id);
              break;
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSELEAVE:
              this.lmc_.depointPointedListItem();
              break;
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.CLICK:
              this.lmc_.pointListItemById(event.target.id);
              this.lmc_.selectPointedListItem();
              break;
          }
        }, false, this
        );
  }
};


/**
 * Constants for list keys.
 *
 * @enum {string}
 */
org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS = {
  QUERY_CONTEXT: 'query_context',
  DID_YOU_MEAN: 'did_you_mean'
};



/**
 * Create a new technology filter.
 * It requires an element as a parameter, it assumes there is one element with class='filter_items' found inside.
 * @param {!HTMLElement} element to host the technology filter
 * @param {!HTMLInputElement} query_field to host the technology filter
 * @param {!HTMLDivElement} technology_filter_items_div where projects are listed
 * @param {function(): boolean=} opt_isCollapsed a function that is used to learn if filter is collapsed
 * @param {Function=} opt_expandFilter a function that is used to show/expand the filter DOM elements
 * @param {Function=} opt_collapseFilter a function that is used to hide/collapse the filter DOM elements
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.filter.TechnologyFilter = function(element, query_field, technology_filter_items_div,
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
   * @type {!HTMLElement}
   * @private
   */
  this.items_div_ = technology_filter_items_div;

  /**
   * @type {!HTMLInputElement}
   * @private */
  this.query_field_ = query_field;

  /**
   * Create a ListWidget ...
   * @type {org.jboss.core.widget.list.ListController}
   * @private
   */
  this.technologyListWidget_ = org.jboss.core.widget.list.ListWidgetFactory.build({
    lists: [
      { key: org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS.DID_YOU_MEAN, caption: 'Did You Mean?' },
      { key: org.jboss.search.page.filter.TechnologyFilterController.LIST_KEYS.QUERY_CONTEXT, caption: 'All Technologies' }
    ],
    controllerConstructor: org.jboss.search.page.filter.TechnologyFilterController,
    attach: this.items_div_
  });
  // ... and set keyboard and mouse listeners for it
  this.keyboardListener_ = new org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener(this.query_field_);
  this.mouseListener_ = new org.jboss.core.widget.list.mouse.MouseListener(this.items_div_);
  this.technologyListWidget_.setKeyboardListener(this.keyboardListener_);
  this.technologyListWidget_.setMouseListener(this.mouseListener_);

  this.queryFieldListenerKey_ = goog.events.listen(
      new goog.events.KeyHandler(this.query_field_),
      [
        goog.events.KeyHandler.EventType.KEY
      ],
      function(event) {
        if (goog.events.KeyCodes.isTextModifyingKeyEvent(/** @type {goog.events.BrowserEvent} */ (event))) {
          goog.async.nextTick(
              function() {
                this.technologyListWidget_.input(this.query_field_.value);
              }, this
          );
        }
      }, false, this
      );

};
goog.inherits(org.jboss.search.page.filter.TechnologyFilter, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.search.page.filter.TechnologyFilter.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.TechnologyFilter.superClass_.disposeInternal.call(this);

  goog.events.unlistenByKey(this.queryFieldListenerKey_);

  // dispose ListWidget related objects
  goog.dispose(this.technologyListWidget_);
  goog.dispose(this.keyboardListener_);
  goog.dispose(this.mouseListener_);

  delete this.items_div_;
  delete this.query_field_;
  delete this.expandFilter_;
  delete this.collpaseFilter_;
};


/**
 * Refresh filter items (meaning update to the latest search result data). By default
 * this does nothing if the filter is collapsed.
 * @param {boolean=} opt_force refresh even if filter is collapsed. Defaults to false.
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.refreshItems = function(opt_force) {
  var force = !!(opt_force || false);
  if (!this.isCollapsed_() || force) {
    var data = org.jboss.core.service.Locator.getInstance().getLookup().getRecentQueryResultData();
    if (goog.isDefAndNotNull(data) &&
        goog.isArray(goog.object.getValueByKeys(data, ['facets', 'per_project_counts', 'terms']))) {
      this.updateItems_(data.facets.per_project_counts.terms);
    } else {
      this.updateItems_([]);
    }
  }
};


/**
 * (Re)generate HTML of filter items
 * @param {Array} data
 * @private
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.updateItems_ = function(data) {
  // scroll to top when changing the content of the filter
  if (this.items_div_.scrollTop && goog.isNumber(this.items_div_.scrollTop)) {
    this.items_div_.scrollTop = 0;
  }
  // TODO: should be handled by ListWidget
  // var html = org.jboss.search.page.filter.templates.project_filter_top_items({ 'terms': data });
  // this.items_div_.innerHTML = html;
};


/**
 * Calls opt_expandFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.expandFilter = function() {
  this.expandFilter_();
  this.refreshItems();
};


/**
 * Calls opt_collapseFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.collapseFilter = function() {
  this.collpaseFilter_();
};


/**
 * Populate a new items into the filter. Drops all existing.
 * @param {Array.<{name: string, code: string}>} items
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.replaceItems = function(items) {
  // TODO: check this is not called!
  if (goog.isDefAndNotNull(items)) {
    var html = org.jboss.search.page.filter.templates.project_filter_items(
        { 'items': items, 'did_you_mean_items': null });
    this.items_div_.innerHTML = html;
  }
};


/**
 * @type {goog.Uri}
 * @const
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.PROJECT_SUGGESTIONS_URI =
    goog.Uri.parse(org.jboss.search.Constants.API_URL_SUGGESTIONS_PROJECT);


/**
 * Prototype URI
 * @return {goog.Uri} Project name suggestions service URI
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.getProjectSuggestionsUri = function() {
  return this.PROJECT_SUGGESTIONS_URI.clone();
};


/**
 *
 * @param {string} query
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.getSuggestions = function(query) {

  var lookup_ = org.jboss.core.service.Locator.getInstance().getLookup();

  var xhrManager = lookup_.getXhrManager();
  xhrManager.abort(org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_ID, true);

  if (goog.string.isEmptySafe(query)) {
    this.init();
    return;
  }

  var query_url_string = /** @type {string} */ (org.jboss.core.util.urlGenerator.projectNameSuggestionsUrl(
      this.getProjectSuggestionsUri(), query, 20));

  xhrManager.send(
      org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_ID,
      query_url_string,
      org.jboss.core.Constants.GET,
      '', // post_data
      {}, // headers_map
      org.jboss.search.Constants.PROJECT_SUGGESTIONS_REQUEST_PRIORITY,
      // callback, The only param is the event object from the COMPLETE event.
      goog.bind(function(e) {
        var event = /** @type {goog.net.XhrManager.Event} */ (e);
        if (event.target.isSuccess()) {
          var response = /** @type {{responses: {length: number}}} */ (event.target.getResponseJson());
          var ngrams = /** @type {{length: number}} */ (goog.object.getValueByKeys(response['responses'][0], 'hits', 'hits'));
          var fuzzy = /** @type {{length: number}} */ (goog.object.getValueByKeys(response['responses'][1], 'hits', 'hits'));
          // console.log('ngrams',ngrams);
          // console.log('fuzzy',fuzzy);
          var output = org.jboss.search.response.normalizeProjectSuggestionsResponse(ngrams, fuzzy);
          var html = org.jboss.search.page.filter.templates.project_filter_items(output);
          this.items_div_.innerHTML = html;
        } else {
          // Project info failed to load.
          // TODO: fire event with details...
          // console.log('failed!');
        }
      }, this)
  );
};


/**
 * Initialization of technology filter, it pulls project array from lookup.
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.init = function() {
  var lookup_ = org.jboss.core.service.Locator.getInstance().getLookup();
//  this.replaceItems(lookup_.getProjectArray());
};


/**
 * @return {!Object.<(goog.events.KeyCodes|number), function(goog.events.KeyEvent, goog.async.Delay)>}
 * @private
 */
org.jboss.search.page.filter.TechnologyFilter.prototype.getPresetKeyHandlers_ = function() {

  /**
   * @param {goog.events.KeyEvent} event
   * @param {goog.async.Delay} delay
   */
  var keyCodeEscHandler = goog.bind(function(event, delay) {
    if (!event.repeat) {
      if (this.query_field_.value != '') {
        delay.stop();
        this.query_field_.value = '';
        // we can not call init() directly because we want to abort previous request (if there is any)
        this.getSuggestions('');
      } else {
        this.collapseFilter();
      }
    }
  }, this);

  /**
   * @param {goog.events.KeyEvent} event
   * @param {goog.async.Delay} delay
   */
  var keyCodeDownHandler = goog.bind(function(event, delay) {
    event.preventDefault();
    // if (this.query_suggestions_view.isVisible()) {
    //   this.query_suggestions_view.selectNext();
    // }
  }, this);

  /**
   * @param {goog.events.KeyEvent} event
   * @param {goog.async.Delay} delay
   */
  var keyCodeUpHandler = goog.bind(function(event, delay) {
    event.preventDefault();
    // if (this.query_suggestions_view.isVisible()) {
    //   this.query_suggestions_view.selectPrevious();
    // }
  }, this);

  /**
   * @param {goog.events.KeyEvent} event
   * @param {goog.async.Delay} delay
   */
  var keyCodeTabHandler = goog.bind(function(event, delay) {
    // do we need TAB handler?
    event.preventDefault();
    // delay.stop();
    // this.hideAndCleanSuggestionsElementAndModel_();
  }, this);

  /**
   * @param {goog.events.KeyEvent} event
   * @param {goog.async.Delay} delay
   */
  var keyCodeEnterHandler = goog.bind(function(event, delay) {

  }, this);

  // prepare keyHandlers for the main search field
  var keyHandlers = {};

  keyHandlers[goog.events.KeyCodes.ESC] = keyCodeEscHandler;
  keyHandlers[goog.events.KeyCodes.UP] = keyCodeUpHandler;
  keyHandlers[goog.events.KeyCodes.DOWN] = keyCodeDownHandler;
  keyHandlers[goog.events.KeyCodes.ENTER] = keyCodeEnterHandler;

  // TAB key does not seem to yield true in @see {goog.events.KeyCodes.isTextModifyingKeyEvent}
  // thus we have to handle it
  keyHandlers[goog.events.KeyCodes.TAB] = keyCodeTabHandler;

  return keyHandlers;

};
