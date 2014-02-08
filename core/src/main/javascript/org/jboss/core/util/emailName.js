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
 * @fileoverview Static email name utilities.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.core.util.emailName');

goog.require('goog.string');
goog.require('goog.format.EmailAddress');

/**
 * Try to extract name from email address. If not possible return original email value.
 * @param {string} email
 * @return {string}
 */
org.jboss.core.util.emailName.extractNameFromMail = function(email) {
	var email_ = goog.isDefAndNotNull(email) ? email : "";
	var parsed = goog.format.EmailAddress.parse(email_);
	var e = parsed.getName();
	if (goog.string.isEmptySafe(e)) {
		return parsed.getAddress();
	} else {
		return e;
	}
};