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
 *  @fileoverview Utility to parse specific values from URL fragment.
 *
 *  @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.util.FragmentParser');

goog.require('goog.array');
goog.require('goog.string');

/**
 *
 * @constructor
 */
org.jboss.search.util.FragmentParser = function() {

};

/**
 * Returns value of 'q' parameter from URL fragment or undefined. Value is URL decoded.
 *
 * @param {string|null|undefined} fragment
 * @return {string|undefined}
 * @deprecated use {@link #parse} instead
 */
org.jboss.search.util.FragmentParser.prototype.getUserQuery = function(fragment) {

    var query = undefined;

    if (!goog.string.isEmptySafe(fragment)) {
        var parts = fragment.trim().split('&');
        var i = goog.array.findIndex(parts, function(part) {
            return goog.string.caseInsensitiveStartsWith(part, "q=") ? true : false;
        });
        if ( i >= 0) {
            var p = parts[i].trim();
            //remove "q=" at the beginning
            return goog.string.urlDecode(goog.string.removeAt(p, 0, 2));
        }
    }

    return query;
};

/**
 * Extract named parameters from URL fragment and return them as an object.
 * @param {String=} opt_fragment
 * @return {!Object}
 */
org.jboss.search.util.FragmentParser.prototype.parse = function(opt_fragment) {

    var parsed = {};

    if (goog.isDef(opt_fragment) && !goog.string.isEmptySafe(opt_fragment)) {
        var parts = opt_fragment.trim().split('&');

        goog.array.forEach(parts, function(part){
            var token = "q=";
            if (goog.string.caseInsensitiveStartsWith(part, token)) {
                parsed['query'] = goog.string.urlDecode(goog.string.trim(goog.string.removeAt(part, 0, token.length)))
            }

            token = "page=";
            if (goog.string.caseInsensitiveStartsWith(part, token)) {
                try {
                    parsed['page'] =
                        parseInt(
                            goog.string.urlDecode(
                                goog.string.trim(
                                    goog.string.removeAt(part, 0, token.length)
                                )
                            )
                        ,10)
                } catch (e) {
                    // TODO add logging
                }
            }

            // TODO use switch
            token = "log=";
            if (goog.string.caseInsensitiveStartsWith(part, token)) {
                parsed['log'] = goog.string.urlDecode(goog.string.trim(goog.string.removeAt(part, 0, token.length)))
            }
        });
    }
    return parsed;
};