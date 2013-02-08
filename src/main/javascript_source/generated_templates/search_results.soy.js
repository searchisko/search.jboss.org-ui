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
  var output = '<div class="hit"><div class="left"><p class="avatar"><img src="' + soy.$$escapeHtml(opt_data.fields.contributor_gravatar != null ? opt_data.fields.contributor_gravatar : 'image/test/generic.png') + '"></p></div><div class="main">' + ((opt_data.highlight.dcp_title != null) ? '<div class="title"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$filterNoAutoescape(opt_data.highlight.dcp_title) + '</a></div>' : '<div class="title"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_title) + '</a></div>') + '<div class="link"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_url_view_tr) + '</a></div><div class="snippet"><span class="date">' + soy.$$escapeHtml(opt_data.fields.dcp_last_activity_date) + ' - </span>' + ((opt_data.highlight.dcp_description != null) ? soy.$$filterNoAutoescape(opt_data.highlight.dcp_description) : (opt_data.fields.dcp_description_tr != null) ? soy.$$filterNoAutoescape(opt_data.fields.dcp_description_tr) : 'No description available &hellip;');
  if (opt_data.highlight.comment_body != null) {
    output += '<div class="children comments">Comments:<ul>';
    var commentList63 = opt_data.highlight.comment_body;
    var commentListLen63 = commentList63.length;
    for (var commentIndex63 = 0; commentIndex63 < commentListLen63; commentIndex63++) {
      var commentData63 = commentList63[commentIndex63];
      output += '<li>' + soy.$$filterNoAutoescape(commentData63) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  output += '</div>' + ((opt_data.fields.dcp_project != null) ? '<div class="dcp_project">' + soy.$$escapeHtml(opt_data.fields.dcp_project) + ((opt_data.fields.dcp_project != null && opt_data.fields.dcp_type != null) ? ' / ' : '') + '</div>' : '') + ((opt_data.fields.dcp_type != null) ? '<div class="dcp_type">' + soy.$$escapeHtml(opt_data.fields.dcp_type) + '</div>' : '') + '</div></div>';
  return output;
};
