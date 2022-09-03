export const createTool = ({ initialChar, tooltip, run }) => {
  return {
    initialChar,
    tooltip,
    run,
  };
};

const headingTool = createTool({
  initialChar: "H",
  tooltip: "Heading",
  run: (editorView) => {
    console.log(editorView);
  },
});

export const defaultTools = [headingTool];
