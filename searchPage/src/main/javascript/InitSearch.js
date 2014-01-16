/**
 * @preserve
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

goog.provide('init.search');

goog.require("org.jboss.core.service.Locator");
goog.require("org.jboss.search.service.LookUp");
goog.require('org.jboss.search.App');
goog.require('org.jboss.search.logging.Logging');

{

	new org.jboss.core.service.Locator(new org.jboss.search.service.LookUp());

    new org.jboss.search.logging.Logging(
		org.jboss.core.service.Locator.getInstance().getLookup().getHistory()
	);
    new org.jboss.search.App();
}
