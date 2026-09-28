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
		return '<$github-comments tiddler="""' + (current || this.getVariable("currentTiddler")) + '"""/>';
	};
})();
