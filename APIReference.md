# API Reference
## siteConfig
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

## class Plugin
| property/method | desc | type | default |
|---|---|---|---|
| constructor({isActive}) | create new instance |
| isActive | Plugin is active or not | bool \| ([siteConfig](#siteconfig)) => bool | true |

## class ToolbarItem
subclass of [Plugin](#class-plugin)
| property/method | desc |
|---|---|
| constructor([config](#config)) | create new instance |
### config
| property | desc | type | default |
|---|---|---|---|
| initialChar | single character that represents item in the toolbar | string | |
| tooltip | description of the tool | string | |
| weight | The more weight, the latter the item appears in the toolbar | number | |
| keyAlias | key to invoke the plugin. To learn more about key notation, visit [here](https://codemirror.net/docs/ref/#view.KeyBinding) | string | |
| run | action to perform. editorView holds information of the editor, and siteConfig holds configuration of the site. stateModule is a codemirror's state module, which has access to all the classes/constants exported from https://codemirror.net/docs/ref/#state. In most cases, you want to call editorView.[dispatch](https://codemirror.net/docs/ref/#view.EditorView.dispatch) to perform action on editor. | ([editorView](https://codemirror.net/docs/ref/#view.EditorView), [siteConfig](#siteconfig), [stateModule](https://codemirror.net/docs/ref/#state)) => void | () => alert("No action is registered for this toolbar item").  |
| isActive | = [Plugin](#class-plugin).isActive

## class TransactionFilter
subclass of [Plugin](#class-plugin)
| property/method | desc |
|---|---|
| constructor([config](#config-1)) | create new instance |
### config
| property | desc | type | default |
|---|---|---|---|
| map | map key to another key | [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) | new Map() |
| fn | function to perform. Use this field to perform complicated job that you can't with map. | ([transaction](https://codemirror.net/docs/ref/#state.Transaction)) => [transaction](https://codemirror.net/docs/ref/#state.Transaction) | |
| isActive | = [Plugin](#class-plugin).isActive |

