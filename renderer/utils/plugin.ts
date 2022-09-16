import { Transaction, TransactionSpec } from "@codemirror/state";
import { ISiteConfig } from "@shared/types/config";
import { randomid } from "@shared/utils/randomid";
import { EditorView } from "codemirror";

interface IPluginConfig {
  isActive: boolean | ((siteConfig: ISiteConfig) => boolean);
}
export class Plugin {
  readonly key;
  readonly isActive;
  constructor({ isActive = true }: IPluginConfig) {
    this.key = randomid();
    this.isActive = isActive;
  }
}

interface IToolbarItemConfig extends IPluginConfig {
  readonly initialChar?: string;
  readonly tooltip?: string;
  readonly weight?: number;
  readonly keyAlias?: string;
  run: (
    editorView: EditorView,
    siteConfig: ISiteConfig,
    stateModule: any
  ) => boolean;
}
export class ToolbarItem extends Plugin {
  private static sortedWeights: number[] = [];
  initialChar?;
  tooltip;
  weight;
  keyAlias?;
  isImplicit;
  run;
  constructor({
    initialChar,
    tooltip = "",
    weight,
    run,
    keyAlias,
    isActive,
  }: IToolbarItemConfig) {
    super({ isActive });
    const isWeightValid =
      typeof weight === "number" && !ToolbarItem.sortedWeights.includes(weight);
    if (weight === undefined || !isWeightValid) {
      weight = (ToolbarItem.sortedWeights[
        ToolbarItem.sortedWeights.length - 1
      ] + 1) as number;
    }
    ToolbarItem.sortedWeights.push(weight);
    ToolbarItem.sortedWeights.sort();

    if (!run) {
      run = () => {
        alert("No action is registered for this toolbar item");
        return false;
      };
    }
    this.initialChar = initialChar;
    this.isImplicit = !initialChar;
    this.tooltip = tooltip;
    this.weight = weight;
    this.run = run;
    this.keyAlias = keyAlias;
  }
}

interface ITransactionFilterConfig extends IPluginConfig {
  map?: Map<string, string>;
  fn: (tr: Transaction) => TransactionSpec[];
}

export class TransactionFilter extends Plugin {
  readonly map;
  readonly fn;
  constructor({ map = new Map(), fn, isActive }: ITransactionFilterConfig) {
    super({ isActive });
    this.map = map;
    this.fn = fn;
  }

  update(tr: Transaction) {
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
