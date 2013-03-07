// This file was automatically generated from project_filter_items.soy.
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
