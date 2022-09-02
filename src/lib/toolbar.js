export const createTool = ({
  initialChar,
  run = (editorView, ...args) => {},
}) => {
  return {
    initialChar,
    run,
  };
};

const headingTool = createTool({
  initialChar: "H",
  run: (editorView, ...args) => {
    console.log(editorView, args);
  },
});
export const defaultTools = [headingTool];
