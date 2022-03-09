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
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { configContext } from "../context/ConfigContext";
import { findSiteConfigBySiteKey } from "../lib/config";
import useCodeMirror from "../lib/useCodeMirror";

//filePath is optional
function Editor(props) {
  const { filePath } = props;
  const initialFileName = props.fileName;
  const navigate = useNavigate();
  const { config } = useContext(configContext);
  const siteKey = Number(useParams().siteKey);
  const siteConfig = findSiteConfigBySiteKey(config, siteKey);
  const [doc, setDoc] = useState(""); //doc is readonly and setSoc doest not update refContainer, use editorView.dispatch to update text
  const [fileName, setFileName] = useState(initialFileName);
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
      alert(res.err.message);
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
    .use(remarkFrontmatter, ["yaml", "toml"])
    .use(remarkRehype)
    .use(rehypeReact, { createElement, Fragment })
    .processSync(doc).result;

  if (!filePath) {
    return (
      <Fragment>
        <h1>Editor</h1>
        <Button onClick={readFile} variant="contained">
          Open
        </Button>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h1>Editor</h1>
      <input value={fileName} onChange={(e) => setFileName(e.target.value)} />
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
