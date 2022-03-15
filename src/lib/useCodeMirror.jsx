import { useEffect, useRef, useState } from "react";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { lineNumbers } from "@codemirror/gutter";

const useCodeMirror = (initialDoc, onChange) => {
  const refContainer = useRef(null);
  const [editorView, setEditorView] = useState();

  useEffect(() => {
    console.warn("useCodeMirror effect");
    if (!refContainer.current) {
      console.warn("refContainer is null");
      return;
    }

    const startState = EditorState.create({
      doc: initialDoc,
      extensions: [
        EditorView.lineWrapping,
        lineNumbers(),
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: refContainer.current,
    });

    setEditorView(view);
  }, []); //eslint-disable-line
  //do I need to include refContainer as a dependency?

  return [refContainer, editorView];
};

export default useCodeMirror;
