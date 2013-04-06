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
 * @fileoverview Custom extension of goog.net.ImageLoader that does not pre-load images.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.util.ImageLoader');

goog.require('goog.net.ImageLoader');

/**
 * The default extension of <code>goog.net.ImageLoader</code>.
 * The surprise is that it does nothing (i.e. it does not load or pre-cache images), it is just a stub!
 * The idea is to provide custom ImageLoader implementation that is less resource intensive
 * when network connectivity is slow or when used in mobile devices.
 * @constructor
 * @extends {goog.net.ImageLoader}
 */
org.jboss.search.util.ImageLoader = function() {
    goog.net.ImageLoader.call(this);
};
goog.inherits(org.jboss.search.util.ImageLoader, goog.net.ImageLoader);

/** @inheritDoc */
org.jboss.search.util.ImageLoader.prototype.disposeInternal = function() {
    org.jboss.search.util.ImageLoader.superClass_.disposeInternal.call(this);
};

/** @override */
org.jboss.search.util.ImageLoader.prototype.addImage = function(id, image) {
    // do nothing...
};