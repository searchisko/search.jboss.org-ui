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
 * @fileoverview This object is a container of other objects that are shared through the application lifecycle.
 * We do not want to pass those objects as parameters. So for now we are using this trivial implementation.
 * Be careful about what you put into LookUp (possible memory leaks!).
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.LookUp');

goog.require('goog.net.XhrManager');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.net.XhrManager.Request');

/**
 * @constructor
 */
org.jboss.search.LookUp = function() {

    /**
     * @type {Object}
     * @private
     */
    this.projectMap_;

    /**
     * @type {goog.net.XhrManager}
     * @private
     */
    this.xhrManager_;

};
goog.addSingletonGetter(org.jboss.search.LookUp);

/**
 * @return {Object}
 */
org.jboss.search.LookUp.prototype.getProjectMap = function() {
    if (goog.isDefAndNotNull(this.projectMap_)){
        return this.projectMap_;
    } else {
        throw new Error("ProjectMap hasn't been set yet!");
    }
};

/**
 * @param {Object} projectMap
 */
org.jboss.search.LookUp.prototype.setProjectMap = function(projectMap) {
    this.projectMap_ = projectMap;
};

/**
 * Return instance of XhrManager.
 * It is a singleton instance at the application level.
 * @return {!goog.net.XhrManager}
 */
org.jboss.search.LookUp.prototype.getXhrManager = function() {
    if (!goog.isDefAndNotNull(this.xhrManager_)) {
        this.xhrManager_ = new goog.net.XhrManager();
    }
    return this.xhrManager_;
};
