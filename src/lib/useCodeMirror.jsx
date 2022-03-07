import { useEffect, useRef, useState } from "react";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

const useCodeMirror = (props) => {
  const refContainer = useRef(null);
  const [editorView, setEditorView] = useState();
  const { initialDoc, onChange } = props;

  useEffect(() => {
    console.warn("useCodeMirror effect");
    if (!refContainer.current) {
      console.warn("refContainer is null");
      return;
    }

    const startState = EditorState.create({
      doc: initialDoc,
      extensions: [
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
  }, []); //do I need to include refContainer as a dependency?

  return [refContainer, editorView];
};

export default useCodeMirror;
