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

    output['user_query'] = goog.isDefAndNotNull(query) ? query : "";

    if (goog.object.containsKey(response,'hits')) {
        output['hits'] = response['hits'];
        output['hits']['hits'] = org.jboss.search.response.getDummyHits();
    }

    if (goog.object.containsKey(response,'timed_out')) {
        output['timed_out'] = response['timed_out'];
    }

    var hits = /** @type {Array} */ (goog.object.getValueByKeys(output, ["hits", "hits"]));
    if (goog.isDefAndNotNull(hits)) {
        goog.array.forEach(hits, function(hit){

            var fields = hit['fields'];

            // Contributors
            if (goog.object.containsKey(fields,'dcp_contributors')) {
                var conts = fields['dcp_contributors'];
                if (goog.isDef(conts)) {
                    var cont = (goog.isArray(conts) ? conts[0] : conts).valueOf();
                    if (goog.isDef(cont)) {
                        fields['contributor_gravatar'] = org.jboss.search.response.gravatarURI(cont).valueOf();
                    }
                }
            }

            // URL truncate
            if (goog.object.containsKey(fields,'dcp_url_view')) {
                var url = fields['dcp_url_view'];
                if (goog.isDef(url)) {
                    var url_tr = goog.string.truncateMiddle(url, 60, true);
                    fields['dcp_url_view_tr'] = url_tr;
                }
            }

            // Description truncate
            if (goog.object.containsKey(fields,'dcp_description')) {
                var desc = fields['dcp_description'];
                if (goog.isDef(desc)) {
                    // ideal length of line 60
                    // max 3 lines = 180
                    var desc_tr = goog.string.truncate(desc, 180, true);
                    fields['dcp_description_tr'] = desc_tr;
                }
            }

            // Date
            if (goog.object.containsKey(fields,'dcp_last_activity_date')) {
                var d_ = fields['dcp_last_activity_date'];
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


    var hit1 = {};
    hit1['_id'] = 'n/a';
    hit1['highlight'] = {};
    hit1['fields'] = {};
    hit1['fields']['dcp_type'] = 'mailling-list';
    hit1['fields']['dcp_project'] = 'hibernate';
    hit1['fields']['dcp_project_name'] = 'Hibernate';
    hit1['fields']['dcp_contributors'] = ['Max R. Andersen <max.andersen@redhat.com>','Libor Krzyzanek <lkrzyzan@redhat.com>'];
    hit1['fields']['dcp_tags'] = ["Content_tag1", "tag2", "tag3", "user_defined_additional_tag"];
    hit1['fields']['dcp_title'] = 'Hibernate test #1';
    hit1['fields']['dcp_url_view'] = 'http://www.jboss.org/hibernate';
    hit1['fields']['dcp_description'] = 'Lorem ipsum is used to show the content in the basic search GUI for queries that do not produce highlights. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
    hit1['fields']['dcp_last_activity_date'] = '2012-12-06T06:34:55.000Z';

    var hit2 = {};
    hit2['_id'] = 'n/a';
    hit2['highlight'] = {};
    hit2['fields'] = {};
    hit2['fields']['dcp_type'] = 'issue';
    hit2['fields']['dcp_project'] = 'as7';
    hit2['fields']['dcp_project_name'] = 'JBoss AS7';
    hit2['fields']['dcp_contributors'] = ['Emmanuel Bernadr <emmanuel@hibernate.org>','Pat Mat <pat@mat.org>'];
    hit2['fields']['dcp_tags'] = ["Content_tag1", "tag2"];
    hit2['fields']['dcp_title'] = 'JBoss AS7 test #1';
    hit2['fields']['dcp_url_view'] = 'http://www.cnn.com/2013/01/24/opinion/jones-sports-writers/index.html?iid=article_sidebar';
    hit2['fields']['dcp_description'] = 'Lorem ipsum is used to show the content in the basic search GUI for queries that do not produce highlights. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    hit2['fields']['dcp_last_activity_date'] = '2012-12-06T06:34:55.000Z';

    var hit3 = {};
    hit3['_id'] = 'n/a';
    hit3['highlight'] = {};
    hit3['fields'] = {};
    hit3['fields']['dcp_type'] = 'mailing-list';
    hit3['fields']['dcp_project'] = 'jbpm';
    hit3['fields']['dcp_project_name'] = 'jBPM';
    hit3['fields']['dcp_contributors'] = ['Sanne Grinovero <sanne.grinovero@gmail.com>','Lukas Vlcek <lukas.vlcek@gmail.com>'];
    hit3['fields']['dcp_tags'] = ["Content_tag1", "tag2"];
    hit3['fields']['dcp_title'] = 'Dummy Title';
    hit3['fields']['dcp_url_view'] = 'http://news.cnet.com/8301-17938_105-57565529-1/pixar-artist-stays-inspired-by-drawing-superheroes/';
    hit3['fields']['dcp_description'] = 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum is used to show the content in the basic search GUI for queries that do not produce highlights.';
    hit3['fields']['dcp_last_activity_date'] = '2012-12-06T06:34:55.000Z';

    var hit4 = {};
    hit4['_id'] = 'n/a';
    hit4['highlight'] = {};
    hit4['fields'] = {};
    hit4['fields']['dcp_type'] = 'issue';
    hit4['fields']['dcp_project'] = 'as7';
    hit4['fields']['dcp_project_name'] = 'JBoss AS7';
    hit4['fields']['dcp_contributors'] = ['Dan Allen <dan.j.allen@gmail.com>','Pat Mat <pat@mat.org>'];
    hit4['fields']['dcp_tags'] = ["Content_tag1", "tag2"];
    hit4['fields']['dcp_title'] = 'JBoss AS7 test #1';
    hit4['fields']['dcp_url_view'] = 'http://www.cnn.com/2013/01/24/opinion/caplan-neanderthal-baby/index.html?hpt=hp_c3';
    hit4['fields']['dcp_description'] = 'Lorem ipsum is used to show the content in the basic search GUI for queries that do not produce highlights';
    hit4['fields']['dcp_last_activity_date'] = '2012-12-06T06:34:55.000Z';

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
