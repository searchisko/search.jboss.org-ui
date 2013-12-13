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
  var optionList210 = opt_data.options;
  var optionListLen210 = optionList210.length;
  for (var optionIndex210 = 0; optionIndex210 < optionListLen210; optionIndex210++) {
    var optionData210 = optionList210[optionIndex210];
    output += '<div class="selectable" index="' + soy.$$escapeHtml(opt_data.indexStart + optionIndex210) + '">' + ((optionIndex210 == 0) ? '<div class="caption">' + soy.$$escapeHtml(opt_data.caption) + '</div>' : '') + '<div class="option">' + soy.$$filterNoAutoescape(optionData210) + '</div></div>';
  }
  output += '<div class="suggestion_section_last"></div></div>';
  return output;
};
