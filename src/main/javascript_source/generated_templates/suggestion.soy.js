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
  var optionList153 = opt_data.options;
  var optionListLen153 = optionList153.length;
  for (var optionIndex153 = 0; optionIndex153 < optionListLen153; optionIndex153++) {
    var optionData153 = optionList153[optionIndex153];
    output += '<div class="selectable" index="' + soy.$$escapeHtml(opt_data.indexStart + optionIndex153) + '">' + ((optionIndex153 == 0) ? '<div class="caption">' + soy.$$escapeHtml(opt_data.caption) + '</div>' : '') + '<div class="option">' + soy.$$filterNoAutoescape(optionData153) + '</div></div>';
  }
  output += '<div class="suggestion_section_last"></div></div>';
  return output;
};
