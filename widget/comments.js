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
		parent.insertBefore(wrapper, nextSibling);
		this.domNodes.push(wrapper);

		// Interactive DOM not available when generating static pages
		if (!$tw.browser) return;

		var script = this.provider === "giscus" ? this.createGiscusScript() : this.createUtterancesScript();
		if (!script) return;

		// giscus renders into the first ".giscus" element of the page, so give
		// it one inside this wrapper instead of letting it pick a stale one
		if (this.provider === "giscus") {
			var container = this.document.createElement("div");
			container.className = "giscus";
			wrapper.appendChild(container);
		}
		wrapper.appendChild(script);

		$tw.utils.nextTick(function () {
			$tw.rootWidget.dispatchEvent({
				type: "github-comments-did-insert-element",
				target: wrapper
			});
		});
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
	// switches to giscus as soon as its repository and category IDs are set
	GitHubCommentsWidget.prototype.resolveProvider = function () {
		var provider = this.getConfig("provider").toLowerCase();
		if (provider === "giscus" || provider === "utterances") {
			return provider;
		}
		return this.getConfig("repo-id") && this.getConfig("category-id") ? "giscus" : "utterances";
	};

	// Same format for both services, so threads created with utterances can
	// be converted to discussions and still be found by giscus
	GitHubCommentsWidget.prototype.buildTerm = function () {
		var tiddler = this.wiki.getTiddler(this.tiddlerTitle);
		var override = tiddler && tiddler.fields[TERM_FIELD];
		return "[" + this.getConfig("url") + "] " + (override || this.tiddlerTitle);
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
			"data-strict": "0",
			"data-reactions-enabled": "1",
			"data-emit-metadata": "0",
			"data-input-position": "bottom",
			"data-theme": this.resolveTheme(GISCUS_THEMES) || "light",
			"data-lang": this.getConfig("lang") || "en",
			"data-loading": "lazy"
		});
	};

	// Reload the thread only when something that affects it changes, not on
	// every edit of the tiddler body
	GitHubCommentsWidget.prototype.refresh = function (changedTiddlers) {
		var changedAttributes = this.computeAttributes();
		var configChanged = Object.keys(changedTiddlers).some(function (title) {
			return title.indexOf(CONFIG_PREFIX) === 0;
		});
		if (changedAttributes.tiddler || configChanged ||
			(changedTiddlers[this.tiddlerTitle] && this.buildTerm() !== this.term)) {
			this.refreshSelf();
			return true;
		}
		return false;
	};

	exports["github-comments"] = GitHubCommentsWidget;

})();
