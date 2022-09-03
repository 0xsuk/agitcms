export const createTool = ({ initialChar, tooltip, run }) => {
  return {
    initialChar,
    tooltip,
    run,
  };
};

const headingTool = createTool({
  initialChar: "#",
  tooltip: "Heading",
  run: (editorView) => {
    const cursorPos = editorView.state.selection.ranges[0].from;
    const lineBlock = editorView.lineBlockAt(cursorPos);
    const postAtLineBeginning = lineBlock.from;
    const doc = editorView.state.doc.toString();

    let isLineBeginningSharp = false;
    if (doc[postAtLineBeginning] === "#") isLineBeginningSharp = true;

    editorView.dispatch({
      changes: {
        from: postAtLineBeginning,
        insert: isLineBeginningSharp ? "#" : "# ",
      },
    });
    editorView.focus();
  },
});

export const defaultTools = [headingTool];
