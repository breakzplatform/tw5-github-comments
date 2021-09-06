/*\
module-type: macro
tags: $:/tags/Macro
title: $:/plugins/breakzplatform/github-comments/macro/comments
type: application/javascript

Display GitHub comments

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
		// Interactive DOM not available when generating static pages
		if (!$tw.browser) return;

		/* Remove current Utteranc.es parent element */
		const currentGhCommentsEL = document.getElementById("gh-comments");
		if (currentGhCommentsEL !== null) {
			currentGhCommentsEL.remove()
		}

		/* Load Utteranc.es */
		const utterancesEl = document.createElement('script');
		utterancesEl.async = true
		utterancesEl.src = 'https://utteranc.es/client.js'
		utterancesEl.setAttribute('repo', $tw.wiki.getTiddlerText('$:/config/breakzplatform/github-comments/repo'))
		utterancesEl.setAttribute('issue-term', '[' + $tw.wiki.getTiddlerText('$:/config/breakzplatform/github-comments/url') + '] ' + current)
		utterancesEl.setAttribute('theme', $tw.wiki.getTiddlerText('$:/config/breakzplatform/github-comments/theme'))
		utterancesEl.setAttribute('crossorigin', 'anonymous')

		/* Create Github Comments Element */
		const ghCommentsEl = document.createElement('div');
		ghCommentsEl.id = "gh-comments";
		ghCommentsEl.appendChild(utterancesEl);

		/* Append to Wrapper */
		document.querySelector('div[data-tiddler-title="' + current + '"] .gh-comments-wrapper')
			.appendChild(ghCommentsEl);

		$tw.utils.nextTick(function () {
			$tw.rootWidget.dispatchEvent({
				type: "github-comments-did-insert-element",
				target: ghCommentsEl
			});
		});
	};
})();
