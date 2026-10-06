# GitHub comments for TiddlyWiki
Give your visitors a comment thread at the bottom of each tiddler, without changing the wiki itself. The comments are stored on GitHub and visitors sign in with their own GitHub account. Please add a star if you like the plugin!

Demo: https://tw5-github-comments.joselito.dev

- Two services: [giscus](https://giscus.app/) (recommended) keeps the comments in GitHub Discussions, with reactions, lazy loading and translations; [utterances](https://utteranc.es/) keeps them in GitHub Issues
- Each thread is found by the title `[site URL] tiddler title`, the same in both services, so comments never mix between wikis and threads can be moved from utterances to giscus
- giscus strict title matching is on by default, so a tiddler called "Bug" never opens the thread of "Bug report"
- A `github-comments-term` field keeps a tiddler's thread after you rename it
- Upgrading from 0.0.x needs no changes (see below)

Setup steps for both services are in the plugin's *Setup* tab.

Sibling of [tw5-bluesky-comments](https://github.com/breakzplatform/tw5-bluesky-comments), which shows the replies to a Bluesky post as comments.

## Installation instructions

### Drag'n'drop
- Open the demo TiddlyWiki: https://tw5-github-comments.joselito.dev
- Drag the plugin box into your wiki

### Copy to a Node.js based wiki
- Create a `github-comments` folder inside your wiki's `plugins` folder
- Clone this repo into the `github-comments` folder

## Settings

In the *GitHub comments* tab of the Control Panel:

| Setting | Default | |
|---|---|---|
| Service | Automatic | Automatic uses giscus when its repository and category IDs are filled in, and utterances otherwise. Also giscus or utterances |
| GitHub repository | | `user/repo` that stores the comments |
| Website's URL | | First part of every thread title, for example `breakzplatform.github.io`. Changing it later orphans the existing threads |
| Theme | `github-light` | Names like `github-dark` and `preferred-color-scheme` work with both services |
| Filter | `[!is[system]]` | Which tiddlers can show comments |
| Show and hide label text | Show/Hide GitHub comments | Text of the button |
| Repository ID, discussion category and category ID | | giscus only, copied from the configuration generated at [giscus.app](https://giscus.app) |
| Strict title matching | Yes | giscus only. Turn it off only while moving threads from utterances |
| Language | `en` | giscus only |

giscus allows one thread per page, so the plugin opens the comments of one tiddler at a time.

## Upgrading from 0.0.x

Nothing to change: while the giscus fields are empty, the plugin keeps using utterances with the same settings and threads, and the old `<<github-comments>>` macro still works. To move to giscus, convert the utterances issues into discussions and fill in the giscus fields; the thread titles are the same, so giscus finds them.

## Special thanks
This plugin is based on [@bimlas](https://github.com/bimlas)'s [tw5-disqus plugin](https://github.com/bimlas/tw5-disqus). Please visit his repo and give it a star too.

## License

[MIT](LICENSE)
