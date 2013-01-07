// This file was automatically generated from suggestion.soy.
// Please don't edit this file by hand.

goog.provide('org.jboss.search.suggestions.templates');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
org.jboss.search.suggestions.templates.suggestions_section = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="suggestions_section">');
  var optionList4 = opt_data.options;
  var optionListLen4 = optionList4.length;
  for (var optionIndex4 = 0; optionIndex4 < optionListLen4; optionIndex4++) {
    var optionData4 = optionList4[optionIndex4];
    output.append('<div class="selectable" index="', soy.$$escapeHtml(opt_data.indexStart + optionIndex4), '">', (optionIndex4 == 0) ? '<div class="caption">' + soy.$$escapeHtml(opt_data.caption) + '</div>' : '', '<div class="option">', optionData4, '</div></div>');
  }
  output.append('<div class="suggestion_section_last"></div></div>');
  return opt_sb ? '' : output.toString();
};
