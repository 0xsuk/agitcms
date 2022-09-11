new ToolbarItem({
  initialChar: "#",
  tooltip: "Heading",
  weight: 0,
  run: (editorView) => {
    const cursorPos =
      editorView.state.selection.ranges[editorView.state.selection.mainIndex]
        .from;
    const lineBlock = editorView.lineBlockAt(cursorPos);
    const posAtLineBeginning = lineBlock.from;
    const doc = editorView.state.doc.toString();

    let isLineBeginningSharp = false;
    if (doc[posAtLineBeginning] === "#") isLineBeginningSharp = true;

    editorView.dispatch({
      changes: {
        from: posAtLineBeginning,
        insert: isLineBeginningSharp ? "#" : "# ",
      },
    });
    editorView.focus();
  },
});
