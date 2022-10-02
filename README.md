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


## Install
`npm install -g agitcms`  

To start: `agitcms`  
To change port: `AGIT_FRONTEND=3001 agitcms`  


## Features
- [Vertical split style markdown editor](#markdown-editor).
- [type-aware frontmatter interface](/agitcms/quick-start/#frontmatter-editor)
- [Integrated Terminal](/agitcms/quick-start/#integrated-terminal)
- mathjax rendering: $ a + b = c$
- image pasting into editor
- custom frontmatter language(yaml/toml) & delimiters
- custom editor snippet/toolbar/keymap



Agit CMS tries to be a hackable headless CMS.  
  
  
## Comparison with other CMS  

|  | Agit CMS | Netlify CMS |
|---|---|---|
| Markdown or WYSIWYG | Markdown | Both |
| Where CMS runs | Runs on your computer | Runs on website's /admin | 

 

### Quick Start
#### Installation
Install latest binary from [here](https://github.com/0xsuk/agitcms/releases)

{{< alert `
When downloading a binary, some warning will be displayed because Agit CMS is yet to be trusted by Windows/Mac. To suppress warning and continue, please reference below. Mac: Find agitcms in Finder. Click on the app pressing ctrl key. Select "Open". (Open a Mac app from an unidentified developer - Apple Support) Windows: If "Windows protected your PC", click on "More info", and select "Run anyway".
` info >}} 

#### Adding a site

Open Agit CMS and click `NEW` button. 

Type your site’s name, and root folder path of the static site.
These two configurations cannot be changed afterwards unless you modify ~/.agitcms/config.json directly.

Once you add a new site, click on it, then Agit CMS provides a file explorer where you can navigate through folders and files thas have `.md` extension.

Click `PIN` button at the very top to pin a folder or a file to left sidebar for easy access.

#### Integrated Terminal
Press `Control + @` to open up a integrated terminal.

Try starting a server of your static sites generator.

In hugo: `hugo server`  
In jekyll: `jekyll server`

![](/uploads/2022-07-03-16:38:13.png)

Now your preview server is running on your host!

#### Modifying a post
Click on a markdown file you want to edit in file explorer.

Agit CMS provides a markdown editor with nice syntax highlighting and keymaps.

Type some text, right pane automatically renders markdown in a Github flavored style,

##### Frontmatter Editor
Click on a Frontmatter tab in the editor.
Agit CMS automatically scans frontmatter section of your existing post, and provides a **type-aware frontmatter editor** like this.

![](/uploads/2022-07-03-16:50:25.png)

which is equal to
```markdown
---
title: Quick Start
type: docs
date: '2022-07-03T16:11:40+09:00'
draft: false
comment: true
toc: true
reward: false
pinned: false
featured: false
math: false
categories: []
tags: []
series: []
images:
  - '![](/uploads/2022-07-03-16:38:13.png)'
---
```

You can confirm that for example, since `draft` is a boolean value, Agit CMS provides a boolean toggler for `draft`.

You can learn more about how to configure frontmatter [language](/agitcms/configuration/#frontmatter-language), [delimiters](/agitcms/configuration/#frontmatter-delimiters) and its [types](/agitcms/configuration/#frontmatter-template) in the next page. 


### Configuration
Agit CMS configration is really simple.  

There's two configurations.  
1. Global configuration: applies globally.  
2. Site configuration: applies only to specific site.


Let's start with Global configuration
#### Global configuration
Navigate to Home (start page), and click on `Settings` in `GLOBAL` section of the sidebar.  

##### Open Integrated Terminal with Ctrl+@
Disable this to prevent Agit CMS from opening an integrated terminal when ctrl+@ is captured.  

##### Zoom
Change zoom rate.  

#### Site configuration
Go to one of site you added, and click on `Settings` in `SITE` section of the sidebar. 

##### Frontmatter language
Define what language you use to represent frontmatter in markdown posts.

Default: `yaml`

##### Frontmatter delimiters
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

##### Frontmatter template
This one is optional but recommended if you want to parse frontmatter with correct types, or if you want to create new posts by `CREATE NEW` button of the Agit CMS file explorer.  

Frontmatter template specifies what type each property of frontmatter attributed to.

This information is used when Agit CMS parses markdown and generates a [type-aware frontmatter editor](/agitcms/quick-start/#frontmatter-editor), or when Agit CMS creates a new post with default frontmatter values. 

###### example
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

###### Supported types
| type | |
| --- | --- |
| Text | plain text (ex. `title: Configuration`)|
| List of Text | list of text (ex. `tags: ["React.js", "Web Dev"]`) |
| Multiline Text | text with multiple lines |
| Date | date in ISO 8601 format (ex. `date: '2022-07-03T17:52:46+09:00'`) |
| Bool | `true` or `false` (ex. `draft: false`) |
| Nest | property that contains child properties |

##### Media Folder Path
Specify where you store media (image, GIF and so on) in your file system.  

##### Media Public Path
Specify the url path media content is accesible from.  

###### example
Suppose media folder path is `/home/mysite/static/uploads`, and `/home/mysite/static/uploads/example.png`'s url is `https://mywebsite.com/contents/images/example.png`.

Then media public path should be `/contents/images`.

### Editor
#### keymaps
Visit [here](https://codemirror.net/docs/ref/#h_keymaps) and [here](https://codemirror.net/docs/ref/#commands.historyKeymap) for keymaps available by default.  

Want to add your own keymaps?  
Try creating your own [plugin](http://localhost:1313/agitcms/plugins/)!

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
Agit CMS supports `Ctrl + v` to paste image into the editor.  

This feature is useful when you want to past a screen capture without looking for its file name.

Set [media folder path](/agitcms/configuration/#media-folder-path) and [media public path](/agitcms/configuration/#media-public-path) to enable this feature.  


{{< alert "At this version, all images pasted into the editor is saved in `year-month-date-time.png` format" info>}}

#### Media
`![](${media_public_path}/example.png)` written in the markdown editor panel (left side) gets parsed into `<img src="http://localhost:${random_port}/${media_public_path}/example.png">` in the preview panel at the right side .  (`${media_public_path}` is a [media public path](/agitcms/configuration/#media-public-path))

Agit CMS starts local http server on ${random_port} at [media folder path](/agitcms/configuration/#media-folder-path) in the filesystem to serve media contents.  
Http server automatically closes when Agit CMS is closed.  

There's a couple of things to note
- On Windows, you have to tell windows to allow Agit CMS to start http server when warning is shown. 
- Image placed at the same folder as the markdown post file is in cannot be previewed at this version.  

To quickly get image path you want to insert into the editor, Agit CMS has a file explorer shortcut button `Media` for it.  
It opens [media folder path](/agitcms/configuration/#media-folder-path), and selected image's public path will be copied into your clipboard.  
This way, you can easily type `![](${ctrl + v})` (where `${ctrl + v}` means pressing `ctrl + v`) to insert the image.  

### Plugins
The markdown editor of Agit CMS (Codemirror) can be customized by creating your own plugins.

Agit CMS evaluate javascript files in `~/.agitcms/plugins` as plugins when boot, so you can place your own javascript file here to create a plugin. Name of the file does not matter.

Creating your own plugin requires a bit of knowledge of codemirror. If you don't know any, [Examples](#examples) is helpful.

There’s two types of plugins.  
- Toolbar Item: manually invoked
- TransactionFilter: automatically invoked

#### Toolbar Item
To create Toolbar Item plugin, create a new instance of [ToolbarItem](/agitcms/api-reference/#class-toolbaritem) class and provide a valid [config](/agitcms/api-reference/#config) as a first argument.

If you don't want your plugin to show up in the toolbar, set [config](/agitcms/api-reference/#config).initialChar to empty. That way you can only call plugin via [config](/agitcms/api-reference/#config).keyAlias

See [table plugin](#table-plugin) for an exmaple.

#### Transaction Filter
Every time editor updates its document, this type of plugins, i.e., Transaction Filter plugin is called.  Unlike ToolbarItem plugin, Transaction Filter does not modify, 

To create Transaction Filter plugin, create a new instance of [Transaction Filter](/agitcms/api-reference/#class-transactionfilter) class and provide a valid [config](/agitcms/api-reference/#config-1) as a first argument.


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
### API Reference
#### siteConfig
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

#### class Plugin
| property/method | desc | type | default |
|---|---|---|---|
| constructor({isActive}) | create new instance |
| isActive | Plugin is active or not | bool \| ([siteConfig](#siteConfig)) => bool | true |

#### class ToolbarItem
subclass of [Plugin](#Plugin)
| property/method | desc |
|---|---|
| constructor([config](#config)) | create new instance |
##### config
| property | desc | type | default |
|---|---|---|---|
| initialChar | single character that represents item in the toolbar | string | |
| tooltip | description of the tool | string | |
| weight | The more weight, the latter the item appears in the toolbar | number | |
| keyAlias | key to invoke the plugin. To learn more about key notation, visit https://codemirror.net/docs/ref/#view.KeyBinding | string | |
| run | action to perform. editorView holds information of the editor, and siteConfig holds configuration of the site. stateModule is a codemirror's state module, which has access to all the classes/constants exported from https://codemirror.net/docs/ref/#state. In most cases, you want to call editorView.[dispatch](https://codemirror.net/docs/ref/#view.EditorView.dispatch) to perform action on editor. | ([editorView](https://codemirror.net/docs/ref/#view.EditorView), [siteConfig](#siteConfig), [stateModule](https://codemirror.net/docs/ref/#state)) => void | () => alert("No action is registered for this toolbar item").  |
| isActive | = [Plugin](#Plugin).isActive

#### class TransactionFilter
subclass of [Plugin](#Plugin)
| property/method | desc |
|---|---|
| constructor([config](#config)) | create new instance |
##### config
| property | desc | type | default |
|---|---|---|---|
| map | map key to another key | [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) | new Map() |
| fn | function to perform. Use this field to perform complicated job that you can't with map. | ([transaction](https://codemirror.net/docs/ref/#state.Transaction)) => [transaction](https://codemirror.net/docs/ref/#state.Transaction) | |
| isActive | = [Plugin](#Plugin).isActive |



### Bugs and Questions
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
