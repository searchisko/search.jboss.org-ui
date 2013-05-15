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
 * @fileoverview Event types for QueryService.
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */

goog.provide('org.jboss.search.service.QueryServiceEventType');

goog.require('goog.events');

/**
 * Event types for QueryService.
 * @enum {string}
 */
org.jboss.search.service.QueryServiceEventType = {

    // ----------------------------------------------
    // User query events
    // ----------------------------------------------

    // search request has been started
    SEARCH_START: goog.events.getUniqueId('search_start'),

    // running search request has been aborted
    SEARCH_ABORTED: goog.events.getUniqueId('search_aborted'),

    // search request has finished (either successfully or failed)
    SEARCH_FINISHED: goog.events.getUniqueId('search_finished'),

    // search request finished successfully
    SEARCH_SUCCEEDED: goog.events.getUniqueId('search_succeeded'),

    // search request failed
    SEARCH_ERROR: goog.events.getUniqueId('search_error'),

    // ----------------------------------------------
    // User suggestions query events
    // ----------------------------------------------

    // search request has been started
    SEARCH_SUGGESTIONS_START: goog.events.getUniqueId('search_suggestions_start'),

    // running search request has been aborted
    SEARCH_SUGGESTIONS_ABORTED: goog.events.getUniqueId('search_suggestions_aborted'),

    // search request has finished (either successfully or failed)
    SEARCH_SUGGESTIONS_FINISHED: goog.events.getUniqueId('search_suggestions_finished'),

    // search request finished successfully
    SEARCH_SUGGESTIONS_SUCCEEDED: goog.events.getUniqueId('search_suggestions_succeeded'),

    // search request failed
    SEARCH_SUGGESTIONS_ERROR: goog.events.getUniqueId('search_suggestions_error')
};