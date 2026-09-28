/*\
module-type: macro
tags: $:/tags/Macro
title: $:/plugins/breakzplatform/github-comments/macro/comments
type: application/javascript

Display GitHub comments

Kept for templates written against 0.0.x; new templates should use the
<$github-comments/> widget directly

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	exports.name = "github-comments";

	exports.params = [
		{ "name": "current" },
	];

	/*
	Run the macro
	*/
	exports.run = function (current) {
		var title = current || this.getVariable("currentTiddler");
		// Wikitext has no escaping inside attributes, so pick a quote style the title does not contain
		var quote = ['"""', '"', "'"].filter(function (candidate) {
			return title.indexOf(candidate) === -1;
		})[0];
		if (!quote) return "";
		return "<$github-comments tiddler=" + quote + title + quote + "/>";
	};
})();
