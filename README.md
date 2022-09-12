<p align="center">
    <img src="https://github.com/0xsuk/agitcms/raw/main/public/icons/128x128.png">
    <h1 align="center">Agit CMS</h1>
    <p align="center">A desktop based headless CMS for markdown blogs</p>
</p>

![Screenshot from 2022-06-29 20-05-04](https://user-images.githubusercontent.com/97814789/176422776-76fe6f93-a308-4af6-aa20-405d49d76c3d.png)

/eɪdʒɪt/  

Agit CMS is a frontend interface for any static site generator including Hugo and Jekyll.  
Write markdown blog posts in the *hackable* way, get rid of your itch points.

![frontmatter](https://user-images.githubusercontent.com/97814789/177042161-555c631e-2050-453c-b9de-1e2137ed7752.gif)


## Features
- type-aware frontmatter editor
- integrated terminal
- support mathjax
- support image pasting
- custom toolbar items / snippets
- custom keymap

## Install
Install latest binary from [Release](https://github.com/0xsuk/agitcms/releases).  
| OS | binary name |
| --- | --- |
| Windows | agitcms_win.exe |
| Mac | agitcms_mac.dmg |
| Linux | agitcms_linux_amd64.deb |  
  
When downloading a binary, some warning might be displayed because Agit CMS is yet to be trusted by Windows/Mac.
To suppress warning and continue, reference below.
- Mac: Find agitcms in Finder. Click on the app pressing ctrl key. Select "Open".
([Open a Mac app from an unidentified developer - Apple Support](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac))
- Windows: If "Windows protected your PC", click on "More info", and select "Run anyway".


## Usage
Explained here! https://0xsuk.github.io/agitcms/overview


## Development
Start agitcms in your local development environment
```
yarn 
yarn run dev
```  
npm cannot run this app because npm does not support yarn "resolutions"

## TODO  
- [ ] markdown editor - custom markdown rendering
- [ ] markdown editor - auto saving config
- [ ] markdown editor - Table of contents
- [ ] markdown editor - use marked instead of unified for speed
- [ ] development - smaller app size
- [ ] development - typescript
- [ ] make it self hostable web app
