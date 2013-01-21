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
 * @fileoverview
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
goog.provide('org.jboss.search.response');

goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.format.EmailAddress');
goog.require('goog.crypt');
goog.require('goog.crypt.Md5');
goog.require('goog.memoize');

/**
 * It returns normalized and sanitized response.
 * @param {!Object} response raw response from DCP search API.
 * @param {?string} query related user query
 * @return {!Object}
 */
org.jboss.search.response.normalize = function(response, query) {

    var output = {};

    output['user_query'] = goog.isDefAndNotNull(query) ? query : "";

    if (goog.object.containsKey(response,'hits')) {
        output['hits'] = response['hits'];
    }

    if (goog.object.containsKey(response,'timed_out')) {
        output['timed_out'] = response['timed_out'];
    }

    return output;

};

/**
 * TODO temporary only! Remove once we have better data in DCP.
 * @private
 * @return {*}
 */
org.jboss.search.response.getDummyHits = function() {


    var hit1 = {
        dcp_type: '',
        dcp_project: 'Hibernate',
        dcp_contributors: [],
        dcp_tags: [],
        dcp_title: '',
        dcp_url_view: '',
        dcp_description: '',
        dcp_activity_dates: []
    };
    var hit2 = {};
    var hit3 = {};
    var hit4 = {};

    var source = [hit1, hit2, hit3, hit4];

    var hits = [];

    for (var i = 0; i < 10; i++) {
        hits[i] = source[Math.floor(Math.random() * source.length) + 1];
    }

    return hits;

};

/**
 * @private
 * @type {goog.crypt.Md5}
 */
org.jboss.search.response.md5 = new goog.crypt.Md5();

/**
 * Implements Gravatar HASH function.
 * {@see https://en.gravatar.com/site/implement/hash/}
 * @param {string} email
 * @return {string}
 */
org.jboss.search.response.gravatarEmailHash = function(email) {

    var email_ = goog.isDefAndNotNull(email) ? email : "";
    if (goog.isFunction(email.toLowerCase)) { email_ = email_.toLowerCase() }
    var e = goog.format.EmailAddress.parse(email_).getAddress();

    this.md5.reset();
    this.md5.update(e);
    e = goog.crypt.byteArrayToHex(this.md5.digest());

    return e;
};

/**
 * Return complete URL link to the Gravatar image.
 * {@see https://en.gravatar.com/site/implement/images/}
 * @param {string} email
 * @param {number=} opt_size defaults to 40px
 * @return {String}
 */
org.jboss.search.response.gravatarURI = function(email, opt_size) {

    var size = opt_size;
    if (!goog.isNumber(size)) {
        size = 40;
    }
    var hash = org.jboss.search.response.gravatarEmailHash(email);
    return new String("http://www.gravatar.com/avatar/"+hash+"?s="+size);
};

/**
 * Memoized version of {@see gravatarURI}.
 * @type {*|!Function(string, number=):String}
 */
org.jboss.search.response.gravatarURI_Memo = goog.memoize(org.jboss.search.response.gravatarURI);

/**
 * TODO consider implementing SBS avatars as well.
 * {@see https://docspace.corp.redhat.com/docs/DOC-55303}
 * @param {string} email
 * @param {number=} opt_size
 * @return {string}
 */
org.jboss.search.response.sbsGravatarURI = function(email, opt_size) {

    return "";
};
