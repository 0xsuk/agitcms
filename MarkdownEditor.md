# Markdown Editor

## default keymaps
Agit CMS has the same default Keymap (or Key bindings, Keyboard shorcuts) as CodeMirror.
Visit [standard keymap](https://codemirror.net/docs/ref/#commands.standardKeymap) and [default keymap](https://codemirror.net/docs/ref/#commands.defaultKeymap) and [history keymap](https://codemirror.net/docs/ref/#commands.historyKeymap)(where Mod- means Control or Cmd) for keymaps available by default.

## mathjax
Type
```
$$
a + b = c
$$
```
to represent block math.
Type
```
$$ a + b = c $$

or

$ a + b = c $

or 

$
a + b = c
$
```
to represent inline math.

## Image pasting
Agit CMS allows Ctrl + v to paste into the editor an image previously copied on your clipboard.

Set [media folder path](/Media.md/#media-folder-path) and [media public path](/Media.md/#media-public-path) to enable this feature.  

A couple of things to note

- Images larger than 1MB cannot be pasted.
- At this version, all images pasted into the editor are saved in year-month-date-time.png format

## Custom keymaps / toolbar items
Want to add your own keymaps / toolbar items?
Try creating your own [plugins](/Plugins.md)!



![](https://github.com/0xsuk/agitcms/blob/main/github/localhost_3131_5.png)
