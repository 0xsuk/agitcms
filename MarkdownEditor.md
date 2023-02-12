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


## Media
`![](${media_public_path}/example.png)` written in the markdown editor panel (left side)
gets rendered as `<img src="http://localhost:${random_port}/${media_public_path}/example.png">` in the preview panel at the right side. 
(`${media_public_path}` is a [media public path](/Settings.md#media))


## Image pasting
Agit CMS allows Ctrl + v to paste into the editor an image previously copied on your clipboard.

Agit CMS automatically uploads pasted image to [Media Folder Path](/Settings.md#media) and then inserts proper `![](image path)` into the editor.

Set [media folder path](/Settings.md#media) and maybe [media public path](/Settings.md#media) to for this feature.  

A couple of things to note

- Images larger than 1MB cannot be pasted.
- At this version, all images pasted into the editor are saved in year-month-date-time.png format

## Custom keymaps / toolbar items
Want to add your own keymaps / toolbar items?
Try creating your own [plugins](/Plugins.md)!

## Custom rendering
Not supported yet! But in the future you will be able to define custom renderer function so that Agit supports various kinds of notations, like marmaid.

![](https://github.com/0xsuk/agitcms/blob/main/github/localhost_3131_5.png)
