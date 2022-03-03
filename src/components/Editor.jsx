import { Fragment, useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";
import useCodeMirror from "../lib/useCodeMirror";

function Editor({ filePath }) {
  //doc is readonly and setSoc doest not update refContainer, use editorView.dispatch to update text
  const [doc, setDoc] = useState("");
  const [currentFilePath, setCurrentFilePath] = useState(
    filePath == undefined ? "" : filePath
  );
  console.log("currentFilePath is", currentFilePath);
  const handleChange = useCallback((state) => {
    setDoc(state.doc.toString());
  }, []);
  const [refContainer, editorView] = useCodeMirror({
    initialDoc: doc,
    onChange: handleChange,
  });

  const saveFile = async () => {
    console.log("saving", currentFilePath, doc);
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

  // const readFile = async () => {
  //   const { content, filePath, err, canceled } =
  //     await window.electronAPI.readFile();
  //   if (!err && !canceled) {
  //     editorView.dispatch({
  //       changes: { from: 0, to: editorView.state.doc.length, insert: content },
  //     });
  //     setCurrentFilePath(filePath);
  //   }
  // };

  useEffect(async () => {
    if (filePath) {
      const { content, err, canceled } = await window.electronAPI.readFile(
        filePath
      );
      if (err) {
        alert(err.message);
        return;
      }
      if (!canceled) {
        //editorView.dispatch triggers update, thus setDoc
        editorView.dispatch({
          changes: {
            from: 0,
            to: editorView.state.doc.length,
            insert: content,
          },
        });
      }
    }
  });

  return (
    <Fragment>
      <div id="editor">
        <h1>Editor</h1>
        {/* <Button onClick={readFile} variant="contained">
          Open
        </Button> */}
        <Button onClick={saveFile} variant="contained">
          Save
        </Button>
        <div ref={refContainer}></div>
      </div>
    </Fragment>
  );
}

export default Editor;
