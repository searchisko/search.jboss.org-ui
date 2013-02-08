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

goog.require('org.jboss.search.Constants');

goog.require('goog.date.UtcDateTime');
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

    output.user_query = goog.isDefAndNotNull(query) ? query : "";

    if (goog.object.containsKey(response,'timed_out')) {
        output.timed_out = response.timed_out;
    }

    if (goog.object.containsKey(response,'hits')) {
        output.hits = response.hits;
//        output['hits']['hits'] = org.jboss.search.response.getDummyHits();
    } else {
        output.hits = [];
    }

    output.hits.pagination = [];
    var total = /** @type {Number} */ (goog.object.getValueByKeys(output, ["hits", "total"]));
    if (goog.isNumber(total) && total > 0) {
        var hitsPerPage = org.jboss.search.Constants.SEARCH_RESULTS_PER_PAGE;
        var maxItems = org.jboss.search.Constants.PAGINATION_MAX_ITEMS_COUNT;
        for (var i_ = 0; (((i_+1)*hitsPerPage) <= total && (i_ < maxItems)); i_++) {
            output.hits.pagination[i_] = (i_+ 1);
        }
    }

    var hits = /** @type {Array} */ (goog.object.getValueByKeys(output, ["hits", "hits"]));
    if (goog.isDefAndNotNull(hits)) {

        goog.array.forEach(hits, function(hit){

            var fields = hit.fields;

            // Contributors
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
                        // TODO optimize the code (parse email just once, and call Memo just once!)
                        var name = org.jboss.search.response.extractNameFromMail(c).valueOf();
                        var gravatarURL20 = org.jboss.search.response.gravatarURI_Memo(c,16).valueOf();
                        var gravatarURL40 = org.jboss.search.response.gravatarURI_Memo(c,40).valueOf();
                        fields.dcp_contributors_view.push({'name': name, 'gURL20': gravatarURL20, 'gURL40': gravatarURL40});
                    });
                }
            }

            // URL truncate
            if (goog.object.containsKey(fields,'dcp_url_view')) {
                var url = fields.dcp_url_view;
                if (goog.isDef(url)) {
                    var url_tr = goog.string.truncateMiddle(url, 60, true);
                    fields.dcp_url_view_tr = url_tr;
                }
            }

            // Description truncate
            if (goog.object.containsKey(fields,'dcp_description')) {
                var desc = fields.dcp_description;
                if (goog.isDef(desc)) {
                    // ideal length of line 60
                    // max 3 lines = 180
                    var desc_tr = goog.string.truncate(desc, 180, true);
                    fields.dcp_description_tr = desc_tr;
                }
            }

            // Date
            if (goog.object.containsKey(fields,'dcp_last_activity_date')) {
                var d_ = fields.dcp_last_activity_date;
                var date = goog.date.UtcDateTime.fromIsoString(d_);
//                console.log(d_, date, date.getFullYear(), date.getMonth(), date.getDay());
            }

        })
    }

//    console.log(output);

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
 * @type {function(string, number=): String}
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
