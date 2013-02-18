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
    output += '<div code=\'' + soy.$$escapeHtml(itemData3.code) + '\'>' + soy.$$escapeHtml(itemData3.name) + '</div>';
  }
  return output;
};
