import { v4 } from "uuid";

class Plugin {
  constructor({ isActive = true }) {
    this.key = v4();
    this.isActive = isActive;
  }
}
let sortedWeights = [];
export class ToolbarItem extends Plugin {
  constructor({ initialChar, tooltip, weight, run, keyAlias, isActive }) {
    super({ isActive });
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
  }
}

export class TransactionFilter extends Plugin {
  constructor({ map = new Map(), fn, weight, isActive }) {
    super({ isActive });
    this.map = map;
    this.fn = fn;
    this.weight = weight;
  }

  update(tr) {
    if (!tr.docChanged) return tr;
    const inserted = tr.changes.inserted;

    if (inserted.length === 2 && inserted[1].text.length) {
      const oldChar = inserted[1].text[0];
      const newChars = this.map.get(oldChar);
      if (newChars !== undefined) {
        tr = tr.startState.update({
          changes: {
            from: tr.startState.selection.ranges[0].from,
            insert: newChars,
          },
          selection: {
            anchor: tr.startState.selection.ranges[0].from + newChars.length,
          },
          filter: false,
        });
      }
    }
    //don't know why but at position 0 (first character) inserted.length is 1
    if (inserted.length === 1 && inserted[0].text.length) {
      const oldChar = inserted[0].text[0];
      const newChars = this.map.get(oldChar);
      if (newChars !== undefined) {
        tr = tr.startState.update({
          changes: {
            from: tr.startState.selection.ranges[0].from,
            insert: newChars,
          },
          selection: {
            anchor: tr.startState.selection.ranges[0].from + newChars.length,
          },
          filter: false,
        });
      }
    }

    //if new line
    if (
      this.map.get("\n") !== undefined &&
      inserted.length === 2 &&
      inserted[1].text[0] === "" &&
      inserted[1].text[1] === ""
    ) {
      const newChars = this.map.get("\n");
      tr = tr.startState.update({
        changes: {
          from: tr.startState.selection.ranges[0].from,
          insert: newChars,
        },
        selection: {
          anchor: tr.startState.selection.ranges[0].from + newChars.length,
        },
        filter: false,
      });
    }

    //if new line in first position
    if (
      this.map.get("\n") !== undefined &&
      inserted.length === 1 &&
      inserted[0].text[0] === "" &&
      inserted[0].text[1] === ""
    ) {
      const newChars = this.map.get("\n");
      tr = tr.startState.update({
        changes: {
          from: tr.startState.selection.ranges[0].from,
          insert: newChars,
        },
        selection: {
          anchor: tr.startState.selection.ranges[0].from + newChars.length,
        },
        filter: false,
      });
    }

    if (this.fn) {
      tr = this.fn(tr);
    }
    return tr;
  }
}
