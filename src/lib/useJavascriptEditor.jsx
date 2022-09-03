import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { useEffect, useRef, useState } from "react";
import { oneDark } from "../styles/cm-dark-theme";

function useJavascriptEditor({ doc, setDoc }) {
  const ref = useRef(null);
  const [view, setView] = useState(null);
  useEffect(() => {
    const startState = EditorState.create({
      doc,
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setDoc(update.state.doc.toString());
          }
        }),
        oneDark,
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
  }, [view]);

  return [ref, view];
}

export default useJavascriptEditor;
