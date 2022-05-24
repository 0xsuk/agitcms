import Editor from "@toast-ui/editor";

function useTuiEditor(initialValue, update) {
  const editor = new Editor({
    el: document.getElementById("editor-tab"),
    initialValue,
    frontMatter: true,
    height: "100%",
    previewStyle: "vertical",
    events: {
      change: () => update(editor),
    },
  });

  //TODO
  editor.insertToolbarItem(
    { groupIndex: 0, itemIndex: 0 },
    {
      name: "myItem",
      tooltip: "Custom Button",
      command: "boldasdf",
      text: "@",
      className: "toastui-editor-toolbar-icons first",
      style: { backgroundImage: "none" },
    }
  );

  return editor;
}

export default useTuiEditor;
