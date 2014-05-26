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
 * @fileoverview A factory method to produce {@link ListController}s.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.widget.list.ListWidgetFactory');

goog.require('goog.array');
goog.require('org.jboss.core.widget.list.ListController');
goog.require('org.jboss.core.widget.list.ListModel');
goog.require('org.jboss.core.widget.list.ListModelContainer');
goog.require('org.jboss.core.widget.list.ListView');
goog.require('org.jboss.core.widget.list.ListViewContainer');


/**
 * Factory method to create a new controller instance.
 * <ul>
 *     <li> lists: array of tuples: key, caption (caption is optional)
 *     <li> controllerConstructor: reference to constructor of object extending {@link ListController}
 *     <li> additionalConstructorParams: if constructor accepts additional parameters (except mandatory lmc and lvc) then supply array with them here (optional)
 *     <li> attach: which HTML Element to render the view to
 * </ul>
 *
 * See ListWidgetFactory_test.js for example.
 *
 * @param {{
 *    lists: !Array.<{key: string, caption: string}>,
 *    controllerConstructor: !function(new:org.jboss.core.widget.list.ListController, org.jboss.core.widget.list.ListModelContainer, org.jboss.core.widget.list.ListViewContainer, ...[*]),
 *    additionalConstructorParams: (?Array.<*>|undefined),
 *    attach: !Element
 *   }} conf
 * @return {org.jboss.core.widget.list.ListController}
 */
org.jboss.core.widget.list.ListWidgetFactory.build = function(conf) {

  var modelArray = [];
  var viewArray = [];
  var justKeys = goog.array.map(conf.lists, function(item) { return item.key; });
  var uniqueKeys = [];

  goog.array.removeDuplicates(justKeys, uniqueKeys);
  goog.array.forEach(uniqueKeys, function(key) {
    modelArray.push(
        new org.jboss.core.widget.list.ListModel(
        key,
        goog.array.find(
            conf.lists, function(item) {
              return item.key == key;
            }
        ).caption
        )
    );
    viewArray.push(
        new org.jboss.core.widget.list.ListView(
        key,
        goog.array.find(
            conf.lists, function(item) {
              return item.key == key;
            }
        ).caption
        )
    );
  }, org.jboss.core.widget.list.ListWidgetFactory);

  var lmc = new org.jboss.core.widget.list.ListModelContainer(modelArray);
  var lvc = new org.jboss.core.widget.list.ListViewContainer(viewArray, lmc, conf.attach);

  var controller;
  if (goog.isDefAndNotNull(conf.additionalConstructorParams)) {
    // if there are additional constructor parameters then we do a bit of magic...
    // prepare new arguments
    var args = conf.additionalConstructorParams.slice(0);
    goog.array.splice(args, 0, 0, lmc, lvc);
    // create a new object using constructor and new arguments
    controller = /** @type {org.jboss.core.widget.list.ListController} */ (Object.create(conf.controllerConstructor.prototype));
    conf.controllerConstructor.apply(controller, args);
  } else {
    controller = new conf.controllerConstructor(lmc, lvc);
  }

  return controller;
};
