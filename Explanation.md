# What's wrong with other CMS
I was looking for the best way to edit my https://0xsuk.github.io blog powered by Hugo.  
So what I needed was headless CMS, maybe git based, not API based CMS.
- Most do not support image pasting: Huge for me
- Most do not support mathjax rendering: also huge for me
- Some CMS like Forestry.io do not have vertical split markdown editor, but rich text editor probably because they are for writers. I hate rich text editor.
- Newline: some like forestry.io inserts 2 newlines for enter key because a single line does not mean a newline in markdown. This behavior should be customizable.
- Most CMS do not have access to filesystem. They pull changes from remote repository, save changes, then commit to remote, which is good if you're working with a team. 
But I write alone and I run build command `hugo build` before pushing to remote repo, so I don't want them to commit changes because then I will have to write some Github Actions to invoke build command.  
- No preview server (Forestry.io has though). I just want to start `hugo server`


# Wnat's the point of Agit CMS
## Terminal
As I keep trying many git based CMS, I bumped into [Hokus CMS](https://github.com/julianoappelklein/hokus) and [Front Matter](https://github.com/estruyf/vscode-front-matter).
They taught me that having access to filesystem gives the simplest solution to many problems.

you can just write a script (bash, python, js, whatever!) when you want to
- rename/move/copy file at once
- create new file with default frontmatter
- let filename to be the same as blog title, replacing whitespace with "-", prefixing with date.
- commit changes `$ alias upd="git add . && git commit -m update && git push"`
- create a custom plugin for markdown editor

Agit CMS's built-in integrated terminal encourages you to do those stuff.

## Web app
I initially was expecting Agit CMS to be desktop app like they are because desktop app seemed closer to the metal than web app. But when I keep writing on desktop Agit, I quickly noticed that my English writing skill sucks a lot
 and can't live without the GOAT [Grammarly](https://chrome.google.com/webstore/detail/grammarly-grammar-checker/kbfnbcaeplbcioakkpcpgfkobkghlhen) browser extension. Browser extensions are too powerful to miss.
 
You can even write a web extension that delete some components you don't like. I use [ScriptAutoRunner](https://chrome.google.com/webstore/detail/scriptautorunner/gpgjofmpmjjopcogjgdldidobhmjmdbm?hl=en) to run a custom script that deletes "Trends" component of twitter.  
 
Plus, building multi OS electron app is time-consuming. For every update I had to test it on Linux, Mac, Windows using 2 computers and 1 virtual machine.  
Web app OTOH is easy to develop/install, and more lighter, supports multi instance by default (browser tabs).

## Hacking
People are pretty mad about markdown editor. Their feature requests never stop. That's why there are tons of markdown editors out there.
So let's just make it hackable, like Emacs!.  

Agit's markdown *editor* at this point is pretty flexible. It just relies on flexibility of CodeMirror though:)  
However *previewer* still is not flexible at all. Because you can start preview server, or write a web extension, I left it till later.

