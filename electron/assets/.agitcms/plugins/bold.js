new ToolbarItem({
  initialChar: "B",
  tooltip: "Bold (Ctrl-b)",
  weight: 1,
  keyAlias: "Ctrl-b",
  run: (editorView, _, { Text }) => {
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
        filter: false,
      };
    });

    editorView.dispatch(changes);
    editorView.focus();
  },
});
