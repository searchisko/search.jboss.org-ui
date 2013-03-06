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
  var hitList35 = opt_data.hits.hits;
  var hitListLen35 = hitList35.length;
  for (var hitIndex35 = 0; hitIndex35 < hitListLen35; hitIndex35++) {
    var hitData35 = hitList35[hitIndex35];
    output += org.jboss.search.page.templates.hit(hitData35) + '<div class="hit_spacer"></div>';
  }
  output += '<div class="pagination">';
  if (opt_data.pagination != null) {
    var pList42 = opt_data.pagination.array;
    var pListLen42 = pList42.length;
    if (pListLen42 > 0) {
      for (var pIndex42 = 0; pIndex42 < pListLen42; pIndex42++) {
        var pData42 = pList42[pIndex42];
        output += '<span> <a ' + ((opt_data.actual_page == pData42.page) ? 'class="actual"' : '') + ' href="' + soy.$$escapeHtml(pData42.fragment) + '">' + soy.$$filterNoAutoescape(pData42.symbol) + '</a></span>';
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
  var output = '<div class="hit"><div class="left"><p class="avatar"><img src="' + soy.$$escapeHtml(((opt_data.fields.dcp_contributors_view == null) ? null : (opt_data.fields.dcp_contributors_view[0] == null) ? null : opt_data.fields.dcp_contributors_view[0].gURL40) != null ? ((opt_data.fields.dcp_contributors_view == null) ? null : (opt_data.fields.dcp_contributors_view[0] == null) ? null : opt_data.fields.dcp_contributors_view[0].gURL40) : 'image/test/generic.png') + '"></p></div><div class="main">' + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_title) != null) ? '<div class="title"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$filterNoAutoescape(opt_data.highlight.dcp_title) + '</a></div>' : '<div class="title"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_title) + '</a></div>') + '<div class="link"><a href="' + soy.$$escapeHtml(opt_data.fields.dcp_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.dcp_url_view_tr) + '</a></div><div class="snippet"><span class="date">' + soy.$$escapeHtml(opt_data.fields.dcp_last_activity_date_parsed) + ' - </span>' + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project) != null) ? ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project_full_name) != null) ? '<span class="dcp_project">' + soy.$$escapeHtml(opt_data.fields.dcp_project_full_name) : '<span class="dcp_project">' + soy.$$escapeHtml(opt_data.fields.dcp_project)) + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_project) != null && ((opt_data.fields == null) ? null : opt_data.fields.dcp_type) != null) ? ' / ' : '') + '</span>' : '') + ((((opt_data.fields == null) ? null : opt_data.fields.dcp_type) != null) ? '<span class="dcp_type">' + soy.$$escapeHtml(opt_data.fields.dcp_type) + '</span>' : '') + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_description) != null || ((opt_data.fields == null) ? null : opt_data.fields.dcp_description_tr) != null) ? '<div class="description">' + ((((opt_data.highlight == null) ? null : opt_data.highlight.dcp_description) != null) ? soy.$$filterNoAutoescape(opt_data.highlight.dcp_description) : (((opt_data.fields == null) ? null : opt_data.fields.dcp_description_tr) != null) ? soy.$$filterNoAutoescape(opt_data.fields.dcp_description_tr) : '') + '</div>' : '');
  if (((opt_data.highlight == null) ? null : opt_data.highlight.comment_body) != null) {
    output += '<div class="children comments">Comments:<ul>';
    var commentList113 = opt_data.highlight.comment_body;
    var commentListLen113 = commentList113.length;
    for (var commentIndex113 = 0; commentIndex113 < commentListLen113; commentIndex113++) {
      var commentData113 = commentList113[commentIndex113];
      output += '<li>' + soy.$$filterNoAutoescape(commentData113) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  output += '</div>';
  if (((opt_data.fields == null) ? null : opt_data.fields.dcp_contributors_view) != null) {
    output += '<div class="contributors_list">';
    var cList124 = opt_data.fields.dcp_contributors_view;
    var cListLen124 = cList124.length;
    for (var cIndex124 = 0; cIndex124 < cListLen124; cIndex124++) {
      var cData124 = cList124[cIndex124];
      output += '<span><img src="' + soy.$$escapeHtml(cData124.gURL16) + '"></span>';
    }
    output += ((((opt_data.fields == null) ? null : opt_data.fields.dcp_contributors_view.length) > 0) ? '<span class="selected_contributor_name">&#8212;&nbsp;<span class="value">' + soy.$$escapeHtml(opt_data.fields.dcp_contributors_view[0].name) + '</span></span>' : '') + '</div>';
  }
  output += '</div></div>';
  return output;
};
