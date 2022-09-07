import { v4 } from "uuid";

class Plugin {
  constructor() {
    this.key = v4();
  }
}
let sortedWeights = [];
export class ToolbarItem extends Plugin {
  constructor({ initialChar, tooltip, weight, run, keyAlias }) {
    super();
    if (sortedWeights.includes(weight)) {
      weight = sortedWeights[sortedWeights.length - 1] + 1;
    }
    sortedWeights.push(weight);
    sortedWeights.sort();

    if (!run) {
      run = () => alert("No action is registered for this toolbar item");
    }
    this.initialChar = initialChar;
    this.tooltip = tooltip;
    this.weight = weight;
    this.run = run;
    this.keyAlias = keyAlias;
    return this;
  }
}
