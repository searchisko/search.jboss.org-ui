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
org.jboss.search.page.templates.search_filters = function(opt_data, opt_ignored) {
  return '\t' + ((((opt_data.filters == null) ? null : opt_data.filters.dateFilter) != null) ? '<div class="active_filter"><span class="active_filter_title">Date filters &gt;</span>' + org.jboss.search.page.templates.date_filter(opt_data.filters.dateFilter) + org.jboss.search.page.templates.filter_close(opt_data.filters.dateFilter) + '</div>' : '');
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.filter_close = function(opt_data, opt_ignored) {
  return '<span class="active_filter_close" asft_="' + soy.$$escapeHtml(opt_data.type) + '" title="Clear filters">[X]</span>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.date_filter = function(opt_data, opt_ignored) {
  return '\t' + ((opt_data.from != null) ? '<span>From: ' + soy.$$escapeHtml(opt_data.from) + ((opt_data.to != null || opt_data.order != null) ? ',' : '') + '</span>' : '') + ((opt_data.to != null) ? '<span>To: ' + soy.$$escapeHtml(opt_data.to) + ((opt_data.order != null) ? ',' : '') + '</span>' : '') + ((opt_data.order != null) ? '<span>Order: ' + soy.$$escapeHtml(opt_data.order) + '</span>' : '');
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.search_results = function(opt_data, opt_ignored) {
  var output = '<div class="statistics">Found ' + soy.$$escapeHtml(opt_data.hits.total) + ' results for <em>"' + soy.$$escapeHtml(opt_data.user_query) + '"</em> -&nbsp;page&nbsp;' + ((opt_data.pagination != null && opt_data.pagination.total_pages == 0) ? '0' : soy.$$escapeHtml(opt_data.actual_page)) + '/' + ((opt_data.pagination != null) ? soy.$$escapeHtml(opt_data.pagination.total_pages) : 'na') + '.</div>';
  var hitList108 = opt_data.hits.hits;
  var hitListLen108 = hitList108.length;
  for (var hitIndex108 = 0; hitIndex108 < hitListLen108; hitIndex108++) {
    var hitData108 = hitList108[hitIndex108];
    output += org.jboss.search.page.templates.hit(hitData108) + '<div class="hit_spacer"></div>';
  }
  output += '<div class="pagination">';
  if (opt_data.pagination != null) {
    var pList115 = opt_data.pagination.array;
    var pListLen115 = pList115.length;
    if (pListLen115 > 0) {
      for (var pIndex115 = 0; pIndex115 < pListLen115; pIndex115++) {
        var pData115 = pList115[pIndex115];
        output += '<span class="' + ((opt_data.actual_page == pData115.page) ? 'actual ' : '') + 'pc_" pn_="' + soy.$$escapeHtml(pData115.symbol) + '">' + soy.$$filterNoAutoescape(pData115.symbol) + '</span>';
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
  var output = '<div class="hit"><div class="left"><p class="avatar"><img src="' + soy.$$escapeHtml(((opt_data.fields.sys_contributors_view == null) ? null : (opt_data.fields.sys_contributors_view[0] == null) ? null : opt_data.fields.sys_contributors_view[0].gURL40) != null ? ((opt_data.fields.sys_contributors_view == null) ? null : (opt_data.fields.sys_contributors_view[0] == null) ? null : opt_data.fields.sys_contributors_view[0].gURL40) : 'image/test/generic.png') + '" onerror="this.onerror=null;this.src=\'image/test/generic.png\'"></p></div><div class="main">' + ((((opt_data.highlight == null) ? null : opt_data.highlight.sys_title) != null) ? '<div class="title cs_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '"><a href="' + soy.$$escapeHtml(opt_data.fields.sys_url_view) + '">' + soy.$$filterNoAutoescape(opt_data.highlight.sys_title) + '</a></div>' : '<div class="title cs_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '"><a href="' + soy.$$escapeHtml(opt_data.fields.sys_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.sys_title) + '</a></div>') + '<div class="link cs_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '"><a href="' + soy.$$escapeHtml(opt_data.fields.sys_url_view) + '">' + soy.$$escapeHtml(opt_data.fields.sys_url_view_tr) + '</a></div><div class="snippet">' + ((opt_data.fields.sys_last_activity_date_parsed != null) ? '<span class="date">' + ((opt_data.fields.sys_created_parsed != null) ? 'Created:&nbsp;' + soy.$$escapeHtml(opt_data.fields.sys_created_parsed) + ',&nbsp;Last&nbsp;Updated:&nbsp;' : (opt_data.fields.sys_last_activity_date_parsed != null) ? 'Created:&nbsp;' : '') + soy.$$escapeHtml(opt_data.fields.sys_last_activity_date_parsed) + ',&nbsp;</span>' : '') + ((((opt_data.fields == null) ? null : opt_data.fields.sys_project) != null) ? ((((opt_data.fields == null) ? null : opt_data.fields.sys_project_full_name) != null) ? '<span class="sys_project">' + soy.$$escapeHtml(opt_data.fields.sys_project_full_name) : '<span class="sys_project">' + soy.$$escapeHtml(opt_data.fields.sys_project)) + ((((opt_data.fields == null) ? null : opt_data.fields.sys_project) != null && ((opt_data.fields == null) ? null : opt_data.fields.sys_type) != null) ? ' / ' : '') + '</span>' : '') + ((((opt_data.fields == null) ? null : opt_data.fields.sys_type) != null) ? '<span class="sys_type">' + soy.$$escapeHtml(opt_data.fields.sys_type) + '</span>' : '');
  if (((opt_data.highlight == null) ? null : opt_data.highlight.sys_description) != null || ((opt_data.fields == null) ? null : opt_data.fields.sys_description_tr) != null || ((opt_data.highlight == null) ? null : (opt_data.highlight.sys_content_plaintext == null) ? null : opt_data.highlight.sys_content_plaintext.length) > 0) {
    output += '<div class="description">';
    if (((opt_data.highlight == null) ? null : (opt_data.highlight.sys_content_plaintext == null) ? null : opt_data.highlight.sys_content_plaintext.length) > 0) {
      var content_snippetList193 = opt_data.highlight.sys_content_plaintext;
      var content_snippetListLen193 = content_snippetList193.length;
      for (var content_snippetIndex193 = 0; content_snippetIndex193 < content_snippetListLen193; content_snippetIndex193++) {
        var content_snippetData193 = content_snippetList193[content_snippetIndex193];
        output += (content_snippetIndex193 < 2) ? soy.$$filterNoAutoescape(content_snippetData193) + '&nbsp;&hellip; ' : '';
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
    var commentList210 = opt_data.highlight.comment_body;
    var commentListLen210 = commentList210.length;
    for (var commentIndex210 = 0; commentIndex210 < commentListLen210; commentIndex210++) {
      var commentData210 = commentList210[commentIndex210];
      output += '<li>' + soy.$$filterNoAutoescape(commentData210) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  if (((opt_data.highlight == null) ? null : opt_data.highlight['message_attachments.content']) != null) {
    output += '<div class="children attachments">Attachments:<ul>';
    var attachmentList220 = opt_data.highlight['message_attachments.content'];
    var attachmentListLen220 = attachmentList220.length;
    for (var attachmentIndex220 = 0; attachmentIndex220 < attachmentListLen220; attachmentIndex220++) {
      var attachmentData220 = attachmentList220[attachmentIndex220];
      output += '<li>' + soy.$$filterNoAutoescape(attachmentData220) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  if (((opt_data.fields == null) ? null : (opt_data.fields.sys_tags_view == null) ? null : opt_data.fields.sys_tags_view.length) > 0) {
    output += '<div class="tags_list">';
    var tagList230 = opt_data.fields.sys_tags_view;
    var tagListLen230 = tagList230.length;
    for (var tagIndex230 = 0; tagIndex230 < tagListLen230; tagIndex230++) {
      var tagData230 = tagList230[tagIndex230];
      output += '<span class="secondary radius label">' + soy.$$escapeHtml(tagData230) + '</span>' + ((! (tagIndex230 == tagListLen230 - 1)) ? ' ' : '');
    }
    output += '</div>';
  }
  output += '</div>';
  if (((opt_data.fields == null) ? null : opt_data.fields.sys_contributors_view) != null) {
    output += '<div class="contributors_list">';
    var cList243 = opt_data.fields.sys_contributors_view;
    var cListLen243 = cList243.length;
    for (var cIndex243 = 0; cIndex243 < cListLen243; cIndex243++) {
      var cData243 = cList243[cIndex243];
      output += '<span class="ct_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '" cn_="' + soy.$$escapeHtml(cIndex243) + '"><img src="' + soy.$$escapeHtml(cData243.gURL16) + '" onerror="this.onerror=null;this.src=\'image/test/generic.png\'"></span>';
    }
    output += ((((opt_data.fields == null) ? null : opt_data.fields.sys_contributors_view.length) > 0) ? '<span class="selected_contributor_name">&#8212; <span class="value">' + soy.$$escapeHtml(opt_data.fields.sys_contributors_view[0].name) + '</span></span>' : '') + '</div>';
  }
  output += '</div></div>';
  return output;
};
