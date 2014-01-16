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
 * @fileoverview Deferred that is used to sync on all async initialization. Once all flags are set to true the callback
 * is fired.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.InitDeferred');

goog.require('goog.async.Deferred');

/**
 * Create a new instance.
 * @constructor
 * @extends {goog.async.Deferred}
 * @deprecated
 */
org.jboss.search.InitDeferred = function() {
    goog.async.Deferred.call(this);
    this.dateFilterDone_ = false;
    this.projectFilterDone_ = false;
    this.authorFilterDone_ = false;
    this.contentFilterDone_ = false;
};
goog.inherits(org.jboss.search.InitDeferred, goog.async.Deferred);

/**
 * Set dateFilterDone flag to true.
 */
org.jboss.search.InitDeferred.prototype.setDateFilterDone = function() {
    this.dateFilterDone_ = true;
    this.callCallbackIfAllDone_();
};

/**
 * Set projectFilterDone flag to true.
 */
org.jboss.search.InitDeferred.prototype.setProjectFilterDone = function() {
    this.projectFilterDone_ = true;
    this.callCallbackIfAllDone_();
};

/**
 * Set authorFilterDone flag to true.
 */
org.jboss.search.InitDeferred.prototype.setAuthorFilterDone = function() {
    this.authorFilterDone_ = true;
    this.callCallbackIfAllDone_();
};

/**
 * Set contentFilterDone flag to true.
 */
org.jboss.search.InitDeferred.prototype.setContentFilterDone = function() {
	this.contentFilterDone_ = true;
	this.callCallbackIfAllDone_();
};

/** @private */
org.jboss.search.InitDeferred.prototype.callCallbackIfAllDone_ = function() {
    if (this.dateFilterDone_ && this.projectFilterDone_ && this.authorFilterDone_ && this.contentFilterDone_) {
        this.callback(goog.nullFunction());
    }
};