import {
  createElement,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "@mui/material";
import useCodeMirror from "../lib/useCodeMirror";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeReact from "rehype-react";

function Editor({ filePath }) {
  //doc is readonly and setSoc doest not update refContainer, use editorView.dispatch to update text
  const [doc, setDoc] = useState("");
  const currentFilePath = filePath === undefined ? "" : filePath;
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

  useEffect(() => {
    (async () => {
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
    })();
  }, [editorView, filePath]); //only triggered when editorView is ready

  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeReact, { createElement, Fragment })
    .processSync(doc).result;
  console.log(md);

  return (
    <Fragment>
      <h1>Editor</h1>
      {/* <Button onClick={readFile} variant="contained">
          Open
        </Button> */}
      <Button onClick={saveFile} variant="contained">
        Save
      </Button>
      <div className="flex">
        <div id="editor" ref={refContainer}></div>
        {/* TODO: previewer */}
        <div id="previewer">{md}</div>
      </div>
    </Fragment>
  );
}

export default Editor;
