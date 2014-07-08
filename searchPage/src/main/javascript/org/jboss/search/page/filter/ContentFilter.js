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
 * @fileoverview Content filter.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.search.page.filter.ContentFilter');
goog.provide('org.jboss.search.page.filter.ContentFilterController');
goog.provide('org.jboss.search.page.filter.ContentFilterController.LIST_KEYS');
goog.provide('org.jboss.search.page.filter.TypeDataSource');

goog.require('goog.array');
goog.require('goog.array.ArrayLike');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.Key');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.object');
goog.require('org.jboss.core.context.RequestParamsFactory');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.core.service.query.QueryService');
goog.require('org.jboss.core.service.query.QueryServiceDispatcher');
goog.require('org.jboss.core.service.query.QueryServiceEventType');
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
goog.require('org.jboss.core.widget.list.mouse.MouseListener');
goog.require('org.jboss.core.widget.list.mouse.MouseListener.EventType');
goog.require('org.jboss.search.page.filter.NewRequestParamsEvent');
goog.require('org.jboss.search.page.filter.NewRequestParamsEventType');



/**
 * Type {@link DataSource}.
 * @constructor
 * @implements {org.jboss.core.widget.list.datasource.DataSource}
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.filter.TypeDataSource = function() {
  goog.events.EventTarget.call(this);

  var lookup_ = org.jboss.core.service.Locator.getInstance().getLookup();

  /**
   * @type {!org.jboss.core.service.query.QueryServiceDispatcher}
   * @private
   */
  this.queryServiceDispatcher_ = lookup_.getQueryServiceDispatcher();

  /**
   * If the search results changes we need to learn about this and update the filter content accordingly.
   * @type {goog.events.Key}
   * @private
   */
  this.updateAfterSearchKey_ = goog.events.listen(
      this.queryServiceDispatcher_,
      [
        org.jboss.core.service.query.QueryServiceEventType.SEARCH_SUCCEEDED
      ],
      function() {
        /** @type {org.jboss.search.page.filter.ContentFilter} */
        var f_ = lookup_.getContentFilter();
        if (goog.isDefAndNotNull(f_) && f_.isExpanded()) {
          this.get();
        }
      }, false, this);

};
goog.inherits(org.jboss.search.page.filter.TypeDataSource, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.search.page.filter.TypeDataSource.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.TypeDataSource.superClass_.disposeInternal.call(this);
  goog.events.unlistenByKey(this.updateAfterSearchKey_);
  delete this.queryServiceDispatcher_;
};


/** @inheritDoc */
org.jboss.search.page.filter.TypeDataSource.prototype.get = function(query) {

  // get all types and get the most recent counts for them (if possible)
  var typeMap = org.jboss.core.service.Locator.getInstance().getLookup().getTypeMapClone();
  var recentQueryResults = org.jboss.core.service.Locator.getInstance().getLookup().getRecentQueryResultData();
  if (goog.isDefAndNotNull(recentQueryResults)) {
    var typeFacet = /** @type {goog.array.ArrayLike} */ (goog.object.getValueByKeys(recentQueryResults,
      'facets', 'per_sys_type_counts', 'terms'));
    if (goog.isDefAndNotNull(typeFacet)) {
      goog.array.forEach(typeFacet, function(item) {
        var typeCode = goog.object.getValueByKeys(item, 'term');
        var count = goog.object.getValueByKeys(item, 'count');
        if (typeMap.hasOwnProperty(typeCode)) {
          typeMap[typeCode] += ' (' + count + ')';
        }
      });
    }
  }

  this.dispatchEvent(
      new org.jboss.core.widget.list.datasource.DataSourceEvent(this.convertCacheToEventData_(typeMap))
  );
};


/** @inheritDoc */
org.jboss.search.page.filter.TypeDataSource.prototype.abort = function() {
  // no-op, we are not doing async operation
};


/** @inheritDoc */
org.jboss.search.page.filter.TypeDataSource.prototype.isActive = function() {
  return false;
};


/**
 * @param {!Object} data
 * @return {!Array.<org.jboss.core.widget.list.ListItem>}
 * @private
 */
org.jboss.search.page.filter.TypeDataSource.prototype.convertCacheToEventData_ = function(data) {
  var a = [];
  for (var property in data) {
    if (data.hasOwnProperty(property)) {
      a.push(new org.jboss.core.widget.list.ListItem(property, data[property]));
    }
  }
  return a;
};



/**
 * ContentFilterController is used to manage behaviour of content filter (aka type filter).
 * Namely it is responsible for displaying type list.
 * It also allow users to do selections from the list.
 *
 * @param {!org.jboss.core.widget.list.ListModelContainer} lmc
 * @param {!org.jboss.core.widget.list.ListViewContainer} lvc
 * @constructor
 * @implements {org.jboss.core.widget.list.ListController}
 * @extends {org.jboss.core.widget.list.BaseListController}
 */
org.jboss.search.page.filter.ContentFilterController = function(lmc, lvc) {
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

  this.listItemSelectedKey_ = goog.events.listen(
      this.getListModelContainer(),
      [
        org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED,
        org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED
      ],
      function(e) {
        var event = /** @type {org.jboss.core.widget.list.event.ListModelEvent} */ (e);
        this.dispatchEvent(event);
      }, false, this
      );

  /**
   * Type (sys_type) data source.
   *
   * @type {!org.jboss.search.page.filter.TypeDataSource}
   * @private
   */
  this.queryContextDataSource_ = new org.jboss.search.page.filter.TypeDataSource();

  /**
   * Subscribe on new data event of Type data source.
   *
   * @type {goog.events.Key}
   * @private
   */
  this.queryContextDSListenerId_ = goog.events.listen(
      this.queryContextDataSource_,
      org.jboss.core.widget.list.datasource.DataSourceEventType.DATA_SOURCE_EVENT,
      function(event) {
        var e = /** @type {org.jboss.core.widget.list.datasource.DataSourceEvent} */ (event);
        var model = this.getListModelContainer().getListModelById(
            org.jboss.search.page.filter.ContentFilterController.LIST_KEYS.QUERY_CONTEXT
            );
        if (model != null) {
          model.setData(e.getData());
        }
      },
      false, this
      );

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
goog.inherits(org.jboss.search.page.filter.ContentFilterController, org.jboss.core.widget.list.BaseListController);


/** @inheritDoc */
org.jboss.search.page.filter.ContentFilterController.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.ContentFilterController.superClass_.disposeInternal.call(this);

  goog.events.unlistenByKey(this.listItemSelectedKey_);
  goog.events.unlistenByKey(this.queryContextDSListenerId_);
  goog.events.unlistenByKey(this.mouseListenerKey_);

  goog.dispose(this.queryContextDataSource_);

  delete this.queryService_;
  delete this.queryServiceDispatcher_;
  delete this.lookup_;
  delete this.mouseListener_;
};


/** @inheritDoc */
org.jboss.search.page.filter.ContentFilterController.prototype.input = function(query) {
  this.abortActiveDataResources();
  this.getListModelContainer().depointPointedListItem();
  this.queryContextDataSource_.get(query);
};


/** @inheritDoc */
org.jboss.search.page.filter.ContentFilterController.prototype.abortActiveDataResources = function() {
  this.abortActiveDataResourcesInternal([this.queryContextDataSource_]);
};


/** @inheritDoc */
org.jboss.search.page.filter.ContentFilterController.prototype.getActiveDataResourcesCount = function() {
  return this.getActiveDataResourcesCountInternal([this.queryContextDataSource_]);
};


/** @inheritDoc */
org.jboss.search.page.filter.ContentFilterController.prototype.setKeyboardListener = function(opt_keyboardListener) {
  // TODO ?
};


/** @inheritDoc */
org.jboss.search.page.filter.ContentFilterController.prototype.setMouseListener = function(opt_mouseListener) {
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
              this.getListModelContainer().pointListItemById(event.target.id);
              break;
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.MOUSELEAVE:
              this.getListModelContainer().depointPointedListItem();
              break;
            case org.jboss.core.widget.list.mouse.MouseListener.EventType.CLICK:
              this.getListModelContainer().pointListItemById(event.target.id);
              this.getListModelContainer().selectPointedListItem();
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
org.jboss.search.page.filter.ContentFilterController.LIST_KEYS = {
  QUERY_CONTEXT: 'query_context'
};



/**
 * Create a new content filter.
 * It requires an element as a parameter, it assumes there is one element with class='filter_items' found inside.
 * @param {!HTMLElement} element to host the content filter
 * @param {!HTMLDivElement} content_filter_items_div where types are listed
 * @param {function(): boolean=} opt_isCollapsed a function that is used to learn if filter is collapsed
 * @param {Function=} opt_expandFilter a function that is used to show/expand the filter DOM elements
 * @param {Function=} opt_collapseFilter a function that is used to hide/collapse the filter DOM elements
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.search.page.filter.ContentFilter = function(element, content_filter_items_div,
                                                      opt_isCollapsed, opt_expandFilter, opt_collapseFilter) {
  goog.events.EventTarget.call(this);
  /**
   * @type {!Function}
   * @private
   */
  this.expandFilter_ = /** @type {!Function} */ (goog.isFunction(opt_expandFilter) ?
      opt_expandFilter : goog.nullFunction());

  /**
   * @type {!Function}
   * @private
   */
  this.collpaseFilter_ = /** @type {!Function} */ (goog.isFunction(opt_collapseFilter) ?
      opt_collapseFilter : goog.nullFunction());

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
  this.items_div_ = content_filter_items_div;

  /**
   * @type {org.jboss.core.widget.list.ListController}
   * @private
   */
  this.contentFilterController_ = org.jboss.core.widget.list.ListWidgetFactory.build({
    lists: [
      {
        caption: 'Document Types',
        key: org.jboss.search.page.filter.ContentFilterController.LIST_KEYS.QUERY_CONTEXT
      }
    ],
    controllerConstructor: org.jboss.search.page.filter.ContentFilterController,
    attach: this.items_div_
  });
  // ... and set keyboard and mouse listeners for it
  // this.keyboardListener_ = new org.jboss.core.widget.list.keyboard.InputFieldKeyboardListener(this.query_field_);
  // this.contentFilterController_.setKeyboardListener(this.keyboardListener_);
  this.mouseListener_ = new org.jboss.core.widget.list.mouse.MouseListener(this.items_div_);
  this.contentFilterController_.setMouseListener(this.mouseListener_);

  this.contentFilterControllerKey_ = goog.events.listen(
      this.contentFilterController_,
      [
        org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_SELECTED,
        org.jboss.core.widget.list.event.ListModelEventType.LIST_ITEM_DESELECTED
      ],
      function(e) {
        var event = /** @type {org.jboss.core.widget.list.event.ListModelEvent} */ (e);
        var data = event.target.getData();
        var index = event.getItemIndex();

        if (index < data.length) {
          /** @type {org.jboss.core.widget.list.ListItem} */
          var selected = data[index];
          var selectedId = selected.getId();
          var rp = org.jboss.core.service.Locator.getInstance().getLookup().getRequestParams();
          if (goog.isDefAndNotNull(rp)) {
            var filterArray = rp.getContentTypes();

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
            // set new sys_types filters and reset page
            var new_rp = rpf.reset().copy(rp).setContentTypes(filterArray).setPage(null).build();
            this.dispatchEvent(
                new org.jboss.search.page.filter.NewRequestParamsEvent(
                    org.jboss.search.page.filter.NewRequestParamsEventType.NEW_REQUEST_PARAMETERS,
                    new_rp)
            );
          }
        }
      }, false, this
      );

  /** @private */
  this.keyHandler_ = new goog.events.KeyHandler(goog.dom.getDocument());

  /**
   * listen for key strokes (see #49)
   * @private
   */
  this.keyListenerId_ = goog.events.listen(this.keyHandler_,
      goog.events.KeyHandler.EventType.KEY,
      goog.bind(function(e) {
        var keyEvent = /** @type {goog.events.KeyEvent} */ (e);
        if (!keyEvent.repeat) {
          if (keyEvent.keyCode == goog.events.KeyCodes.ESC) {
            this.collapseFilter();
          }
        }
      }, this)
      );

};
goog.inherits(org.jboss.search.page.filter.ContentFilter, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.search.page.filter.ContentFilter.prototype.disposeInternal = function() {
  org.jboss.search.page.filter.ContentFilter.superClass_.disposeInternal.call(this);

  goog.events.unlistenByKey(this.contentFilterControllerKey_);
  goog.events.unlistenByKey(this.keyListenerId_);

  goog.dispose(this.contentFilterController_);
  goog.dispose(this.mouseListener_);
  goog.dispose(this.keyHandler_);

  delete this.items_div_;
  delete this.expandFilter_;
  delete this.collpaseFilter_;
};


/**
 * Refresh filter items (meaning update to the latest search result data). By default
 * this does nothing if the filter is collapsed.
 * @param {boolean=} opt_force refresh even if filter is collapsed. Defaults to false.
 */
org.jboss.search.page.filter.ContentFilter.prototype.refreshItems = function(opt_force) {
  var force = !!(opt_force || false);
  if (!this.isCollapsed_() || force) {
    this.contentFilterController_.input('');
  }
};


/**
 * Calls opt_expandFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.ContentFilter.prototype.expandFilter = function() {
  this.refreshItems(true);
  this.expandFilter_();
};


/**
 * Calls opt_collapseFilter function.
 * @see constructor
 */
org.jboss.search.page.filter.ContentFilter.prototype.collapseFilter = function() {
  this.collpaseFilter_();
};


/**
 * Returns true if filter is expanded.
 * @return {boolean}
 */
org.jboss.search.page.filter.ContentFilter.prototype.isExpanded = function() {
  return !this.isCollapsed_();
};
