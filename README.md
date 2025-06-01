<p align="center">
    <img src="https://github.com/0xsuk/agitcms/raw/main/public/icons/128x128.png">
    <h1 align="center">Agit CMS</h1>
    <p align="center">A hackable headless CMS for markdown blogs</p>
</p>

![image](/github/local1.png)
/eɪdʒɪt/  

Agit CMS is a simple web frontend interface that utilizes filesystem to manage markdown/media contents. Built for markdown-based static site generators, like Hugo and Jekyll.  
Write markdown blog posts the *hackable* way, get rid of your itch points.

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


Agit CMS tries to be a hackable headless CMS for developers.
  
## Comparison with Netlify CMS  
|  | Agit CMS | Netlify CMS |
|---|---|---|
| How/Where does the CMS run? | You start agitcms when you want to from terminal. Then it runs on your computer. | It always lives in website's /admin path (which heavily relies on the strength of your password) | 
| Who is the CMS for? | Developers | Writers
| Installation | Dead simple (npm i) | Pretty complicated 
| How are changes committed to a remote git repository? | Agit CMS is a simple CMS that reads from and writes to your filesystem. So you simply use [integrated terminal](/IntegratedTerminal.md) or whatever to run git command. | Push Publish button
| Can you paste(Control+v/Command+v) an image into the markdown editor? | O | X
| Can the markdown editor preview mathjax? | O | △ (requires additional setup)
| How do I preview a post real-time in my actual website? | Run a preview command specific to your static site generator in [integrated terminal](/IntegratedTerminal.md) | You can't.
| How customizable is the markdown editor? | [O](/Plugins.md) | △ (You can customize for sure by including <script> tag, by it is almost same as using browser extension. No access to editor API)
| Rich Text Editing? | X | O
| For multiple editors? | X | O
| Looks good? | O (Colors picked from github site) | X (100% personal opinion)

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
