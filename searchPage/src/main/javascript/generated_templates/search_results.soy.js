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
  return '\t' + ((((opt_data.filters == null) ? null : opt_data.filters.dateFilter) != null) ? '<div class="active_filter">' + org.jboss.search.page.templates.date_filter(opt_data.filters.dateFilter) + org.jboss.search.page.templates.filter_close(null) + '</div>' : '');
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.filter_close = function(opt_data, opt_ignored) {
  return '<span class="active_filter_close">[X]</span>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.date_filter = function(opt_data, opt_ignored) {
  return '\t' + ((opt_data.from != null) ? '<span>From: ' + soy.$$escapeHtml(opt_data.from) + ' </span>' : '') + ((opt_data.to != null) ? '<span>To: ' + soy.$$escapeHtml(opt_data.to) + ' </span>' : '') + ((opt_data.order != null) ? '<span>Order: ' + soy.$$escapeHtml(opt_data.order) + ' </span>' : '');
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.search_results = function(opt_data, opt_ignored) {
  var output = '<div class="statistics">Found ' + soy.$$escapeHtml(opt_data.hits.total) + ' results for "' + soy.$$escapeHtml(opt_data.user_query) + '" -&nbsp;page&nbsp;' + ((opt_data.pagination != null && opt_data.pagination.total_pages == 0) ? '0' : soy.$$escapeHtml(opt_data.actual_page)) + '/' + ((opt_data.pagination != null) ? soy.$$escapeHtml(opt_data.pagination.total_pages) : 'na') + '.</div>';
  var hitList100 = opt_data.hits.hits;
  var hitListLen100 = hitList100.length;
  for (var hitIndex100 = 0; hitIndex100 < hitListLen100; hitIndex100++) {
    var hitData100 = hitList100[hitIndex100];
    output += org.jboss.search.page.templates.hit(hitData100) + '<div class="hit_spacer"></div>';
  }
  output += '<div class="pagination">';
  if (opt_data.pagination != null) {
    var pList107 = opt_data.pagination.array;
    var pListLen107 = pList107.length;
    if (pListLen107 > 0) {
      for (var pIndex107 = 0; pIndex107 < pListLen107; pIndex107++) {
        var pData107 = pList107[pIndex107];
        output += '<span class="' + ((opt_data.actual_page == pData107.page) ? 'actual ' : '') + 'pc_" pn_="' + soy.$$escapeHtml(pData107.symbol) + '">' + soy.$$filterNoAutoescape(pData107.symbol) + '</span>';
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
      var content_snippetList179 = opt_data.highlight.sys_content_plaintext;
      var content_snippetListLen179 = content_snippetList179.length;
      for (var content_snippetIndex179 = 0; content_snippetIndex179 < content_snippetListLen179; content_snippetIndex179++) {
        var content_snippetData179 = content_snippetList179[content_snippetIndex179];
        output += (content_snippetIndex179 < 2) ? soy.$$filterNoAutoescape(content_snippetData179) + '&nbsp;&hellip; ' : '';
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
    var commentList196 = opt_data.highlight.comment_body;
    var commentListLen196 = commentList196.length;
    for (var commentIndex196 = 0; commentIndex196 < commentListLen196; commentIndex196++) {
      var commentData196 = commentList196[commentIndex196];
      output += '<li>' + soy.$$filterNoAutoescape(commentData196) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  if (((opt_data.highlight == null) ? null : opt_data.highlight['message_attachments.content']) != null) {
    output += '<div class="children attachments">Attachments:<ul>';
    var attachmentList206 = opt_data.highlight['message_attachments.content'];
    var attachmentListLen206 = attachmentList206.length;
    for (var attachmentIndex206 = 0; attachmentIndex206 < attachmentListLen206; attachmentIndex206++) {
      var attachmentData206 = attachmentList206[attachmentIndex206];
      output += '<li>' + soy.$$filterNoAutoescape(attachmentData206) + '&nbsp;&hellip;</li>';
    }
    output += '</ul></div>';
  }
  if (((opt_data.fields == null) ? null : (opt_data.fields.sys_tags_view == null) ? null : opt_data.fields.sys_tags_view.length) > 0) {
    output += '<div class="tags_list">Tags:';
    var tagList216 = opt_data.fields.sys_tags_view;
    var tagListLen216 = tagList216.length;
    for (var tagIndex216 = 0; tagIndex216 < tagListLen216; tagIndex216++) {
      var tagData216 = tagList216[tagIndex216];
      output += '<span> ' + soy.$$escapeHtml(tagData216) + ((! (tagIndex216 == tagListLen216 - 1)) ? ',' : '') + '</span>';
    }
    output += '</div>';
  }
  output += '</div>';
  if (((opt_data.fields == null) ? null : opt_data.fields.sys_contributors_view) != null) {
    output += '<div class="contributors_list">';
    var cList229 = opt_data.fields.sys_contributors_view;
    var cListLen229 = cList229.length;
    for (var cIndex229 = 0; cIndex229 < cListLen229; cIndex229++) {
      var cData229 = cList229[cIndex229];
      output += '<span class="ct_" hn_="' + soy.$$escapeHtml(opt_data.position_on_page) + '" cn_="' + soy.$$escapeHtml(cIndex229) + '"><img src="' + soy.$$escapeHtml(cData229.gURL16) + '"></span>';
    }
    output += ((((opt_data.fields == null) ? null : opt_data.fields.sys_contributors_view.length) > 0) ? '<span class="selected_contributor_name">&#8212; <span class="value">' + soy.$$escapeHtml(opt_data.fields.sys_contributors_view[0].name) + '</span></span>' : '') + '</div>';
  }
  output += '</div></div>';
  return output;
};
