goog.provide('org.jboss.profile.widget.ProfileWidget');


goog.require("goog.dom");
goog.require("goog.events.EventTarget");
goog.require("org.jboss.core.visualization.Histogram");

/**
 *
 * @param {EventTarget|goog.events.EventTarget} context element to catch click events and control behaviour of the UI. Typically, this is the document.
 * @param {Object} elements
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.jboss.profile.widget.ProfileWidget = function(context, elements) {
	goog.events.EventTarget.call(this);
	this.context_ = context;
	this.elements_ = elements;

	/**
	 * Create and init the chart.
	 * @type {org.jboss.core.visualization.Histogram}
	 * @private
	 */
	this.histogram_chart_ = new org.jboss.core.visualization.Histogram(this.elements_.getContributions_div());

};
goog.inherits(org.jboss.profile.widget.ProfileWidget, goog.events.EventTarget);

/** @inheritDoc */
org.jboss.profile.widget.ProfileWidget.prototype.disposeInternal = function() {
	// Call the superclass's disposeInternal() method.
	org.jboss.profile.widget.ProfileWidget.superClass_.disposeInternal.call(this);
	goog.dispose(this.elements_);
	goog.dispose(this.histogram_chart_);
	this.context_ = null;
};

/**
 *
 * @param {string} name
 */
org.jboss.profile.widget.ProfileWidget.prototype.setContributorName = function(name) {
	this.elements_.getName_div().innerHTML = name;
};

/**
 *
 * @param {String} avatarURI
 */
org.jboss.profile.widget.ProfileWidget.prototype.setAvatarImage = function(avatarURI) {
	goog.dom.removeChildren(this.elements_.getAvatar_div());
	goog.dom.append(this.elements_.getAvatar_div(), goog.dom.createDom("img", { "class": "avatar", "src": avatarURI.toString() }));
};

/**
 *
 * @param {string} interval
 * @param {Array.<{time: number, count: number}>} data
 */
org.jboss.profile.widget.ProfileWidget.prototype.updateContributionsHistogramChart = function(data, interval) {
	this.histogram_chart_.initialize('histogram', 620, 200); // TODO add size to search app configuration
	this.histogram_chart_.update(data, interval)
};