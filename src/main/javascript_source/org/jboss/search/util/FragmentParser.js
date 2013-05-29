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
 * @fileoverview Utility to parse URL fragment.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.util.fragmentParser');
goog.provide('org.jboss.search.util.fragmentParser.UI_param');
goog.provide('org.jboss.search.util.fragmentParser.UI_param_suffix');
goog.provide('org.jboss.search.util.fragmentParser.INTERNAL_param');

goog.require('org.jboss.search.context.RequestParams');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.date');
goog.require('goog.date.DateTime');

/**
 * Keys of the URL fragment parameters are translated to the following keys that are used internally.
 * @enum {string}
 */
org.jboss.search.util.fragmentParser.INTERNAL_param = {
    QUERY: "query",
    PAGE : "page",
    FROM : "from",
    TO   : "to",
    LOG  : "log"
};

/**
 * URL fragment parameters used in the web UI.
 * @enum {string}
 */
org.jboss.search.util.fragmentParser.UI_param = {
    QUERY: "q",
    PAGE : "page",
    FROM : "from",
    TO   : "to",
    LOG  : "log"
};

/**
 * URL fragment parameters used in the web UI with '=' suffix
 * @enum {string}
 */
org.jboss.search.util.fragmentParser.UI_param_suffix = {
    QUERY: org.jboss.search.util.fragmentParser.UI_param.QUERY+"=",
    PAGE : org.jboss.search.util.fragmentParser.UI_param.PAGE+"=",
    FROM : org.jboss.search.util.fragmentParser.UI_param.FROM+"=",
    TO   : org.jboss.search.util.fragmentParser.UI_param.TO+"=",
    LOG  : org.jboss.search.util.fragmentParser.UI_param.LOG+"="
};

/**
 * Extract named parameters from URL fragment and return them as an object.
 * @param {string=} opt_fragment
 * @return {!org.jboss.search.context.RequestParams}
 */
org.jboss.search.util.fragmentParser.parse = function(opt_fragment) {

    var parsed = {};
    var intp_ = org.jboss.search.util.fragmentParser.INTERNAL_param;

    if (goog.isDef(opt_fragment) && !goog.string.isEmptySafe(opt_fragment)) {
        var parts = goog.string.trim(/** @type {string} */ (opt_fragment)).split('&');
        var p_ = org.jboss.search.util.fragmentParser.UI_param_suffix;

        goog.array.forEach(parts, function(part){

            // ------------------- QUERY --------------------
            if (goog.string.caseInsensitiveStartsWith(part, p_.QUERY)) {
                parsed[intp_.QUERY] = goog.string.trim(
                    goog.string.urlDecode(
                        goog.string.removeAt(part, 0, p_.QUERY.length)
                    )
                )
            } else
            // ------------------- PAGE ---------------------
            if (goog.string.caseInsensitiveStartsWith(part, p_.PAGE)) {
                try {
                    var n_ = parseInt(
                        goog.string.trim(
                            goog.string.urlDecode(
                                goog.string.removeAt(part, 0, p_.PAGE.length)
                            )
                        )
                        ,10);
                    if (goog.isNumber(n_) && !isNaN(n_)) {
                        parsed[intp_.PAGE] = n_;
                    }
                } catch (e) {
                    // ignore invalid URL parameter
                }
            } else
            // ------------------- FROM ---------------------
            if (goog.string.caseInsensitiveStartsWith(part, p_.FROM)) {
                try {
                    var fromDateTime_ = goog.string.trim(
                        goog.string.urlDecode(
                            goog.string.removeAt(part, 0, p_.FROM.length)
                        )
                    )
                    parsed[intp_.FROM] = goog.date.fromIsoString(fromDateTime_);
                } catch (error) {
                    // TODO: log?
                }
            } else
            // ------------------- TO -----------------------
            if (goog.string.caseInsensitiveStartsWith(part, p_.TO)) {
                try {
                    var toDateTime_= goog.string.trim(
                        goog.string.urlDecode(
                            goog.string.removeAt(part, 0, p_.TO.length)
                        )
                    )
                    parsed[intp_.TO] = goog.date.fromIsoString(toDateTime_);
                } catch (error) {
                    // TODO: log?
                }
            } else
            // ------------------- LOG ----------------------
            if (goog.string.caseInsensitiveStartsWith(part, p_.LOG)) {
                var l_ = goog.string.trim(
                    goog.string.urlDecode(
                        goog.string.removeAt(part, 0, p_.LOG.length)
                    )
                )
                if (!goog.string.isEmptySafe(l_)) {
                    parsed[intp_.LOG] = l_;
                }
            }
        });
    }
    return new org.jboss.search.context.RequestParams(
        parsed[intp_.QUERY],
        parsed[intp_.PAGE],
        parsed[intp_.FROM],
        parsed[intp_.TO],
        parsed[intp_.LOG]
    );
};