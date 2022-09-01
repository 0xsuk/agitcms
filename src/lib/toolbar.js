export class Tool {
  constructor(initialChar, action) {
    this.initialChar = initialChar;
    this.action = action;
  }
}

const headingTool = new Tool("H", (editorView, ...args) => {
  console.log("heading tool", editorView, args);
});

export const defaultTools = [headingTool];
