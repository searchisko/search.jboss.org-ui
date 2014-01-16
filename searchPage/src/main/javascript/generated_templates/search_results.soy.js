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
  var hitList73 = opt_data.hits.hits;
  var hitListLen73 = hitList73.length;
  for (var hitIndex73 = 0; hitIndex73 < hitListLen73; hitIndex73++) {
    var hitData73 = hitList73[hitIndex73];
    output += org.jboss.search.page.templates.hit(hitData73) + '<div class="hit_spacer"></div>';
  }
  output += '<div class="pagination">';
  if (opt_data.pagination != null) {
    var pList80 = opt_data.pagination.array;
    var pListLen80 = pList80.length;
    if (pListLen80 > 0) {
      for (var pIndex80 = 0; pIndex80 < pListLen80; pIndex80++) {
        var pData80 = pList80[pIndex80];
        output += '<span class="' + ((opt_data.actual_page == pData80.page) ? 'actual ' : '') + 'pc_" pn_="' + soy.$$escapeHtml(pData80.symbol) + '">' + soy.$$filterNoAutoescape(pData80.symbol) + '</span>';
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
      var content_snippetList152 = opt_data.highlight.sys_content_plaintext;
      var content_snippetListLen152 = content_snippetList152.length;
      for (var content_snippetIndex152 = 0; content_snippetIndex152 < content_snippetListLen152; content_snippetIndex152++) {
        var content_snippetData152 = content_snippetList152[content_snippetIndex152];
        output += (content_snippetIndex152 < 2) ? soy.$$filterNoAutoescape(content_snippetData152) + '&nbsp;&hellip; ' : '';
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
    var commentList169 = opt_data.highlight.comment_body;
    var commentListLen169 = commentList169.length;
    for (var commentIndex169 = 0; commentIndex169 < commentListLen169; commentIndex169++) {
      var commentData169 = commentList169[commentIndex169];
      output += '<li>' + soy.$$filterNoAutoescape(commentData169) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  if (((opt_data.highlight == null) ? null : opt_data.highlight['message_attachments.content']) != null) {
    output += '<div class="children attachments">Attachments:<ul>';
    var attachmentList179 = opt_data.highlight['message_attachments.content'];
    var attachmentListLen179 = attachmentList179.length;
    for (var attachmentIndex179 = 0; attachmentIndex179 < attachmentListLen179; attachmentIndex179++) {
      var attachmentData179 = attachmentList179[attachmentIndex179];
      output += '<li>' + soy.$$filterNoAutoescape(attachmentData179) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  if (((opt_data.fields == null) ? null : (opt_data.fields.sys_tags_view == null) ? null : opt_data.fields.sys_tags_view.length) > 0) {
    output += '<div class="tags_list">Tags:';
    var tagList189 = opt_data.fields.sys_tags_view;
    var tagListLen189 = tagList189.length;
    for (var tagIndex189 = 0; tagIndex189 < tagListLen189; tagIndex189++) {
      var tagData189 = tagList189[tagIndex189];
      output += '<span> ' + soy.$$escapeHtml(tagData189) + ((! (tagIndex189 == tagListLen189 - 1)) ? ',' : '') + '</span>';
    }
    output += '</div>';
  }
  output += '</div>';
  if (((opt_data.fields == null) ? null : opt_data.fields.sys_contributors_view) != null) {
    output += '<div class="contributors_list">';
    var cList202 = opt_data.fields.sys_contributors_view;
    var cListLen202 = cList202.length;
    for (var cIndex202 = 0; cIndex202 < cListLen202; cIndex202++) {
      var cData202 = cList202[cIndex202];
      output += '<span class="ct_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '" cn_="' + soy.$$escapeHtml(cIndex202) + '"><img src="' + soy.$$escapeHtml(cData202.gURL16) + '"></span>';
    }
    output += ((((opt_data.fields == null) ? null : opt_data.fields.sys_contributors_view.length) > 0) ? '<span class="selected_contributor_name">&#8212; <span class="value">' + soy.$$escapeHtml(opt_data.fields.sys_contributors_view[0].name) + '</span></span>' : '') + '</div>';
  }
  output += '</div></div>';
  return output;
};
