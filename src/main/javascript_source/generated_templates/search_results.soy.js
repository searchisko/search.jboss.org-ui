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
org.jboss.search.page.templates.search_results = function(opt_data, opt_ignored) {
  var output = '<div class="statistics">Found ' + soy.$$escapeHtml(opt_data.hits.total) + ' results for "' + soy.$$escapeHtml(opt_data.user_query) + '".</div>';
  var hitList17 = opt_data.hits.hits;
  var hitListLen17 = hitList17.length;
  for (var hitIndex17 = 0; hitIndex17 < hitListLen17; hitIndex17++) {
    var hitData17 = hitList17[hitIndex17];
    output += org.jboss.search.page.templates.hit(hitData17) + '<div class="hit_spacer"></div>';
  }
  output += '<div class="pagination">';
  var pList22 = opt_data.hits.pagination;
  var pListLen22 = pList22.length;
  if (pListLen22 > 0) {
    for (var pIndex22 = 0; pIndex22 < pListLen22; pIndex22++) {
      var pData22 = pList22[pIndex22];
      output += ((pIndex22 == 0 && pData22 > 1) ? '<span>&#9668;</span>' : '') + '<span> ' + soy.$$escapeHtml(pData22) + '</span>' + ((pIndex22 == pListLen22 - 1 && opt_data.hits.pagination.length == 10) ? '<span> &#9654;</span>' : '');
    }
  } else {
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
  var output = '<div class="hit"><div class="left"><p class="avatar"><img src="' + soy.$$escapeHtml(((opt_data.fields.dcp_contributors_view == null) ? null : (opt_data.fields.dcp_contributors_view[0] == null) ? null : opt_data.fields.dcp_contributors_view[0].gURL40) != null ? ((opt_data.fields.dcp_contributors_view == null) ? null : (opt_data.fields.dcp_contributors_view[0] == null) ? null : opt_data.fields.dcp_contributors_view[0].gURL40) : 'image/test/generic.png') + '"></p></div><div class="main">' + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_title) != null) ? '<div class="title"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$filterNoAutoescape(opt_data.highlight.dcp_title) + '</a></div>' : '<div class="title"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_title) + '</a></div>') + '<div class="link"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_url_view_tr) + '</a></div><div class="snippet"><span class="date">' + soy.$$escapeHtml(opt_data.fields.dcp_last_activity_date_parsed) + ' - </span>' + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project) != null) ? '<span class="dcp_project">' + soy.$$escapeHtml(opt_data.fields.dcp_project) + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project) != null && ((opt_data.fields == null) ? null : opt_data.fields.dcp_type) != null) ? ' / ' : '') + '</span>' : '') + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_type) != null) ? '<span class="dcp_type">' + soy.$$escapeHtml(opt_data.fields.dcp_type) + '</span>' : '') + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_description) != null || ((opt_data.fields == null) ? null : opt_data.fields.dcp_description_tr) != null) ? '<div class="description">' + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_description) != null) ? soy.$$filterNoAutoescape(opt_data.highlight.dcp_description) : (((opt_data.fields == null) ? null : opt_data.fields.dcp_description_tr) != null) ? soy.$$filterNoAutoescape(opt_data.fields.dcp_description_tr) : '') + '</div>' : '');
  if (((opt_data.highlight == null) ? null : opt_data.highlight.comment_body) != null) {
    output += '<div class="children comments">Comments:<ul>';
    var commentList87 = opt_data.highlight.comment_body;
    var commentListLen87 = commentList87.length;
    for (var commentIndex87 = 0; commentIndex87 < commentListLen87; commentIndex87++) {
      var commentData87 = commentList87[commentIndex87];
      output += '<li>' + soy.$$filterNoAutoescape(commentData87) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  output += '</div>';
  if (((opt_data.fields == null) ? null : opt_data.fields.dcp_contributors_view) != null) {
    output += '<div class="contributors_list">';
    var cList98 = opt_data.fields.dcp_contributors_view;
    var cListLen98 = cList98.length;
    for (var cIndex98 = 0; cIndex98 < cListLen98; cIndex98++) {
      var cData98 = cList98[cIndex98];
      output += '<span><img src="' + soy.$$escapeHtml(cData98.gURL20) + '"></span>';
    }
    output += ((((opt_data.fields == null) ? null : opt_data.fields.dcp_contributors_view.length) > 0) ? '<span class="selected_contributor_name">&#8212;&nbsp;<span class="value">' + soy.$$escapeHtml(opt_data.fields.dcp_contributors_view[0].name) + '</span></span>' : '') + '</div>';
  }
  output += '</div></div>';
  return output;
};
