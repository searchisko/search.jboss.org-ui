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
  var optionList15 = opt_data.options;
  var optionListLen15 = optionList15.length;
  for (var optionIndex15 = 0; optionIndex15 < optionListLen15; optionIndex15++) {
    var optionData15 = optionList15[optionIndex15];
    output.append('<div class="selectable" index="', soy.$$escapeHtml(opt_data.indexStart + optionIndex15), '">', (optionIndex15 == 0) ? '<div class="caption">' + soy.$$escapeHtml(opt_data.caption) + '</div>' : '', '<div class="option">', optionData15, '</div></div>');
  }
  output.append('<div class="suggestion_section_last"></div></div>');
  return opt_sb ? '' : output.toString();
};
