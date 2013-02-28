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
  var output = '<div class="statistics">Found ' + soy.$$escapeHtml(opt_data.hits.total) + ' results for "' + soy.$$escapeHtml(opt_data.user_query) + '".</div>';
  var hitList23 = opt_data.hits.hits;
  var hitListLen23 = hitList23.length;
  for (var hitIndex23 = 0; hitIndex23 < hitListLen23; hitIndex23++) {
    var hitData23 = hitList23[hitIndex23];
    output += org.jboss.search.page.templates.hit(hitData23) + '<div class="hit_spacer"></div>';
  }
  output += '<div class="pagination">';
  var pList28 = opt_data.hits.pagination;
  var pListLen28 = pList28.length;
  if (pListLen28 > 0) {
    for (var pIndex28 = 0; pIndex28 < pListLen28; pIndex28++) {
      var pData28 = pList28[pIndex28];
      output += ((pIndex28 == 0 && pData28 > 1) ? '<span>&#9668;</span>' : '') + '<span> ' + soy.$$escapeHtml(pData28) + '</span>' + ((pIndex28 == pListLen28 - 1 && opt_data.hits.pagination.length == 10) ? '<span> &#9654;</span>' : '');
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
  var output = '<div class="hit"><div class="left"><p class="avatar"><img src="' + soy.$$escapeHtml(((opt_data.fields.dcp_contributors_view == null) ? null : (opt_data.fields.dcp_contributors_view[0] == null) ? null : opt_data.fields.dcp_contributors_view[0].gURL40) != null ? ((opt_data.fields.dcp_contributors_view == null) ? null : (opt_data.fields.dcp_contributors_view[0] == null) ? null : opt_data.fields.dcp_contributors_view[0].gURL40) : 'image/test/generic.png') + '"></p></div><div class="main">' + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_title) != null) ? '<div class="title"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$filterNoAutoescape(opt_data.highlight.dcp_title) + '</a></div>' : '<div class="title"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_title) + '</a></div>') + '<div class="link"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_url_view_tr) + '</a></div><div class="snippet"><span class="date">' + soy.$$escapeHtml(opt_data.fields.dcp_last_activity_date_parsed) + ' - </span>' + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project) != null) ? ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project_full_name) != null) ? '<span class="dcp_project">' + soy.$$escapeHtml(opt_data.fields.dcp_project_full_name) : '<span class="dcp_project">' + soy.$$escapeHtml(opt_data.fields.dcp_project)) + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project) != null && ((opt_data.fields == null) ? null : opt_data.fields.dcp_type) != null) ? ' / ' : '') + '</span>' : '') + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_type) != null) ? '<span class="dcp_type">' + soy.$$escapeHtml(opt_data.fields.dcp_type) + '</span>' : '') + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_description) != null || ((opt_data.fields == null) ? null : opt_data.fields.dcp_description_tr) != null) ? '<div class="description">' + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_description) != null) ? soy.$$filterNoAutoescape(opt_data.highlight.dcp_description) : (((opt_data.fields == null) ? null : opt_data.fields.dcp_description_tr) != null) ? soy.$$filterNoAutoescape(opt_data.fields.dcp_description_tr) : '') + '</div>' : '');
  if (((opt_data.highlight == null) ? null : opt_data.highlight.comment_body) != null) {
    output += '<div class="children comments">Comments:<ul>';
    var commentList98 = opt_data.highlight.comment_body;
    var commentListLen98 = commentList98.length;
    for (var commentIndex98 = 0; commentIndex98 < commentListLen98; commentIndex98++) {
      var commentData98 = commentList98[commentIndex98];
      output += '<li>' + soy.$$filterNoAutoescape(commentData98) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  output += '</div>';
  if (((opt_data.fields == null) ? null : opt_data.fields.dcp_contributors_view) != null) {
    output += '<div class="contributors_list">';
    var cList109 = opt_data.fields.dcp_contributors_view;
    var cListLen109 = cList109.length;
    for (var cIndex109 = 0; cIndex109 < cListLen109; cIndex109++) {
      var cData109 = cList109[cIndex109];
      output += '<span><img src="' + soy.$$escapeHtml(cData109.gURL20) + '"></span>';
    }
    output += ((((opt_data.fields == null) ? null : opt_data.fields.dcp_contributors_view.length) > 0) ? '<span class="selected_contributor_name">&#8212;&nbsp;<span class="value">' + soy.$$escapeHtml(opt_data.fields.dcp_contributors_view[0].name) + '</span></span>' : '') + '</div>';
  }
  output += '</div></div>';
  return output;
};
