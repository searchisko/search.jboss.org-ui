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
  var optionList129 = opt_data.options;
  var optionListLen129 = optionList129.length;
  for (var optionIndex129 = 0; optionIndex129 < optionListLen129; optionIndex129++) {
    var optionData129 = optionList129[optionIndex129];
    output += '<div class="selectable" index="' + soy.$$escapeHtml(opt_data.indexStart + optionIndex129) + '">' + ((optionIndex129 == 0) ? '<div class="caption">' + soy.$$escapeHtml(opt_data.caption) + '</div>' : '') + '<div class="option">' + soy.$$filterNoAutoescape(optionData129) + '</div></div>';
  }
  output += '<div class="suggestion_section_last"></div></div>';
  return output;
};
