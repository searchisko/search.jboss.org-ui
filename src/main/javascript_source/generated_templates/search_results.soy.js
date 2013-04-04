// This file was automatically generated from search_results.soy.
// Please don't edit this file by hand.

goog.provide('org.jboss.search.page.templates');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.request_error = function(opt_data, opt_ignored) {
  return '<div class="response-error">Oops - something went wrong!</div><div class="response-error">We are sorry but we were unable to get response to your query for "' + soy.$$escapeHtml(opt_data.user_query) + '": ' + soy.$$escapeHtml(opt_data.error) + '</div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.search_results = function(opt_data, opt_ignored) {
  var output = '<div class="statistics">Found ' + soy.$$escapeHtml(opt_data.hits.total) + ' results for "' + soy.$$escapeHtml(opt_data.user_query) + '" -&nbsp;page&nbsp;' + ((opt_data.pagination != null && opt_data.pagination.total_pages == 0) ? '0' : soy.$$escapeHtml(opt_data.actual_page)) + '/' + ((opt_data.pagination != null) ? soy.$$escapeHtml(opt_data.pagination.total_pages) : 'na') + '.</div>';
  var hitList49 = opt_data.hits.hits;
  var hitListLen49 = hitList49.length;
  for (var hitIndex49 = 0; hitIndex49 < hitListLen49; hitIndex49++) {
    var hitData49 = hitList49[hitIndex49];
    output += org.jboss.search.page.templates.hit(hitData49) + '<div class="hit_spacer"></div>';
  }
  output += '<div class="pagination">';
  if (opt_data.pagination != null) {
    var pList56 = opt_data.pagination.array;
    var pListLen56 = pList56.length;
    if (pListLen56 > 0) {
      for (var pIndex56 = 0; pIndex56 < pListLen56; pIndex56++) {
        var pData56 = pList56[pIndex56];
        output += '<span> <a ' + ((opt_data.actual_page == pData56.page) ? 'class="actual"' : '') + ' href="' + soy.$$escapeHtml(pData56.fragment) + '">' + soy.$$filterNoAutoescape(pData56.symbol) + '</a></span>';
      }
    } else {
    }
  }
  output += '</div>';
  return output;
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.hit = function(opt_data, opt_ignored) {
  var output = '<div class="hit"><div class="left"><p class="avatar"><img src="' + soy.$$escapeHtml(((opt_data.fields.dcp_contributors_view == null) ? null : (opt_data.fields.dcp_contributors_view[0] == null) ? null : opt_data.fields.dcp_contributors_view[0].gURL40) != null ? ((opt_data.fields.dcp_contributors_view == null) ? null : (opt_data.fields.dcp_contributors_view[0] == null) ? null : opt_data.fields.dcp_contributors_view[0].gURL40) : 'image/test/generic.png') + '"></p></div><div class="main">' + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_title) != null) ? '<div class="title cs_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$filterNoAutoescape(opt_data.highlight.dcp_title) + '</a></div>' : '<div class="title cs_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_title) + '</a></div>') + '<div class="link cs_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_url_view_tr) + '</a></div><div class="snippet"><span class="date">' + soy.$$escapeHtml(opt_data.fields.dcp_last_activity_date_parsed) + ' - </span>' + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project) != null) ? ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project_full_name) != null) ? '<span class="dcp_project">' + soy.$$escapeHtml(opt_data.fields.dcp_project_full_name) : '<span class="dcp_project">' + soy.$$escapeHtml(opt_data.fields.dcp_project)) + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project) != null && ((opt_data.fields == null) ? null : opt_data.fields.dcp_type) != null) ? ' / ' : '') + '</span>' : '') + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_type) != null) ? '<span class="dcp_type">' + soy.$$escapeHtml(opt_data.fields.dcp_type) + '</span>' : '') + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_description) != null || ((opt_data.fields == null) ? null : opt_data.fields.dcp_description_tr) != null) ? '<div class="description">' + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_description) != null) ? soy.$$filterNoAutoescape(opt_data.highlight.dcp_description) : (((opt_data.fields == null) ? null : opt_data.fields.dcp_description_tr) != null) ? soy.$$filterNoAutoescape(opt_data.fields.dcp_description_tr) : '') + '</div>' : '');
  if (((opt_data.highlight == null) ? null : opt_data.highlight.comment_body) != null) {
    output += '<div class="children comments">Comments:<ul>';
    var commentList133 = opt_data.highlight.comment_body;
    var commentListLen133 = commentList133.length;
    for (var commentIndex133 = 0; commentIndex133 < commentListLen133; commentIndex133++) {
      var commentData133 = commentList133[commentIndex133];
      output += '<li>' + soy.$$filterNoAutoescape(commentData133) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  output += '</div>';
  if (((opt_data.fields == null) ? null : opt_data.fields.dcp_contributors_view) != null) {
    output += '<div class="contributors_list">';
    var cList144 = opt_data.fields.dcp_contributors_view;
    var cListLen144 = cList144.length;
    for (var cIndex144 = 0; cIndex144 < cListLen144; cIndex144++) {
      var cData144 = cList144[cIndex144];
      output += '<span class="ct_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '" cn_="' + soy.$$escapeHtml(cIndex144) + '"><img src="' + soy.$$escapeHtml(cData144.gURL16) + '"></span>';
    }
    output += ((((opt_data.fields == null) ? null : opt_data.fields.dcp_contributors_view.length) > 0) ? '<span class="selected_contributor_name">&#8212;&nbsp;<span class="value">' + soy.$$escapeHtml(opt_data.fields.dcp_contributors_view[0].name) + '</span></span>' : '') + '</div>';
  }
  output += '</div></div>';
  return output;
};
