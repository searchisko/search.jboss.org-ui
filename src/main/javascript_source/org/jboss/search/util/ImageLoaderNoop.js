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
 * @fileoverview Implementation of ImageLoader that does nothing.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.util.ImageLoaderNoop');

goog.require('org.jboss.search.util.ImageLoader');

/**
 * This ImageLoader implementation does nothing. I.e. no image pre-loading.
 * It is a good candidate for use when resources are limited.
 * @constructor
 * @implements {org.jboss.search.util.ImageLoader}
 * @final
 */
org.jboss.search.util.ImageLoaderNoop = function() {};

/** @inheritDoc */
org.jboss.search.util.ImageLoaderNoop.prototype.start = function () {
	// noop
};

/** @inheritDoc */
org.jboss.search.util.ImageLoaderNoop.prototype.addImage = function (id, image) {
	// noop
};