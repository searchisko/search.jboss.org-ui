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
  var output = '<div class="statistics">Found ' + soy.$$escapeHtml(opt_data.hits.total) + ' results for "' + soy.$$escapeHtml(opt_data.user_query) + '" -&nbsp;page&nbsp;' + soy.$$escapeHtml(opt_data.actual_page) + '/' + soy.$$escapeHtml(opt_data.total_pages) + '.</div>';
  var hitList27 = opt_data.hits.hits;
  var hitListLen27 = hitList27.length;
  for (var hitIndex27 = 0; hitIndex27 < hitListLen27; hitIndex27++) {
    var hitData27 = hitList27[hitIndex27];
    output += org.jboss.search.page.templates.hit(hitData27) + '<div class="hit_spacer"></div>';
  }
  output += '<div class="pagination">';
  var pList32 = opt_data.pagination;
  var pListLen32 = pList32.length;
  if (pListLen32 > 0) {
    for (var pIndex32 = 0; pIndex32 < pListLen32; pIndex32++) {
      var pData32 = pList32[pIndex32];
      output += '<span> <a ' + ((opt_data.actual_page == pData32.page) ? 'class="actual"' : '') + ' href="' + soy.$$escapeHtml(pData32.url) + '">' + soy.$$filterNoAutoescape(pData32.symbol) + '</a></span>';
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
    var commentList103 = opt_data.highlight.comment_body;
    var commentListLen103 = commentList103.length;
    for (var commentIndex103 = 0; commentIndex103 < commentListLen103; commentIndex103++) {
      var commentData103 = commentList103[commentIndex103];
      output += '<li>' + soy.$$filterNoAutoescape(commentData103) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  output += '</div>';
  if (((opt_data.fields == null) ? null : opt_data.fields.dcp_contributors_view) != null) {
    output += '<div class="contributors_list">';
    var cList114 = opt_data.fields.dcp_contributors_view;
    var cListLen114 = cList114.length;
    for (var cIndex114 = 0; cIndex114 < cListLen114; cIndex114++) {
      var cData114 = cList114[cIndex114];
      output += '<span><img src="' + soy.$$escapeHtml(cData114.gURL20) + '"></span>';
    }
    output += ((((opt_data.fields == null) ? null : opt_data.fields.dcp_contributors_view.length) > 0) ? '<span class="selected_contributor_name">&#8212;&nbsp;<span class="value">' + soy.$$escapeHtml(opt_data.fields.dcp_contributors_view[0].name) + '</span></span>' : '') + '</div>';
  }
  output += '</div></div>';
  return output;
};
