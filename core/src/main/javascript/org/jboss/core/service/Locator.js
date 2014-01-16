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
 * @fileoverview Service Locator. It accepts LookUp instance as a constructor parameter and then
 * allows to access this LookUp instance via global singleton pattern.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.core.service.Locator');

/**
 * Constructor of service Locator. Requires LookUp instance as an argument.
 * This implements a singleton pattern and only one instance of Locator can be created. Any other consecutive call
 * of constructor returns previously instantiated instance.
 * <p/>
 * For the purpose of testing there is a dispose method that releases all resources and allows to instantiate Locator
 * using new LookUp.
 * <p/>
 * The reason why we do not use goog.addSingletonGetter() is that it assumes non-parametric constructor while
 * we want to be able to specify which instance of LookUp is to become global singleton (thus we pass the instance
 * as a constructor parameter to Locator).
 *
 * @param {!T} lookup
 * @constructor
 * @template T
 * @final
 */
org.jboss.core.service.Locator = function(lookup) {

	if (org.jboss.core.service.Locator.instance_) {
		return org.jboss.core.service.Locator.instance_;
	}

	/**
	 * @type {!T}
	 * @private
	 */
	this.lookup_ = lookup;

	/**
	 * @type {org.jboss.core.service.Locator}
	 * @private
	 */
	org.jboss.core.service.Locator.instance_ = this;
};

/**
 * @return {org.jboss.core.service.Locator}
 */
org.jboss.core.service.Locator.getInstance = function() {
	if (!goog.isDef(org.jboss.core.service.Locator.instance_)){
		throw new Error("Locator instance does not exist.");
	}
	return org.jboss.core.service.Locator.instance_;
};

/**
 * @return {!T}
 */
org.jboss.core.service.Locator.prototype.getLookup = function () {
	// This method has to be defined on the prototype level otherwise template T is not recognized
	// and "[Goog.ERROR]: JSC_TYPE_PARSE_ERROR. Bad type annotation. Unknown type T " is fired.
	if (!goog.isDef(org.jboss.core.service.Locator.getInstance().lookup_)) {
		throw new Error("Lookup not initiated.");
	}
	return org.jboss.core.service.Locator.getInstance().lookup_;
};

/**
 * Disposes. This method should be used only in tests.
 */
org.jboss.core.service.Locator.dispose = function() {
	if (goog.isDef(org.jboss.core.service.Locator.instance_) &&
		goog.isDef(org.jboss.core.service.Locator.getInstance().lookup_)) {
		delete org.jboss.core.service.Locator.getInstance().lookup_;
		delete org.jboss.core.service.Locator.instance_;
	}
};