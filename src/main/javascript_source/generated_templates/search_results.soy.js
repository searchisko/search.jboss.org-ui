// This file was automatically generated from search_results.soy.
// Please don't edit this file by hand.

goog.provide('org.jboss.search.page.templates');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.search_results = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="statistics">Found ', soy.$$escapeHtml(opt_data.hits.total), ' results for "', soy.$$escapeHtml(opt_data.user_query), '".</div>');
  var hitList8 = opt_data.hits.hits;
  var hitListLen8 = hitList8.length;
  for (var hitIndex8 = 0; hitIndex8 < hitListLen8; hitIndex8++) {
    var hitData8 = hitList8[hitIndex8];
    org.jboss.search.page.templates.hit(hitData8, output);
    output.append('<div class="hit_spacer"></div>');
  }
  output.append('<div class="pagination"><span>&#9668;</span><span> 3</span><span> 4</span><span> 5</span><span> 6</span><span> 7</span><span> 8</span><span> 9</span><span> 10</span><span> 11</span><span> &#9654;</span></div>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.templates.hit = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="hit"><div class="left"><p class="avatar"><img src="', soy.$$escapeHtml(opt_data.fields.contributor_gravatar), '"></p></div><div class="main"><div class="title">', soy.$$escapeHtml(opt_data.fields.dcp_title), '</div><div class="link"><a href="', soy.$$escapeHtml(opt_data.fields.dcp_url_view), '">', soy.$$escapeHtml(opt_data.fields.dcp_url_view_tr), '</a></div><div class="snippet"><span class="date">', soy.$$escapeHtml(opt_data.fields.dcp_last_activity_date), ' - </span>', soy.$$escapeHtml(opt_data.fields.dcp_description_tr), '</div></div></div>');
  return opt_sb ? '' : output.toString();
};
