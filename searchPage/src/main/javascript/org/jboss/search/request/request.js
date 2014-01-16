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
 * @fileoverview Provides xhr services.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.request');

goog.require('org.jboss.search.Constants');
goog.require('org.jboss.core.service.Locator');
goog.require('org.jboss.search.util.urlGenerator');

goog.require('goog.Uri');

/**
 * Write click stream statistics.
 * It fires async xhr request and we do not care about the results (i.e. we do not care if it fails).
 * @param {goog.Uri} uri
 * @param {string} uuid
 * @param {string} id
 * @param {string=} opt_session
 */
org.jboss.search.request.writeClickStreamStatistics = function(uri, uuid, id, opt_session) {
    var url_string = org.jboss.search.util.urlGenerator.clickStreamUrl(uri, uuid, id, opt_session);
    if (!goog.isNull(url_string)) {
        var xhr = org.jboss.core.service.Locator.getInstance().getLookup().getXhrManager();
        xhr.send(
            org.jboss.search.Constants.WRITE_CLICK_STREAM_STATS_ID,
            // setting the parameter value clears previously set value (that is what we want!)
            url_string,
            org.jboss.search.Constants.POST,
            "", // post_data
            {}, // headers_map
            org.jboss.search.Constants.WRITE_STATS_REQUEST_PRIORITY
        );
    }
};
