import { useEffect, useRef, useState } from "react";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

const useCodeMirror = (props) => {
  const refContainer = useRef(null);
  const [editorView, setEditorView] = useState();
  const { initialDoc, onChange } = props;

  useEffect(() => {
    if (!refContainer.current) {
      console.log("refContainer is null");
      return;
    }

    const startState = EditorState.create({
      doc: initialDoc,
      extensions: [
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            console.log("u")
            onChange(update.state);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: refContainer.current,
    });

    setEditorView(view);
  }, [refContainer]);

  return [refContainer, editorView];
};

export default useCodeMirror;
