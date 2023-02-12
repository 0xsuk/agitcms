# Plugins
The markdown editor of Agit CMS (CodeMirror) can be customized by creating your own plugins. 
Plugins will have more access to native editor functionality in the future version.

Agit CMS evaluates javascript files in `~/.agitcms/plugins/` as plugins when boot, so you can place your own javascript file here to create a plugin. Name of the file does not matter.

Creating your own plugin requires a bit of knowledge of codemirror. If you don't know any, [Examples](#examples) is helpful.

There are two types of plugins.  
- Toolbar Item: manually invoked by clicking the toolbar or by keyboard shortcut
- TransactionFilter: automatically invoked before editor updates

## Toolbar Item
To create Toolbar Item plugin, create a new instance of [ToolbarItem](/APIReference.md#class-toolbaritem) class and provide a valid [config](/APIReference.md#config) as a first argument.

If you don't want your plugin to show up in the toolbar, set [config](/APIReference.md#config).initialChar to empty. That way you can only call the plugin via [config](/APIReference.md#config).keyAlias

See [table plugin](#table-plugin) for an exmaple.

## Transaction Filter
Every time editor updates its document, this type of plugins, i.e., Transaction Filter plugin is called.  Unlike ToolbarItem plugin, Transaction Filter does not modify, 

To create Transaction Filter plugin, create a new instance of [Transaction Filter](/APIReference.md#class-transactionfilter) class and provide a valid [config](/APIReference.md#config-1) as a first argument.


## Examples
### table plugin
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

### shortcode snippet plugin
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

### autoclosebracket plugin
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

### japanese keymap
日本語入力の際に＃やスペースをおすためだけに英語入力に切り替えたくないので
```javascript
new TransactionFilter({
  map: new Map([
    ["＃", "#"], //mapping japanese # to english #
    ["　", " "], //mapping japanese space to english space
  ]),
});
```
