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
  var hitList8 = opt_data.hits.hits;
  var hitListLen8 = hitList8.length;
  for (var hitIndex8 = 0; hitIndex8 < hitListLen8; hitIndex8++) {
    var hitData8 = hitList8[hitIndex8];
    output += org.jboss.search.page.templates.hit(hitData8) + '<div class="hit_spacer"></div>';
  }
  output += '<div class="pagination">';
  var pList13 = opt_data.hits.pagination;
  var pListLen13 = pList13.length;
  if (pListLen13 > 0) {
    for (var pIndex13 = 0; pIndex13 < pListLen13; pIndex13++) {
      var pData13 = pList13[pIndex13];
      output += ((pIndex13 == 0 && pData13 > 1) ? '<span>&#9668;</span>' : '') + '<span> ' + soy.$$escapeHtml(pData13) + '</span>' + ((pIndex13 == pListLen13 - 1 && opt_data.hits.pagination.length == 10) ? '<span> &#9654;</span>' : '');
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
  var output = '<div class="hit"><div class="left"><p class="avatar"><img src="' + soy.$$escapeHtml(((opt_data.fields.dcp_contributors_view == null) ? null : (opt_data.fields.dcp_contributors_view[0] == null) ? null : opt_data.fields.dcp_contributors_view[0].gURL40) != null ? ((opt_data.fields.dcp_contributors_view == null) ? null : (opt_data.fields.dcp_contributors_view[0] == null) ? null : opt_data.fields.dcp_contributors_view[0].gURL40) : 'image/test/generic.png') + '"></p></div><div class="main">' + ((opt_data.highlight.dcp_title != null) ? '<div class="title"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$filterNoAutoescape(opt_data.highlight.dcp_title) + '</a></div>' : '<div class="title"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_title) + '</a></div>') + '<div class="link"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_url_view_tr) + '</a></div><div class="snippet"><span class="date">' + soy.$$escapeHtml(opt_data.fields.dcp_last_activity_date) + ' - </span>' + ((opt_data.fields.dcp_project != null) ? '<span class="dcp_project">' + soy.$$escapeHtml(opt_data.fields.dcp_project) + ((opt_data.fields.dcp_project != null && opt_data.fields.dcp_type != null) ? ' / ' : '') + '</span>' : '') + ((opt_data.fields.dcp_type != null) ? '<span class="dcp_type">' + soy.$$escapeHtml(opt_data.fields.dcp_type) + '</span>' : '') + ((opt_data.highlight.dcp_description != null || opt_data.fields.dcp_description_tr != null) ? '<div class="description">' + ((opt_data.highlight.dcp_description != null) ? soy.$$filterNoAutoescape(opt_data.highlight.dcp_description) : (opt_data.fields.dcp_description_tr != null) ? soy.$$filterNoAutoescape(opt_data.fields.dcp_description_tr) : '') + '</div>' : '');
  if (opt_data.highlight.comment_body != null) {
    output += '<div class="children comments">Comments:<ul>';
    var commentList78 = opt_data.highlight.comment_body;
    var commentListLen78 = commentList78.length;
    for (var commentIndex78 = 0; commentIndex78 < commentListLen78; commentIndex78++) {
      var commentData78 = commentList78[commentIndex78];
      output += '<li>' + soy.$$filterNoAutoescape(commentData78) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  output += '</div>';
  if (opt_data.fields.dcp_contributors_view != null) {
    output += '<div class="contributors_list">';
    var cList89 = opt_data.fields.dcp_contributors_view;
    var cListLen89 = cList89.length;
    for (var cIndex89 = 0; cIndex89 < cListLen89; cIndex89++) {
      var cData89 = cList89[cIndex89];
      output += '<span><img src="' + soy.$$escapeHtml(cData89.gURL20) + '"></spam>';
    }
    output += ((opt_data.fields.dcp_contributors_view.length > 0) ? '<span class="selected_contributor_name">~ ' + soy.$$escapeHtml(opt_data.fields.dcp_contributors_view[0].name) + '</span>' : '') + '</div>';
  }
  output += '</div></div>';
  return output;
};
