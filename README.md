# GitHub comments for TiddlyWiki
Use this plugin to give your visitors the opportunity to comment on your tiddlers without changing the wiki itself. See the bottom of this tiddler for example. Please add a star if you like the plugin'!

The comments are stored on GitHub, using one of two services:

- [giscus](https://giscus.app/) (recommended): GitHub Discussions, with reactions, lazy loading and translations
- [utterances](https://utteranc.es/): GitHub Issues. Wikis configured before 0.1.0 keep using it after the update, with no changes

Setup steps for both are in the plugin's *Setup* tab.

## Upgrading from 0.0.x

Nothing to change: while the giscus fields are empty, the plugin keeps using utterances with the same settings and threads. To move to giscus, convert the utterances issues into discussions and fill in the giscus fields; the thread titles are the same, so giscus finds them.

## Installation instructions

### Drag'n'drop
- Open the demo TiddlyWiki: https://tw5-github-comments.joseli.to
- Drag-n-drop the plugin tiddler in to your wiki

### Copy to a Node.js based wiki
- Create a `github-comments` folder inside yours wiki `plugins` folder
- Clone this repo inside `github-comments` folder

## Special thanks
This plugin is heavily inspired and based on [@bimlas](https://github.com/bimlas/tw5-disqus)'s work on the [tw5-disqus plugin](https://github.com/bimlas/tw5-disqus). If you may visit his repo and give a star.