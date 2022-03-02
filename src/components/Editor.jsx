import { Fragment, useCallback, useState } from "react";
import { Button } from "@mui/material";
import useCodeMirror from "../lib/useCodeMirror"

function Editor() {
  //setDoc doest not update refContainer, use editorView.dispatch to update text
  const [doc, setDoc] = useState("");
  const [currentFilePath, setCurrentFilePath] = useState("");
  console.log("currentFilePath is", currentFilePath);
  const handleChange = useCallback((state) => {
    setDoc(state.doc.toString());
  }, []);
  const [refContainer, editorView] = useCodeMirror({
    initialDoc: doc,
    onChange: handleChange,
  });

  const saveFile = async () => {
    console.log("saving", currentFilePath);
    const { err, canceled } = await window.electronAPI.saveFile(
      doc,
      currentFilePath
    );
    if (err) {
      alert(err.message);
    }
    if (!err & !canceled) {
      alert("Saved!");
    }
  };

  const openFile = async () => {
    const { content, filePath, err, canceled } =
      await window.electronAPI.openFile();
    if (!err && !canceled) {
      editorView.dispatch({
        changes: { from: 0, to: editorView.state.doc.length, insert: content },
      });
      setCurrentFilePath(filePath);
    }
  };

  return (
    <Fragment>
      <div id="editor">
        <h1>Editor</h1>
        <Button onClick={openFile} variant="contained">
          Open
        </Button>
        <Button onClick={saveFile} variant="contained">
          Save
        </Button>
        <div ref={refContainer}></div>
      </div>
    </Fragment>
  );
}

export default Editor;
