import { useRef, useState, useEffect, useContext } from "react";
import { configContext } from "../context/ConfigContext";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from "@codemirror/view";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { oneDark } from "@codemirror/theme-one-dark";

const markdownHighlighting = HighlightStyle.define([
  { tag: tags.heading1, fontSize: "1.6em", fontWeight: "bold" },
  {
    tag: tags.heading2,
    fontSize: "1.4em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading3,
    fontSize: "1.2em",
    fontWeight: "bold",
  },
]);

function useCodemirror({ fileManager }) {
  const { config } = useContext(configContext);
  const ref = useRef(null);
  const [view, setView] = useState(null);
  const fileManagerRef = useRef(null);
  fileManagerRef.current = fileManager;

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    console.log("useCodeMirror");
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
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          markdown({
            base: markdownLanguage, //Support GFM
          }),
          syntaxHighlighting(markdownHighlighting),
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              fileManagerRef.current.setDoc(update.state.doc.toString());
            }
          }),
          config.theme === "dark" && oneDark,
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
