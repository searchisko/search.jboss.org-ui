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
 * @fileoverview Static Gravatar utilities.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
goog.provide('org.jboss.core.util.gravatar');

goog.require('goog.memoize');
goog.require('goog.crypt');
goog.require('goog.crypt.Md5');
goog.require('goog.format.EmailAddress');

/**
 * @type {goog.crypt.Md5}
 * @private
 */
org.jboss.core.util.gravatar.md5_ = new goog.crypt.Md5();

/**
 * Implements Gravatar HASH function.
 * {@see https://en.gravatar.com/site/implement/hash/}
 * @param {string} email
 * @return {string}
 */
org.jboss.core.util.gravatar.gravatarEmailHash = function(email) {
	var email_ = goog.isDefAndNotNull(email) ? email : "";
	if (goog.isFunction(email.toLowerCase)) { email_ = email_.toLowerCase() }
	var e = goog.format.EmailAddress.parse(email_).getAddress();
	var md5 = org.jboss.core.util.gravatar.md5_;
	md5.reset();
	md5.update(e);
	e = goog.crypt.byteArrayToHex(md5.digest());
	return e;
};

/**
 * Memoized version of {@see gravatarEmailHash}.
 * @type {function(string): string}
 */
org.jboss.core.util.gravatar.gravatarEmailHash_Memo = goog.memoize(org.jboss.core.util.gravatar.gravatarEmailHash);

/**
 * Return complete URL link to the Gravatar image.
 * {@see https://en.gravatar.com/site/implement/images/}
 * @param {string} email
 * @param {number=} opt_size defaults to 40px
 * @return {String}
 */
org.jboss.core.util.gravatar.gravatarURI = function(email, opt_size) {

	var size = opt_size;
	if (!goog.isNumber(size)) {
		size = 40;
	}
	var hash = org.jboss.core.util.gravatar.gravatarEmailHash_Memo(email);
	return new String(
		[
			["http://www.gravatar.com/avatar/",hash,"?s=",size].join(''),
			["d=",goog.string.urlEncode(["https://community.jboss.org/gravatar/",hash,"/",size,".png"].join(''))].join('')
		].join('&')
	);
};

/**
 * Memoized version of {@see gravatarURI}.
 * @type {function(string, number=): String}
 */
org.jboss.core.util.gravatar.gravatarURI_Memo = goog.memoize(org.jboss.core.util.gravatar.gravatarURI);