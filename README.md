<p align="center">
    <img src="https://github.com/0xsuk/agitcms/raw/main/public/icons/128x128.png">
    <h1 align="center">Agit CMS</h1>
    <p align="center">A hackable headless CMS for markdown blogs</p>
</p>

![image](https://user-images.githubusercontent.com/97814789/191286020-479deeba-3d7e-4b45-857d-6504eb8947e7.png)
/eɪdʒɪt/  

Agit CMS is a web frontend interface for markdown-based static site generators, like Hugo and Jekyll.  
Write markdown blog posts the *hackable* way, get rid of your itch points.

![frontmatter](https://user-images.githubusercontent.com/97814789/177042161-555c631e-2050-453c-b9de-1e2137ed7752.gif)


## Features
- vertial-split style markdown editor 
- type-aware frontmatter editor
- integrated terminal
- custom editor plugin (toolbar/snippets/keymap)
- image pasting
- mathjax

## Install
`npm install -g agitcms`  

To start: `agitcms`  
To change port: `AGIT_FRONTEND=3001 agitcms`  


## Usage
Explained here! https://0xsuk.github.io/agitcms/overview


## Development
Agit CMS is built with React.js, Typescript, webpack, Material UI, and CodeMirror
### environment setup
Install: `git clone git@github.com:0xsuk/agitcms.git` && `npm i`  
Start: `npm run dev`  

### changelog
From version 2.0.0, Agit CMS became a web interface instead of a desktop app. This way you can use your favorite chrome extension like Grammarly.
  

### TODO  
- [ ] markdown editor - custom markdown rendering
- [ ] markdown editor - auto saving config
- [ ] markdown editor - Table of contents
