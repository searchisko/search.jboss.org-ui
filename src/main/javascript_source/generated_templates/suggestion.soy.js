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
  var optionList43 = opt_data.options;
  var optionListLen43 = optionList43.length;
  for (var optionIndex43 = 0; optionIndex43 < optionListLen43; optionIndex43++) {
    var optionData43 = optionList43[optionIndex43];
    output += '<div class="selectable" index="' + soy.$$escapeHtml(opt_data.indexStart + optionIndex43) + '">' + ((optionIndex43 == 0) ? '<div class="caption">' + soy.$$escapeHtml(opt_data.caption) + '</div>' : '') + '<div class="option">' + soy.$$filterNoAutoescape(optionData43) + '</div></div>';
  }
  output += '<div class="suggestion_section_last"></div></div>';
  return output;
};
