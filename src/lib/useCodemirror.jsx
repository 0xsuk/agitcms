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
import { oneDark } from "../styles/cm-dark-theme";
import useSiteConfig from "../lib/useSiteConfig";
import path from "path";

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
            console.log({ transaction: update.transactions });
            if (update.docChanged) {
              fileManagerRef.current.setDoc(update.state.doc.toString());
            }
          }),
          oneDark,
          EditorView.domEventHandlers({
            paste(pasteEvent) {
              const item = pasteEvent.clipboardData.items[0];
              if (item.type.indexOf("image") === 0) {
                //image
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (e) => {
                  window.electronAPI.saveImage(
                    path.join(siteConfig.media.staticPath, "image.png"), //TODO
                    e.target.result
                  );
                };

                //reader.readAsDataURL(blob);
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
