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
 * @fileoverview Static utilities to normalize raw DCP response to
 * JSON that can be easily processed in Closure Template.
 *
 * @author Lukas Vlcek (lvlcek@redhat.com)
 */
goog.provide('org.jboss.search.response');

goog.require('org.jboss.search.Constants');
goog.require('org.jboss.search.util.paginationGenerator');
goog.require('org.jboss.search.LookUp');

goog.require('goog.date');
goog.require('goog.date.DateTime');
goog.require('goog.object');
goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.format.EmailAddress');
goog.require('goog.crypt');
goog.require('goog.crypt.Md5');
goog.require('goog.memoize');

/**
 * It returns normalized and sanitized search response.
 * @param {!Object} response raw response from DCP search API.
 * @param {string=} opt_query user query
 * @param {number=} opt_page search results page number [1..x]
 * @param {string=} opt_log type of logging windows that is used
 * @return {!Object}
 */
org.jboss.search.response.normalizeSearchResponse = function(response, opt_query, opt_page, opt_log) {

    var output = {};

    // ==========================================
    // Actual page
    // ==========================================
    var actualPage = opt_page || 1;
    if (actualPage < 1) { actualPage = 1 }
    output.actual_page = actualPage;

    // ==========================================
    // User query
    // ==========================================
    var query = opt_query || "";
    query = goog.string.trim(query);
    output.user_query = query;

    // ==========================================
    // Time out
    // ==========================================
    if (goog.object.containsKey(response,'timed_out')) {
        output.timed_out = response.timed_out;
    }

    // ==========================================
    // Response UUID
    // ==========================================
    if (goog.object.containsKey(response,'uuid')) {
        output.uuid = response.uuid;
    }

    // ==========================================
    // activity_dates_histogram_interval
    // ==========================================
    if (goog.object.containsKey(response,'activity_dates_histogram_interval')) {
        output.activity_dates_histogram_interval = response.activity_dates_histogram_interval;
    }

    // ==========================================
    // Hits
    // ==========================================
    if (goog.object.containsKey(response,'hits')) {
        output.hits = response.hits;
//        output['hits']['hits'] = org.jboss.search.response.getDummyHits();
    } else {
        output.hits = [];
    }

    // ==========================================
    // Facets
    // ==========================================
    if (goog.object.containsKey(response,'facets')) {
        output.facets = response.facets;
    } else {
        output.facets = [];
    }

    // ==========================================
    // Pagination
    // ==========================================
    var total = /** @type {number} */ (goog.object.getValueByKeys(output, ["hits", "total"]));
    if (goog.isDefAndNotNull(total)) {
        output.pagination = org.jboss.search.util.paginationGenerator.generate(query, actualPage, total, opt_log);
    }

    var hits = /** @type {Array} */ (goog.object.getValueByKeys(output, ["hits", "hits"]));
    if (goog.isDefAndNotNull(hits)) {

        var projectMap = org.jboss.search.LookUp.getInstance().getProjectMap();

        goog.array.forEach(hits, function(hit, i){

            // ==========================================
            // Position of hit within one search results page
            // <0, org.jboss.search.Constants.SEARCH_RESULTS_PER_PAGE - 1>
            // ==========================================
            hit.position_on_page = i;

            var fields = hit.fields;

            // ==========================================
            // Contributors
            // ==========================================
            if (goog.object.containsKey(fields,'dcp_contributors')) {
                var conts = fields.dcp_contributors;
                if (goog.isDef(conts)) {
                    var cont_;
                    if (goog.isArray(conts)) {
                        cont_ = conts;
                    } else {
                        cont_ = [conts.valueOf()];
                    }
                    fields.dcp_contributors_view = [];

                    goog.array.forEach(cont_,function(c){
                        var name = org.jboss.search.response.extractNameFromMail(c).valueOf();
                        var gravatarURL16 = org.jboss.search.response.gravatarURI_Memo(c,16).valueOf();
                        var gravatarURL40 = org.jboss.search.response.gravatarURI_Memo(c,40).valueOf();
                        fields.dcp_contributors_view.push({'name': name, 'gURL16': gravatarURL16, 'gURL40': gravatarURL40});
                    });
                }
            }

            // ==========================================
            // Try to translate project id -> project name
            // ==========================================
            if (goog.object.containsKey(fields,'dcp_project')) {
                var projectId = fields.dcp_project;
                if (goog.object.containsKey(projectMap, projectId)){
                    fields.dcp_project_full_name = projectMap[projectId];
                }
            }

            // ==========================================
            // Capitalize first letter of dcp_type
            // ==========================================
            if (goog.object.containsKey(fields,'dcp_type')) {
                fields.dcp_type = goog.string.toTitleCase(fields.dcp_type);
            }

            // ==========================================
            // URL truncate
            // ==========================================
            if (goog.object.containsKey(fields,'dcp_url_view')) {
                var url = fields.dcp_url_view;
                if (goog.isDef(url)) {
                    var url_tr = goog.string.truncateMiddle(url, org.jboss.search.Constants.MAX_URL_LENGTH, true);
                    fields.dcp_url_view_tr = url_tr;
                }
            }

            // ==========================================
            // Description truncate
            // ==========================================
            if (goog.object.containsKey(fields,'dcp_description')) {
                var desc = fields.dcp_description;
                if (goog.isDef(desc)) {
                    var desc_tr = goog.string.truncate(desc, org.jboss.search.Constants.MAX_DESCRIPTION_LENGTH, true);
                    fields.dcp_description_tr = desc_tr;
                }
            }

            // ==========================================
            // Date parsing
            // ==========================================
            if (goog.object.containsKey(fields,'dcp_last_activity_date')) {
                try {
                /** @type {goog.date.DateTime} */ var date = goog.date.fromIsoString(fields.dcp_last_activity_date);
                fields.dcp_last_activity_date_parsed =
                    [
                        [date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate()].join('-'),
                        date.toUsTimeString(false, true, true)
                    ].join(', ');
                } catch(e) {
                    // date parsing probably failed
                }
            }
        })
    }
//    console.log(output);
    return output;
};

/**
 * It returns normalized and sanitized project name suggestions response.
 * @param {{length: number}} ngrams raw response from DCP search API.
 * @param {{length: number}} fuzzy raw response from DCP search API.
 * @return {{ items: Array, did_you_mean_items: Array }}
 */
org.jboss.search.response.normalizeProjectSuggestionsResponse = function(ngrams, fuzzy) {

    var items = [];
    goog.array.forEach(ngrams, function(item) {
        items.push({
            'name': item.highlight['dcp_project_name.edgengram'] ? item.highlight['dcp_project_name.edgengram'] : item.highlight['dcp_project_name.ngram'],
            'code': item.fields['dcp_project']
        });
    });

    var did_you_mean_items = [];
    goog.array.forEach(fuzzy, function(item) {
        if (
            goog.array.some(
                items,
                function(already_selected){
                    return already_selected['code'] == item.fields['dcp_project'];
                }
            )
        ) {
            // filter out item if it is already present in 'items'
        } else {
            did_you_mean_items.push({
                'name': item.fields['dcp_project_name'],
                'code': item.fields['dcp_project']
            });
        }
    });

    var output = { 'items': items, 'did_you_mean_items': did_you_mean_items };

    return output;
};

/**
 * TODO temporary only! Remove once we have better data in DCP.
 * @private
 * @return {*}
 */
org.jboss.search.response.getDummyHits = function() {

    var hit1 = {
        _id: 'n/a',
        highlight: {},
        fields: {
            dcp_type: 'mailling-list',
            dcp_project: 'hibernate',
            dcp_project_name: 'Hibernate',
            dcp_contributors: ['Max R. Andersen <max.andersen@redhat.com>','Libor Krzyzanek <lkrzyzan@redhat.com>'],
            dcp_tags: ["Content_tag1", "tag2", "tag3", "user_defined_additional_tag"],
            dcp_title: 'Hibernate test #1',
            dcp_url_view: 'http://www.jboss.org/hibernate',
            dcp_description: 'Lorem ipsum is used to show the content in the basic search GUI for queries that do not produce highlights. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            dcp_last_activity_date: '2012-12-06T06:34:55.000Z'
        }
    };

    var hit2 = {
        _id: 'n/a',
        highlight: {},
        fields: {
            dcp_type: 'issue',
            dcp_project: 'as7',
            dcp_project_name: 'JBoss AS7',
            dcp_contributors: ['Emmanuel Bernadr <emmanuel@hibernate.org>','Pat Mat <pat@mat.org>'],
            dcp_tags: ["Content_tag1", "tag2"],
            dcp_title: 'JBoss AS7 test #1',
            dcp_url_view: 'http://www.cnn.com/2013/01/24/opinion/jones-sports-writers/index.html?iid=article_sidebar',
            dcp_description: 'Lorem ipsum is used to show the content in the basic search GUI for queries that do not produce highlights. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            dcp_last_activity_date: '2012-12-06T06:34:55.000Z'
        }
    };

    var hit3 = {
        _id: 'n/a',
        highlight: {},
        fields: {
            dcp_type: 'mailing-list',
            dcp_project: 'jbpm',
            dcp_project_name: 'jBPM',
            dcp_contributors: ['Sanne Grinovero <sanne.grinovero@gmail.com>','Lukas Vlcek <lukas.vlcek@gmail.com>'],
            dcp_tags: ["Content_tag1", "tag2"],
            dcp_title: 'Dummy Title',
            dcp_url_view: 'http://news.cnet.com/8301-17938_105-57565529-1/pixar-artist-stays-inspired-by-drawing-superheroes/',
            dcp_description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum is used to show the content in the basic search GUI for queries that do not produce highlights.',
            dcp_last_activity_date: '2012-12-06T06:34:55.000Z'
        }
    };

    var hit4 = {
        _id: 'n/a',
        highlight: {},
        fields: {
            dcp_type: 'issue',
            dcp_project: 'as7',
            dcp_project_name: 'JBoss AS7',
            dcp_contributors: ['Dan Allen <dan.j.allen@gmail.com>','Pat Mat <pat@mat.org>'],
            dcp_tags: ["Content_tag1", "tag2"],
            dcp_title: 'JBoss AS7 test #1',
            dcp_url_view: 'http://www.cnn.com/2013/01/24/opinion/caplan-neanderthal-baby/index.html?hpt=hp_c3',
            dcp_description: 'Lorem ipsum is used to show the content in the basic search GUI for queries that do not produce highlights',
            dcp_last_activity_date: '2012-12-06T06:34:55.000Z'
        }
    };

    var source = [hit1, hit2, hit3, hit4];

    var hits = [];

    for (var i = 0; i < 10; i++) {
        hits[i] = source[Math.floor(Math.random() * source.length)];
    }

    return hits;

};

/**
 * @private
 * @type {goog.crypt.Md5}
 */
org.jboss.search.response.md5 = new goog.crypt.Md5();

/**
 * Try to extract name from email address. If not possible return original email value.
 * @param {string} email
 * @return {string}
 */
org.jboss.search.response.extractNameFromMail = function(email) {
    var email_ = goog.isDefAndNotNull(email) ? email : "";
    var parsed = goog.format.EmailAddress.parse(email_);
    var e = parsed.getName();
    if (goog.string.isEmptySafe(e)) {
        return parsed.getAddress();
    } else {
        return e;
    }
};

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
    var md5 = org.jboss.search.response.md5;
    md5.reset();
    md5.update(e);
    e = goog.crypt.byteArrayToHex(md5.digest());
    return e;
};

/**
 * Memoized version of {@see gravatarEmailHash}.
 * @type {function(string): string}
 */
org.jboss.search.response.gravatarEmailHash_Memo = goog.memoize(org.jboss.search.response.gravatarEmailHash);

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
    var hash = org.jboss.search.response.gravatarEmailHash_Memo(email);
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
org.jboss.search.response.gravatarURI_Memo = goog.memoize(org.jboss.search.response.gravatarURI);
