import { v4 } from "uuid";
export class Tool {
  constructor(initialChar, action) {
    this.id = v4();
    this.initialChar = initialChar;
    this.action = action;
  }
}

let toolbar;
export class Toolbar {
  constructor(view) {
    if (toolbar) return toolbar;

    this.view = view;
    this.tools = [];
    toolbar = this;
  }
  mount(...tools) {
    this.tools = tools;
  }

  fire(toolId, ...args) {
    for (let i = 0; i < toolId.length; i++) {
      if ((this.tools[i].id = toolId)) {
        this.tools[i].action(this.view, ...args);
        break;
      }
    }
  }
}

const headingTool = new Tool("H", (view, ...args) => {
  console.log("heading tool", view, args);
});

export const defaultTools = [headingTool];
