import { v4 } from "uuid";

export const pluginTypes = {
  toolbarItem: "Toolbar Item",
  keyBinding: "Key Binding",
};
export const createTool = ({ initialChar, tooltip, run }) => {
  return {
    key: v4(),
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

export const defaultPlugins = defaultTools.map((tool) => ({
  type: pluginTypes.toolbarItem,
  key: tool.key,
  default: true,
}));
