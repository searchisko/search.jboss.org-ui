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
  var optionList208 = opt_data.options;
  var optionListLen208 = optionList208.length;
  for (var optionIndex208 = 0; optionIndex208 < optionListLen208; optionIndex208++) {
    var optionData208 = optionList208[optionIndex208];
    output += '<div class="selectable" index="' + soy.$$escapeHtml(opt_data.indexStart + optionIndex208) + '">' + ((optionIndex208 == 0) ? '<div class="caption">' + soy.$$escapeHtml(opt_data.caption) + '</div>' : '') + '<div class="option">' + soy.$$filterNoAutoescape(optionData208) + '</div></div>';
  }
  output += '<div class="suggestion_section_last"></div></div>';
  return output;
};
