import { Button } from "@mui/material";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as Tuieditor } from "@toast-ui/react-editor";
import { Fragment, useEffect, useRef } from "react";
import useFileBuffer from "../lib/useFileBuffer";
import useSiteConfig from "../lib/useSiteConfig";
//filePath is a only dependency

function Editor({ filePath }) {
  const [file, { editName, editFrontmatter, readFile, saveFile }] =
    useFileBuffer(filePath);
  const editorRef = useRef();
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
    console.log(editorRef.current);
    readFile(editorRef.current);
  }, []);

  return (
    <Fragment>
      <div>
        <Button onClick={() => saveFile(editorRef.current)} variant="contained">
          Save
        </Button>
      </div>
      <input value={file.name} onChange={(e) => editName(e.target.value)} />
      <Fragment>
        {/* TODO: frontmatter editor */}
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
      <Fragment>
        <Tuieditor previewStyle="vertical" ref={editorRef} />
      </Fragment>
    </Fragment>
  );
}

export default Editor;
