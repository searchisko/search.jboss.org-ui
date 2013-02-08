// This file was automatically generated from suggestion.soy.
// Please don't edit this file by hand.

goog.provide('org.jboss.search.suggestions.templates');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
org.jboss.search.suggestions.templates.suggestions_section = function(opt_data, opt_ignored) {
  var output = '<div class="suggestions_section">';
  var optionList99 = opt_data.options;
  var optionListLen99 = optionList99.length;
  for (var optionIndex99 = 0; optionIndex99 < optionListLen99; optionIndex99++) {
    var optionData99 = optionList99[optionIndex99];
    output += '<div class="selectable" index="' + soy.$$escapeHtml(opt_data.indexStart + optionIndex99) + '">' + ((optionIndex99 == 0) ? '<div class="caption">' + soy.$$escapeHtml(opt_data.caption) + '</div>' : '') + '<div class="option">' + soy.$$filterNoAutoescape(optionData99) + '</div></div>';
  }
  output += '<div class="suggestion_section_last"></div></div>';
  return output;
};
