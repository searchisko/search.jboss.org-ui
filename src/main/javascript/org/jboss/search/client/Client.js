/*
    JBoss, Home of Professional Open Source
    Copyright 2012 Red Hat Inc. and/or its affiliates and other contributors
    as indicated by the @authors tag. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
 */

/**
 * @fileoverview Client to the search service.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.client.Client');

/**
 *
 * @constructor
 */
org.jboss.search.client.Client = function() {

};

/**
 *
 * @param {!String} query_string
 */
org.jboss.search.client.Client.prototype.getSearchSuggestions = function(query_string) {
    if (query_string.trim().length == 0) {
        return {}
    }
    return {
        view: {
            search: {
                caption: "Search",
                options: [query_string]
            },
            suggestions: {
                caption: "Query Completions",
                options: [
                    "<strong>Hiberna</strong>te",
                    "<strong>Hiberna</strong>te query",
                    "<strong>Hiberna</strong>te session"
                ]
            },
            filters: {
                caption: "Filters",
                options: [
                    "<strong>Add</strong> project filter for <strong>Hibernate</strong>",
                    "<strong>Add</strong> project filter for <strong>Infinispan</strong>",
                    "<strong>Search</strong> project <strong>Hibernate</strong> only"
                ]
            },
            mails: {
                caption: "Mails",
                options: [
                    "<strong>Add</strong> some Mails filter",
                    "Do some other fancy thing here",
                    "Or do something else"
                ]
            }
        },
        model : {
            search: { search: { query: query_string } },
            suggestions : [
                { suggestion: { value: "Hibernate" },         search: { query: "Hibernate" } },
                { suggestion: { value: "Hibernate query" },   search: { query: "Hibernate query" } },
                { suggestion: { value: "Hibernate session" }, search: { query: "Hibernate session" } }
            ],
            filters: [
                { filter_add: [ "Hibernate" ] },
                { filter_add: [ "Infinispan" ] },
                { filter: [ "Hibernate" ] }
            ],
            mails: [
                {},
                {},
                {}
            ]
        }
    }
};