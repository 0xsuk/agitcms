import { siteContext } from "@/context/SiteContext";
import { oneDark } from "@/styles/cm-dark-theme";
import useSiteConfig from "@/utils/useSiteConfig";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import * as stateModule from "@codemirror/state";
import { EditorState, TransactionSpec } from "@codemirror/state";
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  KeyBinding,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import DateFnsAdapter from "@date-io/date-fns";
import { tags } from "@lezer/highlight";
import * as path from "path";
import { useContext, useEffect, useRef, useState } from "react";
import { IFileManager } from "@/utils/useFileManager";
import { ToolbarItem, TransactionFilter } from "./plugin";
import { socketClient } from "./socketClient";
const dateFns = new DateFnsAdapter();

const markdownHighlighting = HighlightStyle.define([
  { tag: tags.heading1, fontSize: "2.0em" },
  {
    tag: tags.heading2,
    fontSize: "1.5em",
  },
  {
    tag: tags.heading3,
    fontSize: "1.25em",
  },
  {
    tag: tags.heading4,
    fontSize: "1em",
  },
  {
    tag: tags.heading5,
    fontSize: "0.875em",
  },
  {
    tag: tags.heading6,
    fontSize: "0.85em",
  },
]);

const handleScrollBottom = () => {
  const cmEditor = document.querySelector(
    "#editor-markdown > .cm-editor"
  ) as HTMLElement;
  cmEditor.scrollIntoView(false); //scrolls to bottom
};

const handlePasteImage = (
  pasteEvent: ClipboardEvent,
  view: EditorView,
  staticPath: string | undefined,
  publicPath: string | undefined
) => {
  if (!staticPath || publicPath === undefined || !pasteEvent.clipboardData)
    return;
  const item = pasteEvent.clipboardData.items[0];
  if (item.type.indexOf("image") !== 0) return;
  //image
  const fileName =
    dateFns.formatByString(dateFns.date(), "yyyy-MM-dd-HH:mm:ss") + ".png"; //TODO
  const blob = item.getAsFile();
  const reader = new FileReader();
  reader.onload = async (e: any) => {
    const err = await socketClient.saveImage({
      filePath: path.join(staticPath, fileName),
      binary: e.target.result,
    });
    if (err !== null) {
      err.warn();
      return;
    }

    const position =
      view.state.selection.ranges[view.state.selection.mainIndex].to;
    view.dispatch({
      changes: {
        from: position,
        insert: "![](" + path.join(publicPath, fileName) + ")",
      },
    });
  };

  //@ts-ignore because it works
  reader.readAsBinaryString(blob);
};

function useCodemirror({ fileManager }: { fileManager: IFileManager }) {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<EditorView | null>(null);
  const siteConfig = useSiteConfig();
  if (!siteConfig) throw Error("site config is null");
  const { state } = useContext(siteContext);

  const toolbarItems = state.plugins.filter(
    (plugin) => plugin instanceof ToolbarItem
  ) as ToolbarItem[];

  const toolKeymap: KeyBinding[] = toolbarItems
    .filter((tool) => typeof tool.keyAlias === "string" && tool.keyAlias !== "")
    .map((tool) => ({
      key: tool.keyAlias,
      run: (editorView: EditorView) =>
        tool.run(editorView, siteConfig, stateModule),
    }));

  const transactionFilters = state.plugins.filter(
    (plugin) => plugin instanceof TransactionFilter
  ) as TransactionFilter[];

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const startState = EditorState.create({
      doc: fileManager.file.doc,
      extensions: [
        //the earlier, the more priority
        keymap.of([...toolKeymap, ...defaultKeymap, ...historyKeymap]),
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        markdown({
          base: markdownLanguage, //Support GFM
          addKeymap: true,
        }),
        syntaxHighlighting(markdownHighlighting),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const modifiedPos =
              update.state.selection.ranges[update.state.selection.mainIndex]
                .to;
            //const modifiedPos = update.changedRanges[0].toB; //position of last("to") modified range in the changed state("B")
            const modifiedLine = update.state.doc.lineAt(modifiedPos).number;
            const lastLine = update.state.doc.lines;
            if (modifiedLine === lastLine) {
              handleScrollBottom();
            }
            //TODO rerender cause performance issue
            fileManager.setDoc(update.state.doc.toString());
          }
        }),
        oneDark,
        EditorView.domEventHandlers({
          paste(pasteEvent: ClipboardEvent, view) {
            handlePasteImage(
              pasteEvent,
              view,
              siteConfig.media.staticPath,
              siteConfig.media.publicPath
            );
          },
        }),
        EditorState.transactionFilter.of((tr) => {
          const transactionSpecList: TransactionSpec[] = [];
          transactionFilters.forEach((transactionFilter) => {
            const specList = transactionFilter.update(tr); //undefined | transactionSpec[]
            if (!specList) return;
            if (Array.isArray(specList) && specList.length) {
              transactionSpecList.push(...specList);
            }
          });
          if (transactionSpecList.length) {
            return transactionSpecList;
          }
          return tr;
        }),
      ],
    });

    if (view) {
      view.setState(startState);
      return;
    }
    const newView = new EditorView({
      state: startState,
      parent: ref.current,
    });

    setView(newView);
  }, [ref]);

  return { editorRef: ref, editorView: view };
}

export default useCodemirror;
