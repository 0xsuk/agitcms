import { useRef, useState, useEffect } from "react";
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

function useCodemirror(fileManager) {
  const ref = useRef(null);
  const [view, setView] = useState(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    console.log("useCodeMirror");
    fileManager.readFile().then(({ content, err }) => {
      if (err) {
        alert(err);
        return;
      }
      const startState = EditorState.create({
        doc: content,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          markdown({
            base: markdownLanguage, //Support GFM
          }),
          syntaxHighlighting(markdownHighlighting),
          EditorView.lineWrapping,
          //EditorView.updateListener.of((update) => {
          //  //also invoke when doc is first set
          //  fileManager.setContent(update.state.doc.toString());
          //}),
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
