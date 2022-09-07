new ToolbarItem({
  initialChar: "B",
  tooltip: "Bold (Ctrl-b)",
  weight: 1,
  keyAlias: "Ctrl-b",
  run: (editorView, _, { EditorSelection, Text }) => {
    const changes = editorView.state.changeByRange((range) => {
      return {
        changes: [
          {
            from: range.from,
            insert: Text.of(["**"]),
          },
          {
            from: range.to,
            insert: Text.of(["**"]),
          },
        ],
        range: EditorSelection.range(range.from + 2, range.to + 2),
      };
    });

    editorView.dispatch(changes);
    editorView.focus();
  },
});
