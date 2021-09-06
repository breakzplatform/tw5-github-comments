/*\
title: $:/plugins/breakzplatform/github-comments/viewtoolbar/github-comments-open-listener.js
type: application/javascript
module-type: startup

Add event listener for Github comments toolbar button

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	// Export name and synchronous status
	exports.name = "open-github-comments";
	exports.synchronous = true;

	exports.startup = function () {
		$tw.rootWidget.addEventListener("github-comments-did-insert-element", function (event) {
			$tw.pageScroller.scrollIntoView(event.target);
		});
	};

})();
