import Editor from "@toast-ui/editor";

{
  /* TODO: content not updated when frontmatter changed */
}
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

  return editor;
}

export default useTuiEditor;
