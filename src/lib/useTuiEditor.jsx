//THIS IS NO LONGER USED BECAUSE OF REINITIALIZATION ERR OF THE TUI EDITOR
import Editor from "@toast-ui/editor";
import ReactDOM from "react-dom";
import Switch from "@mui/material/Switch";
import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";

function createButton(dom) {
  const el = document.createElement("div");
  ReactDOM.render(dom, el);
  return el;
}

function useTuiEditor(file, editDoc, editContent) {
  const [showFrontmatter, setShowFrontmatter] = useState(false);
  const [editor, setEditor] = useState(null);

  console.log("use tui editor", {
    file,
    editor,
    md: editor?.getMarkdown(),
  });

  if (
    editor !== null &&
    editor.showFrontmatter &&
    file.content !== editor.getMarkdown()
  ) {
    console.log({ md: editor.getMarkdown(), doc: file.doc });
  }
  if (
    editor !== null &&
    !editor.showFrontmatter &&
    file.doc !== editor?.getMarkdown()
  ) {
    console.log({ md: editor.getMarkdown(), doc: file.doc }); //caused
  }

  useEffect(() => {
    if (!file.isRead) return;
    console.warn("HY");
    //editor?.destoroy();
    const e = new Editor({
      el: document.getElementById("editor-tab"),
      initialValue: showFrontmatter ? file.content : file.doc,
      frontMatter: true,
      height: "100%",
      previewStyle: "vertical",
      events: {
        change: () => {
          if (showFrontmatter) {
            editContent(e);
          } else {
            editDoc(e);
          }
        },
      },
    });

    e.showFrontmatter = showFrontmatter;
    setEditor(e);
  }, [file.isRead, showFrontmatter]);

  return editor;
}

export default useTuiEditor;
