/*\
title: $:/plugins/breakzplatform/github-comments/widget/comments.js
type: application/javascript
module-type: widget

Display GitHub comments for a tiddler, powered by giscus or utterances

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	var Widget = require("$:/core/modules/widgets/widget.js").widget;

	var CONFIG_PREFIX = "$:/config/breakzplatform/github-comments/";
	var TERM_FIELD = "github-comments-term";

	// Theme names differ between the two services; translate the common ones
	// so a theme picked for one keeps working after switching to the other
	var GISCUS_THEMES = {
		"github-light": "light",
		"github-dark": "dark",
		"preferred-color-scheme": "preferred_color_scheme",
		"github-dark-orange": "dark",
		"icy-dark": "dark",
		"dark-blue": "dark_dimmed",
		"photon-dark": "dark",
		"boxy-light": "light",
		"gruvbox-dark": "gruvbox_dark"
	};
	var UTTERANCES_THEMES = {
		"light": "github-light",
		"dark": "github-dark",
		"preferred_color_scheme": "preferred-color-scheme",
		"dark_dimmed": "dark-blue",
		"gruvbox_dark": "gruvbox-dark"
	};

	var GitHubCommentsWidget = function (parseTreeNode, options) {
		this.initialise(parseTreeNode, options);
	};

	GitHubCommentsWidget.prototype = new Widget();

	GitHubCommentsWidget.prototype.render = function (parent, nextSibling) {
		this.parentDomNode = parent;
		this.computeAttributes();
		this.execute();

		var wrapper = this.document.createElement("div");
		wrapper.className = "gh-comments-wrapper";
		wrapper.setAttribute("data-tiddler-title", this.tiddlerTitle);
		parent.insertBefore(wrapper, nextSibling);
		this.domNodes.push(wrapper);

		// Interactive DOM not available when generating static pages
		if (!$tw.browser) return;

		if (this.provider === "incomplete") {
			var warning = this.document.createElement("p");
			warning.className = "gh-comments-warning";
			warning.textContent = "GitHub comments: fill in both the giscus repository ID and category ID, or clear both to use utterances.";
			wrapper.appendChild(warning);
			return;
		}

		var script = this.provider === "giscus" ? this.createGiscusScript() : this.createUtterancesScript();

		// giscus renders into the first ".giscus" element of the page, so give
		// it one inside this wrapper instead of letting it pick a stale one
		if (this.provider === "giscus") {
			var container = this.document.createElement("div");
			container.className = "giscus";
			wrapper.appendChild(container);
		}
		wrapper.appendChild(script);
	};

	GitHubCommentsWidget.prototype.execute = function () {
		this.tiddlerTitle = this.getAttribute("tiddler", this.getVariable("currentTiddler"));
		this.provider = this.resolveProvider();
		this.term = this.buildTerm();
	};

	GitHubCommentsWidget.prototype.getConfig = function (name) {
		return (this.wiki.getTiddlerText(CONFIG_PREFIX + name) || "").trim();
	};

	// "auto" keeps wikis configured before giscus support on utterances, and
	// switches to giscus as soon as its repository and category IDs are set.
	// Only one of them set is a half-done setup, not a request for utterances
	GitHubCommentsWidget.prototype.resolveProvider = function () {
		var provider = this.getConfig("provider").toLowerCase();
		if (provider === "giscus" || provider === "utterances") {
			return provider;
		}
		var repoId = this.getConfig("repo-id");
		var categoryId = this.getConfig("category-id");
		if (repoId && categoryId) return "giscus";
		if (repoId || categoryId) return "incomplete";
		return "utterances";
	};

	// Same format for both services, so threads created with utterances can
	// be converted to discussions and still be found by giscus.
	// The URL is concatenated raw on purpose: 0.0.1 did the same, and wikis
	// that never set it have threads titled "[undefined] ..." that must still match
	GitHubCommentsWidget.prototype.buildTerm = function () {
		var tiddler = this.wiki.getTiddler(this.tiddlerTitle);
		var override = tiddler && tiddler.fields[TERM_FIELD];
		var url = this.wiki.getTiddlerText(CONFIG_PREFIX + "url");
		return "[" + url + "] " + (override || this.tiddlerTitle);
	};

	GitHubCommentsWidget.prototype.resolveTheme = function (translations) {
		var theme = this.getConfig("theme");
		return translations[theme] || theme;
	};

	GitHubCommentsWidget.prototype.createScript = function (src, attributes) {
		var script = this.document.createElement("script");
		script.async = true;
		script.src = src;
		script.setAttribute("crossorigin", "anonymous");
		$tw.utils.each(attributes, function (value, name) {
			script.setAttribute(name, value);
		});
		return script;
	};

	GitHubCommentsWidget.prototype.createUtterancesScript = function () {
		return this.createScript("https://utteranc.es/client.js", {
			"repo": this.getConfig("repo"),
			"issue-term": this.term,
			"theme": this.resolveTheme(UTTERANCES_THEMES) || "github-light"
		});
	};

	GitHubCommentsWidget.prototype.createGiscusScript = function () {
		return this.createScript("https://giscus.app/client.js", {
			"data-repo": this.getConfig("repo"),
			"data-repo-id": this.getConfig("repo-id"),
			"data-category": this.getConfig("category"),
			"data-category-id": this.getConfig("category-id"),
			"data-mapping": "specific",
			"data-term": this.term,
			"data-strict": this.getConfig("strict") === "no" ? "0" : "1",
			"data-reactions-enabled": "1",
			"data-emit-metadata": "0",
			"data-input-position": "bottom",
			"data-theme": this.resolveTheme(GISCUS_THEMES) || "light",
			"data-lang": this.getConfig("lang") || "en",
			"data-loading": "lazy"
		});
	};

	// Reload the thread only when it points to another thread, not on every
	// edit of the tiddler body. Config changes apply the next time the comments
	// are opened: reloading on each keystroke in the settings would start
	// several client scripts at once, and they race for the same container
	GitHubCommentsWidget.prototype.refresh = function (changedTiddlers) {
		var changedAttributes = this.computeAttributes();
		if (changedAttributes.tiddler ||
			(changedTiddlers[this.tiddlerTitle] && this.buildTerm() !== this.term)) {
			this.refreshSelf();
			return true;
		}
		return false;
	};

	exports["github-comments"] = GitHubCommentsWidget;

})();
