import { Button } from "@mui/material";
import {
  createElement,
  Fragment,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { configContext } from "../context/ConfigContext";
import { findSiteConfigBySiteKey } from "../lib/config";
import useCodeMirror from "../lib/useCodeMirror";

function Editor(props) {
  const filePath = props.filePath; //unchanged
  const initialFileName = props.fileName; //could be changed
  const [fileName, setFileName] = useState(initialFileName);
  const navigate = useNavigate();
  const { config } = useContext(configContext);
  const siteKey = Number(useParams().siteKey);
  const siteConfig = findSiteConfigBySiteKey(config, siteKey);
  const [doc, setDoc] = useState(""); //doc is readonly and setSoc doest not update refContainer, use editorView.dispatch to update text
  const [frontmatter, setFrontMatter] = useState({});
  const [refContainer, editorView] = useCodeMirror({
    initialDoc: doc,
    onChange: setDoc,
  });

  const renameFileAndNavigate = async () => {
    const { newFilePath, err } = await window.electronAPI.renameFile(
      filePath,
      fileName
    );
    if (err) {
      alert(err.message);
      return;
    }
    const to = "/edit/" + siteKey + newFilePath.replace(siteConfig.path, "");
    console.log("to", to);
    navigate(to);
  };

  const saveFile = async () => {
    console.log("saving", filePath, doc);
    const { err } = await window.electronAPI.saveFile(doc, filePath);
    if (err) {
      alert(err.message);
      return;
    }
    alert("Saved!");
    fileName !== initialFileName && renameFileAndNavigate();
  };

  const readFile = async () => {
    const res = await window.electronAPI.readFile(filePath);
    if (res.err) {
      console.log(res.err);
      return;
    }
    //editorView.dispatch triggers update, thus setDoc
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: res.content,
      },
    });

    setFrontMatter(res.frontmatter);
    console.log("frontmatter:", res.frontmatter);
  };

  useEffect(() => {
    console.warn("Editor Effect");
    if (editorView === undefined) {
      return;
    }
    if (!filePath) {
      console.log("no filePath");
      return;
    }
    readFile();
  }, [editorView]); //eslint-disable-line
  //triggered when editorView === undefined (first time) and editorView is set (after refContainer is set)
  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeReact, { createElement, Fragment })
    .processSync(doc).result;

  return (
    <Fragment>
      <p>{filePath}</p>
      <h1>Editor</h1>
      <input value={fileName} onChange={(e) => setFileName(e.target.value)} />
      <Button onClick={saveFile} variant="contained">
        Save
      </Button>
      {Object.keys(frontmatter).length !== 0 &&
        Object.keys(frontmatter).map((key) => (
          <div className="flex">
            <p>{key}:</p>
            <input
              value={frontmatter[key]}
              onChange={(e) => {
                const newFrontmatter = Object.assign({}, frontmatter);
                newFrontmatter[key] = e.target.value;
                setFrontMatter(newFrontmatter);
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
