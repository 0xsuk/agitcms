import { defaultKeymap, historyKeymap, history } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import DateFnsAdapter from "@date-io/date-fns";
import { tags } from "@lezer/highlight";
import path from "path";
import { useEffect, useRef, useState } from "react";
import useSiteConfig from "../lib/useSiteConfig";
import { oneDark } from "../styles/cm-dark-theme";
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

function useCodemirror({ fileManager }) {
  const ref = useRef(null);
  const [view, setView] = useState(null);
  const fileManagerRef = useRef(null);
  fileManagerRef.current = fileManager;

  const siteConfig = useSiteConfig();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    fileManagerRef.current.readFile().then(({ content, err }) => {
      if (err) {
        alert(err);
        return;
      }
      const { doc } = fileManagerRef.current.setContent(content);
      const startState = EditorState.create({
        doc,
        contentHeight: "100%",
        extensions: [
          keymap.of([...defaultKeymap, ...historyKeymap]),
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
            console.log(update.transactions);
            if (update.docChanged) {
              fileManagerRef.current.setDoc(update.state.doc.toString());
            }
          }),
          oneDark,
          EditorView.domEventHandlers({
            paste(pasteEvent, view) {
              if (!siteConfig.media.staticPath) return;
              const item = pasteEvent.clipboardData.items[0];
              if (item.type.indexOf("image") === 0) {
                //image
                const fileName =
                  dateFns.formatByString(
                    dateFns.date(),
                    "yyyy-MM-dd-HH:mm:ss"
                  ) + ".png";
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = async (e) => {
                  const err = await window.electronAPI.saveImage(
                    path.join(siteConfig.media.staticPath, fileName), //TODO
                    e.target.result
                  );
                  if (err) {
                    alert(err);
                    return;
                  }

                  const position =
                    view.state.selection.ranges[view.state.selection.mainIndex]
                      .to;
                  view.dispatch({
                    changes: {
                      from: position,
                      insert:
                        "![](" +
                        path.join(siteConfig.media.publicPath, fileName) +
                        ")",
                    },
                  });
                };

                reader.readAsBinaryString(blob);
              }
            },
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: ref.current,
      });

      setView(view);
    });
  }, [ref]);

  return [ref, view];
}

export default useCodemirror;
