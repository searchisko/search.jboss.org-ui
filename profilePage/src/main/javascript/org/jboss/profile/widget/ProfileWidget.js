goog.provide('org.jboss.profile.widget.ProfileWidget');

goog.require("goog.dom");
goog.require("goog.events.EventTarget");

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
};
goog.inherits(org.jboss.profile.widget.ProfileWidget, goog.events.EventTarget);

/** @inheritDoc */
org.jboss.profile.widget.ProfileWidget.prototype.disposeInternal = function() {
	// Call the superclass's disposeInternal() method.
	org.jboss.profile.widget.ProfileWidget.superClass_.disposeInternal.call(this);
	goog.dispose(this.elements_);
	this.context_ = null;
};

/**
 *
 * @param {string} name
 */
org.jboss.profile.widget.ProfileWidget.prototype.setContributorName = function(name) {
	this.elements_.name_div.innerHTML = name;
};

/**
 *
 * @param {String} avatarURI
 */
org.jboss.profile.widget.ProfileWidget.prototype.setAvatarImage = function(avatarURI) {
	goog.dom.removeChildren(this.elements_.avatar_div);
	goog.dom.append(this.elements_.avatar_div, goog.dom.createDom("img", { "class": "avatar", "src": avatarURI.toString() }));
};