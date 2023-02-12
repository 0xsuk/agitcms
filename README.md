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


## Features
- vertical split style markdown editor
- type-aware frontmatter editor
- custom editor snippet/toolbar/keymap
- custom frontmatter language(yaml/toml) & delimiters
- Integrated Terminal
- mathjax rendering: $ a + b = c$
- image pasting into the editor


Agit CMS tries to be a hackable headless CMS for developers.
  
## Comparison with Netlify CMS  
|  | Agit CMS | Netlify CMS |
|---|---|---|
| How/Where does the CMS run? | You start agitcms when you want to from terminal. Then it runs on your computer. | It always lives in website's /admin path (which heavily relies on the strength of your password) | 
| Who is the CMS for? | Developers | Writers
| Installation | Dead simple (npm i) | Pretty complicated 
| How are changes committed to a remote git repository? | Agit CMS is a simple CMS that reads from and writes to your filesystem. So you simply use [integrated terminal](https://github.com/0xsuk/agitcms#integrated-terminal) or whatever to run git command. | Push Publish button
| Can you paste(Control+v/Command+v) an image into the markdown editor? | O | X
| Can the markdown editor preview mathjax? | O | △ (requires additional setup)
| How do I preview a post real-time in my actual website? | Run a preview command specific to your static site generator in [integrated terminal](https://github.com/0xsuk/agitcms#integrated-terminal) | You can't.
| How customizable is the markdown editor? | [O](https://github.com/0xsuk/agitcms#plugins) | △ (You can for sure by including <script> tag, by it is almost same as using browser extension. No editor API)
| Rich Text Editing? | X | O
| For multiple editors? | X | O
| Looks good? | O (Colors picked from github site) | X (100% personal opinion)

## Documents
[Quick Start](QuickStart.md)


## Usage
### Markdown Editor
#### default keymaps
Visit [here](https://codemirror.net/docs/ref/#h_keymaps) and [here](https://codemirror.net/docs/ref/#commands.historyKeymap) for keymaps available by default.  

#### custom keymaps
Want to add your own keymaps?  
Try creating your own [plugin](#plugins)!

#### mathjax
Type 
```markdown
$$
a + b = c
$$
```
to represent block math.  
Type
```markdown
$$ a + b = c $$

or

$ a + b = c $

or 

$
a + b = c
$
```
to represent inline math.  

#### image pasting
Agit CMS allows `Ctrl + v` to paste images into the editor.  

This feature is useful when you want to paste a screen capture without looking for its file name.

Set [media folder path](#media-folder-path) and [media public path](#media-public-path) to enable this feature.  

A couple of things to note
- Images larger than 1MB cannot be pasted.
- At this version, all images pasted into the editor are saved in `year-month-date-time.png` format

#### Media
`![](${media_public_path}/example.png)` written in the markdown editor panel (left side) gets parsed into `<img src="http://localhost:${random_port}/${media_public_path}/example.png">` in the preview panel at the right side .  (`${media_public_path}` is a [media public path](#media-public-path))

Agit CMS starts local http server on ${random_port} at [media folder path](#media-folder-path) in the filesystem to serve media contents.  
HTTP server automatically closes when Agit CMS is closed.  

There are a couple of things to note
- On Windows, you might have to tell windows to allow Agit CMS to start HTTP server when a warning is shown. 
- Image placed in the same folder as the markdown post file is in cannot be previewed at this version.  

To quickly get the image path you want to insert into the editor, Agit CMS has a file explorer shortcut button `Media` for it.  
It opens [media folder path](#media-folder-path), and the selected image's public path will be copied into your clipboard.  
This way, you can easily type `![](${ctrl + v})` (where `${ctrl + v}` means pressing `ctrl + v`) to insert the image.  

### Plugins
The markdown editor of Agit CMS (Codemirror) can be customized by creating your own plugins.

Agit CMS evaluate javascript files in `~/.agitcms/plugins` as plugins when boot, so you can place your own javascript file here to create a plugin. Name of the file does not matter.

Creating your own plugin requires a bit of knowledge of codemirror. If you don't know any, [Examples](#examples) is helpful.

There are two types of plugins.  
- Toolbar Item: manually invoked
- TransactionFilter: automatically invoked

#### Toolbar Item
To create Toolbar Item plugin, create a new instance of [ToolbarItem](#class-toolbaritem) class and provide a valid [config](#config) as a first argument.

If you don't want your plugin to show up in the toolbar, set [config](#config).initialChar to empty. That way you can only call the plugin via [config](#config).keyAlias

See [table plugin](#table-plugin) for an exmaple.

#### Transaction Filter
Every time editor updates its document, this type of plugins, i.e., Transaction Filter plugin is called.  Unlike ToolbarItem plugin, Transaction Filter does not modify, 

To create Transaction Filter plugin, create a new instance of [Transaction Filter](#class-transactionfilter) class and provide a valid [config](#config-1) as a first argument.


#### Examples
##### table plugin
A plugin that inserts markdown table syntax when clicked on the toolbar, or when ctrl + shift + t is pressed.
```javascript
//put this in ~/.agitcms/plugins
new ToolbarItem({
  initialChar: "T",
  keyAlias: "Ctrl-T",
  run: (editorView) => {
    const from =
      editorView.state.selection.ranges[editorView.state.selection.mainIndex]
        .to;
    const insert = "|  |  |\n|---|---|\n";

    editorView.dispatch({
      changes: { from, insert },
      selection: { anchor: from + 2 }, //puts cursor to from+2
    });
  },
});
```

##### shortcode snippet plugin
This is a plugin that works as a snippet. If you are using Hugo for example, you might want to add shortcode snippets.

The plugin below inserts ```{{</*alert `\n\n` [info] */>}}```
to editor and sets cursor at position between two \n.  
Also note that this plugin is activated for sites that has name `"0xsuk's blog"`. (Name of the site is the one you set in the home)
```javascript
const sitesToEnablePlugin = ["0xsuk's blog"];
new ToolbarItem({
  initialChar: "A",
  weight: 5,
  run: (editorView) => {
    const from =
      editorView.state.selection.ranges[editorView.state.selection.mainIndex]
        .to;
    const insert = "{{</*alert `\n\n` info*/>}}";

    editorView.dispatch({
      changes: { from, insert },
      selection: { anchor: from + 11 },
    });

    editorView.focus();
  },
  isActive: (siteConfig) => {
    if (sitesToEnablePlugin.includes(siteConfig.name)) {
      return true;
    }
    return false;
  },
});
```

##### autoclosebracket plugin
```javascript
function handleAutoclose(transactionSpecList, transaction) {
  return function forBracket(opening, closing) {
    transaction.changes.iterChanges((fromA, _, fromB, toB) => {
      const newChars = transaction.newDoc.sliceString(fromB, toB);
      if (newChars === opening) {
        transactionSpecList.push({
          changes: { from: fromA, insert: opening + closing },
          selection: { anchor: fromA + 1 },
          filter: false, //do not filter transaction for this update to prevent unintended behaviour
        });
      }
      if (newChars === closing) {
        //if the next char is also closing bracket, move cursor right
        const nextChar = transaction.startState.sliceDoc(fromA, fromA + 1);
        if (nextChar === closing) {
          transactionSpecList.push({
            selection: { anchor: fromA + 1 },
            filter: false,
          });
        }
      }
    });
  };
}
new TransactionFilter({
  fn: (transaction) => {
    const transactionSpecList = [];
    const forBracket = handleAutoclose(transactionSpecList, transaction);
    forBracket("[", "]");
    forBracket("(", ")");

    return transactionSpecList;
  },
});
```

##### japanese keymap
```javascript
new TransactionFilter({
  map: new Map([
    ["＃", "#"], //mapping japanese # to english #
    ["　", " "], //mapping japanese space to english space
  ]),
});
```

### Integrated Terminal
Press `Ctrl + @` to open/hide.  
Press `ctrl+d` to kill a process. If a process is killed, integrated terminal automatically closes.

Click `+` to add an instance.

If you navigate to Home while integrated terminal is open, all instances will be inaccesible, but still be running in the background.  

## Global settings
Navigate to Home (start page), and click on `Settings` in `GLOBAL` section of the sidebar.  

### Open Integrated Terminal with Ctrl+@
Disable this to prevent Agit CMS from opening an integrated terminal when ctrl+@ is captured.  

## Site settings
Go to one of site you added, and click on `Settings` in `SITE` section of the sidebar. 

### Frontmatter language
Define what language you use to represent frontmatter in markdown posts.

Default: `yaml`

### Frontmatter delimiters
Define what delimiters you use to wrap frontmatter.  
If you want to parse frontmatter in toml like below, you want to set frontmatter delimiters to `+++`, and frontmatter language to `toml`.  
```markdown
+++
title = example
+++
# Heading of the article
...
```

Default: `---`

### Frontmatter template
This one is optional but recommended if you want to parse frontmatter with correct types, or if you want to create new posts by `CREATE NEW` button of the Agit CMS file explorer.  

Frontmatter template specifies what type each property of frontmatter is attributed to.

This information is used when Agit CMS parses markdown and generates a type-aware frontmatter editor, or when Agit CMS creates a new post with default frontmatter values. 

#### example
Let's take a frontmatter below for example.
```markdown
---
title: Configuration
date: '2022-07-03T17:52:46+09:00'
draft: false
tags: ["React.js", "Web Dev"]
---
```
When Agit CMS parses frontmatter and generates a type-aware frontmatter editor, it tries to find a type for each property of frontmatter.

If you set `date` property of frontmatter to be a type of `Date` for instance, Agit CMS provides a date picker in the frontmatter editor.  
If you set `draft` to be a type of `Bool`, Agit CMS provides a boolean toggler in the frontmatter editor. 

#### Supported types
| type | |
| --- | --- |
| Text | plain text (ex. `title: Configuration`)|
| List of Text | list of text (ex. `tags: ["React.js", "Web Dev"]`) |
| Multiline Text | text with multiple lines |
| Date | date in ISO 8601 format (ex. `date: '2022-07-03T17:52:46+09:00'`) |
| Bool | `true` or `false` (ex. `draft: false`) |
| Nest | property that contains child properties |

### Media Folder Path
Specify where you store media (image, GIF and so on) in your file system.  

### Media Public Path
Specify the url path media content is accesible from.  

#### example
Suppose media folder path is `/home/mysite/static/uploads`, and `/home/mysite/static/uploads/example.png`'s url is `https://mywebsite.com/contents/images/example.png`.

Then media public path should be `/contents/images`.

## API Reference
### siteConfig
| property | desc |
|---|---|
| name | name of the site |
| key | unique id |
| path | the root path of the site |
| frontmatterLanguage | frontmatter language (yaml/toml) |
| frontmatterDelimiter | frontmatter delimiter |
| media.staticPath | static path (filesystem path) of the media folder |
| media.publicPath | public path (url path) of the media contents |
| pinnedDirs | array of pinned folders and files |
| frontmatter | frontmatter template |

### class Plugin
| property/method | desc | type | default |
|---|---|---|---|
| constructor({isActive}) | create new instance |
| isActive | Plugin is active or not | bool \| ([siteConfig](#siteconfig)) => bool | true |

### class ToolbarItem
subclass of [Plugin](#class-plugin)
| property/method | desc |
|---|---|
| constructor([config](#config)) | create new instance |
#### config
| property | desc | type | default |
|---|---|---|---|
| initialChar | single character that represents item in the toolbar | string | |
| tooltip | description of the tool | string | |
| weight | The more weight, the latter the item appears in the toolbar | number | |
| keyAlias | key to invoke the plugin. To learn more about key notation, visit https://codemirror.net/docs/ref/#view.KeyBinding | string | |
| run | action to perform. editorView holds information of the editor, and siteConfig holds configuration of the site. stateModule is a codemirror's state module, which has access to all the classes/constants exported from https://codemirror.net/docs/ref/#state. In most cases, you want to call editorView.[dispatch](https://codemirror.net/docs/ref/#view.EditorView.dispatch) to perform action on editor. | ([editorView](https://codemirror.net/docs/ref/#view.EditorView), [siteConfig](#siteconfig), [stateModule](https://codemirror.net/docs/ref/#state)) => void | () => alert("No action is registered for this toolbar item").  |
| isActive | = [Plugin](#class-plugin).isActive

### class TransactionFilter
subclass of [Plugin](#class-plugin)
| property/method | desc |
|---|---|
| constructor([config](#config-1)) | create new instance |
#### config
| property | desc | type | default |
|---|---|---|---|
| map | map key to another key | [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) | new Map() |
| fn | function to perform. Use this field to perform complicated job that you can't with map. | ([transaction](https://codemirror.net/docs/ref/#state.Transaction)) => [transaction](https://codemirror.net/docs/ref/#state.Transaction) | |
| isActive | = [Plugin](#class-plugin).isActive |



## Bugs and Questions
If you want to report a bug or have a question, create a new [issue](https://github.com/0xsuk/agitcms/issues). Don't forget to label it!

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
