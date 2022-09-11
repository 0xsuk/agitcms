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
    this.isImplicit = !initialChar;
    this.tooltip = tooltip;
    this.weight = weight;
    this.run = run;
    this.keyAlias = keyAlias;
  }
}

export class TransactionFilter extends Plugin {
  constructor({ map = new Map(), fn, isActive }) {
    super({ isActive });
    this.map = map;
    this.fn = fn;
  }

  update(tr) {
    if (!tr.docChanged) return;
    const transactionSpecList = [];
    tr.changes.iterChanges((fromA, _, fromB, toB) => {
      const newChars = tr.newDoc.sliceString(fromB, toB);
      const altChars = this.map.get(newChars);
      if (altChars !== undefined) {
        transactionSpecList.push({
          changes: { from: fromA, insert: altChars },
          selection: { anchor: fromA + altChars.length },
          filter: false,
        });
      }
    });
    if (this.fn) {
      const spec = this.fn(tr);
      if (spec && Array.isArray(spec) && spec.length) {
        const specList = spec;
        transactionSpecList.push(...specList);
      } else if (spec && !Array.isArray(spec)) {
        transactionSpecList.push(spec);
      }
    }
    return transactionSpecList;
  }
}
