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
  return '<div class="response-error">Oops - something went wrong!</div><div class="response-error">We are sorry but we were unable to get response for your query "' + soy.$$escapeHtml(opt_data.user_query) + '": ' + soy.$$escapeHtml(opt_data.error) + '</div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.search_results = function(opt_data, opt_ignored) {
  var output = '<div class="statistics">Found ' + soy.$$escapeHtml(opt_data.hits.total) + ' results for "' + soy.$$escapeHtml(opt_data.user_query) + '" -&nbsp;page&nbsp;' + ((opt_data.pagination != null && opt_data.pagination.total_pages == 0) ? '0' : soy.$$escapeHtml(opt_data.actual_page)) + '/' + ((opt_data.pagination != null) ? soy.$$escapeHtml(opt_data.pagination.total_pages) : 'na') + '.</div>';
  var hitList62 = opt_data.hits.hits;
  var hitListLen62 = hitList62.length;
  for (var hitIndex62 = 0; hitIndex62 < hitListLen62; hitIndex62++) {
    var hitData62 = hitList62[hitIndex62];
    output += org.jboss.search.page.templates.hit(hitData62) + '<div class="hit_spacer"></div>';
  }
  output += '<div class="pagination">';
  if (opt_data.pagination != null) {
    var pList69 = opt_data.pagination.array;
    var pListLen69 = pList69.length;
    if (pListLen69 > 0) {
      for (var pIndex69 = 0; pIndex69 < pListLen69; pIndex69++) {
        var pData69 = pList69[pIndex69];
        output += '<span class="' + ((opt_data.actual_page == pData69.page) ? 'actual ' : '') + 'pc_" pn_="' + soy.$$escapeHtml(pData69.symbol) + '">' + soy.$$filterNoAutoescape(pData69.symbol) + '</span>';
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
  var output = '<div class="hit"><div class="left"><p class="avatar"><img src="' + soy.$$escapeHtml(((opt_data.fields.sys_contributors_view == null) ? null : (opt_data.fields.sys_contributors_view[0] == null) ? null : opt_data.fields.sys_contributors_view[0].gURL40) != null ? ((opt_data.fields.sys_contributors_view == null) ? null : (opt_data.fields.sys_contributors_view[0] == null) ? null : opt_data.fields.sys_contributors_view[0].gURL40) : 'image/test/generic.png') + '"></p></div><div class="main">' + ((((opt_data.highlight == null) ? null : opt_data.highlight.sys_title) != null) ? '<div class="title cs_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '"><a href="' + soy.$$escapeHtml(opt_data.fields.sys_url_view) + '">' + soy.$$filterNoAutoescape(opt_data.highlight.sys_title) + '</a></div>' : '<div class="title cs_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '"><a href="' + soy.$$escapeHtml(opt_data.fields.sys_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.sys_title) + '</a></div>') + '<div class="link cs_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '"><a href="' + soy.$$escapeHtml(opt_data.fields.sys_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.sys_url_view_tr) + '</a></div><div class="snippet"><span class="date">' + ((opt_data.fields.sys_created_parsed != null) ? soy.$$escapeHtml(opt_data.fields.sys_created_parsed) + '&nbsp;-&nbsp;' : '') + soy.$$escapeHtml(opt_data.fields.sys_last_activity_date_parsed) + '&nbsp;- </span>' + ((((opt_data.fields == null) ? null : opt_data.fields.sys_project) != null) ? ((((opt_data.fields == null) ? null : opt_data.fields.sys_project_full_name) != null) ? '<span class="sys_project">' + soy.$$escapeHtml(opt_data.fields.sys_project_full_name) : '<span class="sys_project">' + soy.$$escapeHtml(opt_data.fields.sys_project)) + ((((opt_data.fields == null) ? null : opt_data.fields.sys_project) != null && ((opt_data.fields == null) ? null : opt_data.fields.sys_type) != null) ? ' / ' : '') + '</span>' : '') + ((((opt_data.fields == null) ? null : opt_data.fields.sys_type) != null) ? '<span class="sys_type">' + soy.$$escapeHtml(opt_data.fields.sys_type) + '</span>' : '');
  if (((opt_data.highlight == null) ? null : opt_data.highlight.sys_description) != null || ((opt_data.fields == null) ? null : opt_data.fields.sys_description_tr) != null || ((opt_data.highlight == null) ? null : (opt_data.highlight.sys_content_plaintext == null) ? null : opt_data.highlight.sys_content_plaintext.length) > 0) {
    output += '<div class="description">';
    if (((opt_data.highlight == null) ? null : (opt_data.highlight.sys_content_plaintext == null) ? null : opt_data.highlight.sys_content_plaintext.length) > 0) {
      var content_snippetList141 = opt_data.highlight.sys_content_plaintext;
      var content_snippetListLen141 = content_snippetList141.length;
      for (var content_snippetIndex141 = 0; content_snippetIndex141 < content_snippetListLen141; content_snippetIndex141++) {
        var content_snippetData141 = content_snippetList141[content_snippetIndex141];
        output += soy.$$filterNoAutoescape(content_snippetData141) + '&nbsp;&hellip; ';
      }
    } else if (((opt_data.highlight == null) ? null : opt_data.highlight.sys_description) != null) {
      output += soy.$$filterNoAutoescape(opt_data.highlight.sys_description);
    } else if (((opt_data.fields == null) ? null : opt_data.fields.sys_description_tr) != null) {
      output += soy.$$filterNoAutoescape(opt_data.fields.sys_description_tr);
    }
    output += '</div>';
  }
  if (((opt_data.highlight == null) ? null : opt_data.highlight.comment_body) != null) {
    output += '<div class="children comments">Comments:<ul>';
    var commentList156 = opt_data.highlight.comment_body;
    var commentListLen156 = commentList156.length;
    for (var commentIndex156 = 0; commentIndex156 < commentListLen156; commentIndex156++) {
      var commentData156 = commentList156[commentIndex156];
      output += '<li>' + soy.$$filterNoAutoescape(commentData156) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  if (((opt_data.fields == null) ? null : (opt_data.fields.sys_tags_view == null) ? null : opt_data.fields.sys_tags_view.length) > 0) {
    output += '<div class="tags_list">Tags:';
    var tagList166 = opt_data.fields.sys_tags_view;
    var tagListLen166 = tagList166.length;
    for (var tagIndex166 = 0; tagIndex166 < tagListLen166; tagIndex166++) {
      var tagData166 = tagList166[tagIndex166];
      output += '<span> ' + soy.$$escapeHtml(tagData166) + ((! (tagIndex166 == tagListLen166 - 1)) ? ',' : '') + '</span>';
    }
    output += '</div>';
  }
  output += '</div>';
  if (((opt_data.fields == null) ? null : opt_data.fields.sys_contributors_view) != null) {
    output += '<div class="contributors_list">';
    var cList179 = opt_data.fields.sys_contributors_view;
    var cListLen179 = cList179.length;
    for (var cIndex179 = 0; cIndex179 < cListLen179; cIndex179++) {
      var cData179 = cList179[cIndex179];
      output += '<span class="ct_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '" cn_="' + soy.$$escapeHtml(cIndex179) + '"><img src="' + soy.$$escapeHtml(cData179.gURL16) + '"></span>';
    }
    output += ((((opt_data.fields == null) ? null : opt_data.fields.sys_contributors_view.length) > 0) ? '<span class="selected_contributor_name">&#8212; <span class="value">' + soy.$$escapeHtml(opt_data.fields.sys_contributors_view[0].name) + '</span></span>' : '') + '</div>';
  }
  output += '</div></div>';
  return output;
};
