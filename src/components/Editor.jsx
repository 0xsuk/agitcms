import { Box, Button, Grid } from "@mui/material";
import { createElement, Fragment, useEffect } from "react";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import useCodeMirror from "../lib/useCodeMirror";
import useFileBuffer from "../lib/useFileBuffer";
import useSiteConfig from "../lib/useSiteConfig";
//filePath is a only dependency
function Editor({ filePath }) {
  const [file, { editDoc, editName, editFrontmatter, readFile, saveFile }] =
    useFileBuffer(filePath);
  const [refContainer, editorView] = useCodeMirror(file.doc, editDoc);
  const { siteConfig } = useSiteConfig();

  const getFrontmatterType = (key) => {
    let type = undefined;
    siteConfig.frontmatter.every((singlematter, i) => {
      if (singlematter.key === key) {
        type = singlematter.type;
        return false;
      }
      return true;
    });

    return type;
  };

  useEffect(() => {
    console.warn("Editor Effect");
    if (editorView === undefined) {
      console.log("setting editorView");
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
      <input value={file.name} onChange={(e) => editName(e.target.value)} />
      <Button onClick={saveFile} variant="contained">
        Save
      </Button>
      <Fragment>
        {Object.keys(file.frontmatter).length !== 0 &&
          Object.keys(file.frontmatter).map((matterKey) => (
            <div className="flex">
              <p>
                {matterKey}:({getFrontmatterType(matterKey)})
              </p>
              <input
                value={file.frontmatter[matterKey]}
                onChange={(e) => editFrontmatter(matterKey, e.target.value)}
              />
            </div>
          ))}
      </Fragment>

      <Box>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <div id="editor" ref={refContainer}></div>
          </Grid>
          <Grid item xs={6}>
            <div id="previewer">{md}</div>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}

export default Editor;
