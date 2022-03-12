import { Button } from "@mui/material";
import { createElement, Fragment, useEffect } from "react";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import useCodeMirror from "../lib/useCodeMirror";
import useFileBuffer from "../lib/useFileBuffer";

//filePath is a only dependency
function Editor({ filePath }) {
  const { file, editDoc, editFileName, editFrontmatter, readFile, saveFile } =
    useFileBuffer(filePath);
  const [refContainer, editorView] = useCodeMirror({
    initialDoc: file.doc,
    onChange: editDoc,
  });

  useEffect(() => {
    console.warn("Editor Effect");
    if (editorView === undefined) {
      return;
    }
    if (!filePath) {
      console.log("no filePath");
      return;
    }
    readFile(editorView);
  }, [editorView]); //eslint-disable-line
  //triggered when editorView === undefined (first time) and editorView is set (after refContainer is set)
  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeReact, { createElement, Fragment })
    .processSync(file.doc).result;

  return (
    <Fragment>
      <h1>Editor</h1>
      <input value={file.name} onChange={(e) => editFileName(e.target.value)} />
      <Button onClick={saveFile} variant="contained">
        Save
      </Button>
      {Object.keys(file.frontmatter).length !== 0 &&
        Object.keys(file.frontmatter).map((key) => (
          <div className="flex">
            <p>{key}:</p>
            <input
              value={file.frontmatter[key]}
              onChange={(e) => {
                editFrontmatter(key, e.target.value);
              }}
            />
          </div>
        ))}

      <div className="flex">
        <div id="editor" ref={refContainer}></div>
        <div id="previewer">{md}</div>
      </div>
    </Fragment>
  );
}

export default Editor;
