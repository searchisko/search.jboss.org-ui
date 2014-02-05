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
 * Going forward we might consider using more robust service locator. For example it might be worth looking at
 * {@link https://github.com/rhysbrettbowen/Loader}. A blog post about this can be found at
 * {@link http://modernjavascript.blogspot.cz/2012/10/dependency-injection-in-closure-ioc.html}.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.core.service.LookUp');

goog.require('org.jboss.core.service.query.QueryService');
goog.require('org.jboss.core.service.query.QueryServiceDispatcher');
goog.require('org.jboss.core.util.ImageLoader');

goog.require('goog.History');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeParse');
goog.require('goog.net.XhrManager');

/**
 * @interface
 */
org.jboss.core.service.LookUp = function() {};

/**
 * Return instance of XhrManager.
 * It is a singleton instance at the application level.
 * @return {!goog.net.XhrManager}
 */
org.jboss.core.service.LookUp.prototype.getXhrManager = function() {};

/**
 * Return instance of goog.History.
 * It is a singleton instance at the application level.
 * @return {!goog.History}
 */
org.jboss.core.service.LookUp.prototype.getHistory = function() {};

/**
 * Return instance of ImageLoader.
 * It is a singleton instance at the application level.
 * By default it return <code>org.jboss.search.util.ImageLoaderNoop</code> which does not do any image pre-loading,
 * if you want pre-load images then you need to set different implementation of ImageLoader via #setImageLoader.
 * @return {!org.jboss.core.util.ImageLoader}
 */
org.jboss.core.service.LookUp.prototype.getImageLoader = function() {};

/**
 * @param {!org.jboss.core.util.ImageLoader} imageLoader
 */
org.jboss.core.service.LookUp.prototype.setImageLoader = function(imageLoader) {};

/**
 * DateFormatter using {@link org.jboss.core.Variables.SHORT_DATE_FORMAT}.
 * Formatter uses local client time zone.
 * @return {!goog.i18n.DateTimeFormat}
 */
org.jboss.core.service.LookUp.prototype.getShortDateFormatter = function() {};

/**
 * DateFormatter using {@link org.jboss.core.Variables.MEDIUM_DATE_FORMAT}.
 * Formatter uses local client time zone.
 * @return {!goog.i18n.DateTimeFormat}
 */
org.jboss.core.service.LookUp.prototype.getMediumDateFormatter = function() {};

/**
 * @return {!goog.i18n.DateTimeParse}
 */
org.jboss.core.service.LookUp.prototype.getShortDateParser = function() {};

/**
 * @param {org.jboss.core.service.query.QueryService} queryService
 */
org.jboss.core.service.LookUp.prototype.setQueryService = function(queryService) {};

/**
 * @return {org.jboss.core.service.query.QueryService}
 */
org.jboss.core.service.LookUp.prototype.getQueryService = function() {};

/**
 * Return QueryServiceDispatcher.
 * @return {!org.jboss.core.service.query.QueryServiceDispatcher}
 */
org.jboss.core.service.LookUp.prototype.getQueryServiceDispatcher = function() {};
