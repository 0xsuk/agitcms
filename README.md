![image](/github/local1.png)
/eɪdʒɪt/  

Agit CMS is a simple web frontend interface that utilizes filesystem to manage markdown/media contents. Built for markdown-based static site generators, like Hugo and Jekyll.  

![frontmatter](/github/local.gif)

[More screenshots](/github/showcase.md)

## Install
`npm install -g agitcms`  

To start: `agitcms`  
To change port: `AGIT_FRONTEND=3001 agitcms`  

Node.js >= 18 is supported


## Idea
- it runs locally on browser
- it directly modifies the local markdown file
- you write javascript to tweak the editor
- you can use browser's feature (bookmarking, and all chrome extensions)
- you can use shell scripts or cli program against the local markdown file.

## Features
- vertical split style markdown editor
- type-aware frontmatter editor
- custom editor snippet/toolbar/keymap
- custom frontmatter language(yaml/toml) & delimiters
- Integrated Terminal
- mathjax rendering:

$$ E = mc^2 $$

$$ Agit = wonderful $$

- image pasting into the editor

## Documents
[Quick Start](QuickStart.md)

[Using Markdown Editor](MarkdownEditor.md)

[Using Frontmatter Editor](FrontmatterEditor.md)

[Using Integrated Terminal](IntegratedTerminal.md)

[Using other components](OtherComponents.md)

[Settings](Settings.md)

[Plugins](Plugins.md)

[API reference](APIReference.md)

[Screenshots](/github/showcase.md)

[Explanation](/Explanation.md)
