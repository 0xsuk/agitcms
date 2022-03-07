import { createElement, Fragment, useRef, useEffect, useState } from "react";
import { Button } from "@mui/material";
import useCodeMirror from "../lib/useCodeMirror";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeReact from "rehype-react";
import remarkFrontmatter from "remark-frontmatter";

//filePath is optional
function Editor({ filePath }) {
  //doc is readonly and setSoc doest not update refContainer, use editorView.dispatch to update text
  const [doc, setDoc] = useState("");
  const [refContainer, editorView] = useCodeMirror({
    initialDoc: doc,
    onChange: setDoc,
  });

  const saveFile = async () => {
    console.log("saving", filePath, doc);
    const { err, canceled } = await window.electronAPI.saveFile(doc, filePath);
    if (err) {
      alert(err.message);
      return;
    }
    if (!canceled) {
      alert("Saved!");
    }
  };

  const readFile = async () => {
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
  };

  useEffect(() => {
    console.warn("Editor Effect");
    if (editorView === undefined) {
      return;
    }
    if (!filePath) {
      return;
    }
    readFile();
  }, [editorView]); //triggered when editorView === undefined (first time) and editorView is set (after refContainer is set)

  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter)
    //.use(remarkRehype, ["yaml", "toml"])
    //    .use(() => (tree) => console.dir(tree))
    .use(rehypeReact, { createElement, Fragment })
    .processSync(doc).result;
  //console.log(md);

  return (
    <Fragment>
      <h1>Editor</h1>
      {!filePath && (
        <Button onClick={readFile} variant="contained">
          Open
        </Button>
      )}
      <Button onClick={saveFile} variant="contained">
        Save
      </Button>
      <div className="flex">
        <div id="editor" ref={refContainer}></div>
        <div id="previewer">{md}</div>
      </div>
    </Fragment>
  );
}

export default Editor;
