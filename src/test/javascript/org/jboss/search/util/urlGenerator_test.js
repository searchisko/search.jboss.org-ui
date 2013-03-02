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

goog.require('org.jboss.search.util.urlGenerator');
goog.require('goog.Uri');
goog.require('goog.testing.jsunit');

var testUrlGenerator = function() {

    var root = "http://localhost:1234";
    var url = new goog.Uri(root);
    var g_ = org.jboss.search.util.urlGenerator;


    var urlString;

    urlString = g_.searchUrl(null);
    assertEquals(
        null,
        urlString);

    urlString = g_.searchUrl(url.clone());
    assertEquals(
        [
            root,
            [
                "query",
                "field=dcp_type", "field=dcp_id", "field=dcp_title", "field=dcp_contributors", "field=dcp_project",
                "field=dcp_project_name", "field=dcp_description", "field=dcp_tags", "field=dcp_last_activity_date", "field=dcp_url_view",
                "query_highlight=true"
            ].join('&')
        ].join('?'),
        urlString);

    urlString = g_.searchUrl(url.clone(),' ');
    assertEquals(
        [
            root,
            [
                "query=%20",
                "field=dcp_type", "field=dcp_id", "field=dcp_title", "field=dcp_contributors", "field=dcp_project",
                "field=dcp_project_name", "field=dcp_description", "field=dcp_tags", "field=dcp_last_activity_date", "field=dcp_url_view",
                "query_highlight=true"
            ].join('&')
        ].join('?'),
        urlString);

    urlString = g_.searchUrl(url.clone(), "dummy");
    assertEquals(
        [
            root,
            [
                "query=dummy",
                "field=dcp_type", "field=dcp_id", "field=dcp_title", "field=dcp_contributors", "field=dcp_project",
                "field=dcp_project_name", "field=dcp_description", "field=dcp_tags", "field=dcp_last_activity_date", "field=dcp_url_view",
                "query_highlight=true"
            ].join('&')
        ].join('?'),
        urlString);

    urlString = g_.searchUrl(url.clone(), "dummy", undefined, undefined, 20);
    assertEquals(
        [
            root,
            [
                "query=dummy",
                "field=dcp_type", "field=dcp_id", "field=dcp_title", "field=dcp_contributors", "field=dcp_project",
                "field=dcp_project_name", "field=dcp_description", "field=dcp_tags", "field=dcp_last_activity_date", "field=dcp_url_view",
                "query_highlight=true",
                "from=190"
            ].join('&')
        ].join('?'),
        urlString);

    urlString = g_.searchUrl(url.clone(), "dummy", [''], false);
    assertEquals(
        [
            root,
            [
                "query=dummy",
                "field",
                "query_highlight=false"
            ].join('&')
        ].join('?'),
        urlString);

    urlString = g_.searchUrl(url.clone(), "dummy", [], false);
    assertEquals(
        [
            root,
            [
                "query=dummy",
                "query_highlight=false"
            ].join('&')
        ].join('?'),
        urlString);

    urlString = g_.searchUrl(url.clone(), "dummy", []);
    assertEquals(
        [
            root,
            [
                "query=dummy",
                "query_highlight=true"
            ].join('&')
        ].join('?'),
        urlString);
};
