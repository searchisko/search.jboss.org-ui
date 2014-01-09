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
 * @fileoverview Image loader interface.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.util.ImageLoader');

/**
 * ImageLoader interface. This allows for multiple implementations that can be switched
 * in context. The idea is to provide custom ImageLoader implementations that are less resource intensive
 * when network connectivity is slow or when used in mobile devices.
 * @interface
 */
org.jboss.search.util.ImageLoader = function() {};

/**
 * @param {string} id The ID of the image to load.
 * @param {string|Image} image Either the source URL of the image or the HTML
 *     image element itself (or any object with a {@code src} property, really).
 */
org.jboss.search.util.ImageLoader.prototype.addImage = function(id, image) {};

/**
 * Starts loading all images in the image loader.
 */
org.jboss.search.util.ImageLoader.prototype.start = function() {};
