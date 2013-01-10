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
    output.append('<div class="hit"><div class="left"><p class="avatar"><img src="image/test/sanne.png"></p></div><div class="main"><div class="title">Title</div><div class="link"><a href="#">#</a></div><div class="snippet"><span class="date">DD/MMM/YYYY - </span>Snippet&nbsp;&hellip;</div></div></div><div class="hit_spacer"></div>');
  }
  output.append('<div class="pagination">&#9668;<span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>&#9654;</div>');
  return opt_sb ? '' : output.toString();
};
