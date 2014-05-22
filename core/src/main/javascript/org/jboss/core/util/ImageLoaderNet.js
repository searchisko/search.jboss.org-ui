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
 * @fileoverview Implementation of ImageLoader that do pre-load images.
 *
 * @author lvlcek@redhat.com (Lukas Vlcek)
 */

goog.provide('org.jboss.core.util.ImageLoaderNet');

goog.require('goog.events.EventTarget');
goog.require('goog.net.ImageLoader');
goog.require('org.jboss.core.util.ImageLoader');



/**
 * Construct new Image loader.  This image loader uses internal instance of {@see goog.net.ImageLoader}
 * to do the real work.
 * @constructor
 * @implements {org.jboss.core.util.ImageLoader}
 * @extends {goog.events.EventTarget}
 * @final
 */
org.jboss.core.util.ImageLoaderNet = function() {
  goog.events.EventTarget.call(this);

  /**
   * @type {goog.net.ImageLoader}
   * @private
   */
  this.imageLoader_ = new goog.net.ImageLoader();
};
goog.inherits(org.jboss.core.util.ImageLoaderNet, goog.events.EventTarget);


/** @inheritDoc */
org.jboss.core.util.ImageLoaderNet.prototype.disposeInternal = function() {
  // Call the superclass's disposeInternal() method.
  org.jboss.core.util.ImageLoaderNet.superClass_.disposeInternal.call(this);
  goog.dispose(this.imageLoader_);
};


/** @inheritDoc */
org.jboss.core.util.ImageLoaderNet.prototype.start = function() {
  this.imageLoader_.start();
};


/** @inheritDoc */
org.jboss.core.util.ImageLoaderNet.prototype.addImage = function(id, image) {
  this.imageLoader_.addImage(id, image);
};
