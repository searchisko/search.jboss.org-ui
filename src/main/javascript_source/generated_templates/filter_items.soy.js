// This file was automatically generated from filter_items.soy.
// Please don't edit this file by hand.

goog.provide('org.jboss.search.page.filter.templates');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.filter.templates.project_filter_items = function(opt_data, opt_ignored) {
  var output = '';
  var itemList3 = opt_data.items;
  var itemListLen3 = itemList3.length;
  for (var itemIndex3 = 0; itemIndex3 < itemListLen3; itemIndex3++) {
    var itemData3 = itemList3[itemIndex3];
    output += '<div code=\'' + soy.$$escapeHtml(itemData3.code) + '\'><span class="selectable">' + soy.$$filterNoAutoescape(itemData3.name) + '</span></div>';
  }
  if (opt_data.did_you_mean_items != null && opt_data.did_you_mean_items.length > 0) {
    output += '<div class="did_you_mean">Did you mean?</div>';
    var itemList14 = opt_data.did_you_mean_items;
    var itemListLen14 = itemList14.length;
    for (var itemIndex14 = 0; itemIndex14 < itemListLen14; itemIndex14++) {
      var itemData14 = itemList14[itemIndex14];
      output += '<div code=\'' + soy.$$escapeHtml(itemData14.code) + '\'><span class="selectable">' + soy.$$escapeHtml(itemData14.name) + '</span></div>';
    }
  }
  output += (opt_data.did_you_mean_items != null && opt_data.items != null && opt_data.did_you_mean_items.length == 0 && opt_data.items.length == 0) ? '<div>No matching projects...</div>' : '';
  return output;
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.filter.templates.project_filter_top_items = function(opt_data, opt_ignored) {
  var output = '';
  var termList25 = opt_data.terms;
  var termListLen25 = termList25.length;
  for (var termIndex25 = 0; termIndex25 < termListLen25; termIndex25++) {
    var termData25 = termList25[termIndex25];
    output += '<div code=\'' + soy.$$escapeHtml(termData25.term) + '\'><span class="selectable">' + soy.$$filterNoAutoescape(termData25.name) + ' (' + soy.$$escapeHtml(termData25.count) + ')</span></div>';
  }
  return output;
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.page.filter.templates.author_filter_items = function(opt_data, opt_ignored) {
  var output = '';
  var termList36 = opt_data.terms;
  var termListLen36 = termList36.length;
  for (var termIndex36 = 0; termIndex36 < termListLen36; termIndex36++) {
    var termData36 = termList36[termIndex36];
    output += '<div code=\'' + soy.$$escapeHtml(termData36.term) + '\'><span class="selectable"><img src="' + soy.$$escapeHtml(termData36.gURL16) + '"> ' + soy.$$filterNoAutoescape(termData36.name) + ' (' + soy.$$escapeHtml(termData36.count) + ')</span></div>';
  }
  return output;
};
