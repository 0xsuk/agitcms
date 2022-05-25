import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import ReactDOM from "react-dom";
import {
  Button,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useEffect, useRef, useState } from "react";
import useFileBuffer from "../lib/useFileBuffer";
import useSiteConfig from "../lib/useSiteConfig";
import { Editor as Tui } from "@toast-ui/react-editor";
//filePath is a only dependency
function Editor({ filePath }) {
  const [
    file,
    { editName, editFrontmatter, editDoc, editContent, readFile, saveFile },
  ] = useFileBuffer(filePath);
  const siteConfig = useSiteConfig();
  console.log("EDITOR", {
    filePath,
    file,
    siteConfig,
  });

  const switchTab = (tab) => {
    const frontmatterEl = document.getElementById("frontmatter-tab");
    const editorEl = document.getElementById("editor-tab");
    const frontmatterTabEl = document.querySelectorAll("#editor .tab")[0];
    const editorTabEl = document.querySelectorAll("#editor .tab")[1];
    const isFrontmatterVisible = frontmatterEl.style.display !== "none";

    const frontmatterOn = () => {
      editorEl.style.display = "none";
      editorTabEl.style.backgroundColor = "#fff";
      frontmatterEl.style.display = "block";
      frontmatterTabEl.style.backgroundColor = "#89b8e640";
    };

    const editorOn = () => {
      editorEl.style.display = "block";
      editorTabEl.style.backgroundColor = "#89b8e640";
      frontmatterEl.style.display = "none";
      frontmatterTabEl.style.backgroundColor = "#fff";
    };

    switch (tab) {
      case undefined:
        if (isFrontmatterVisible) {
          editorOn();
        } else {
          frontmatterOn();
        }
        break;
      case "editor":
        editorOn();
        break;
      case "frontmatter":
        frontmatterOn();
        break;
    }
  };

  useEffect(() => {
    readFile().then((isFrontmatterEmpty) => {
      if (isFrontmatterEmpty) {
        switchTab("editor");
      }
    });
  }, []); //eslint-disable-line
  if (file.isRead) {
    saveFile();
  } else {
    return <></>;
  }

  return (
    <div id="editor">
      {/* Tab switcher */}
      <div className="flex">
        <p className="tab" onClick={() => switchTab("frontmatter")}>
          Frontmatter
        </p>
        <p className="tab" onClick={() => switchTab("editor")}>
          Editor
        </p>
      </div>
      <div id="frontmatter-tab">
        <FrontmatterEditor
          file={file}
          editFrontmatter={editFrontmatter}
          siteConfig={siteConfig}
        />
      </div>
      <div id="editor-tab">
        <MarkdownEditor file={file} editDoc={editDoc} />
      </div>
    </div>
  );
}

function FrontmatterEditor({ file, editFrontmatter, siteConfig }) {
  const getFrontmatterType = (key) => {
    let type = undefined;
    siteConfig.frontmatter.every((singlematter) => {
      if (singlematter.key === key) {
        type = singlematter.type;
        return false;
      }
      return true;
    });

    return type;
  };

  const frontmatterEditor = (matterKey, matterValue, matterType) => {
    const stringEditor = (
      <TextField
        placeholder="String"
        value={matterValue}
        variant="standard"
        onChange={(e) => editFrontmatter(matterKey, e.target.value)}
        fullWidth
      />
    );
    //have to be function
    const ArrayOfStringEditor = () => (
      <>
        <TextField
          variant="standard"
          id={"agit-" + matterKey + "-input"}
          placeholder="String"
          InputProps={{
            endAdornment: (
              <Button
                onClick={() => {
                  let ref = document.getElementById(
                    "agit-" + matterKey + "-input"
                  );
                  if (!matterValue) {
                    matterValue = [];
                  }
                  matterValue.push(ref.value);
                  console.log("newMatter", matterValue);
                  editFrontmatter(matterKey, matterValue);
                  ref.value = "";
                  // ref.focus();
                }}
              >
                ADD
              </Button>
            ),
          }}
        />
        {/* matterValue can be null, if user set it to null */}
        {matterValue?.map((v, i) => (
          <p
            onClick={() => {
              matterValue.splice(i, 1);
              editFrontmatter(matterKey, matterValue);
            }}
          >
            {v} x
          </p>
        ))}
      </>
    );

    const dateEditor = (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <MobileDateTimePicker
          label="Date"
          value={matterValue}
          renderInput={(props) => <TextField {...props} />}
          onChange={(newValue) => editFrontmatter(matterKey, newValue)}
          ampm={false}
          showTodayButton={true}
          todayText="Now"
        />
      </LocalizationProvider>
    );

    const boolEditor = (
      <Switch
        aria-label="bool"
        size="small"
        checked={matterValue}
        onChange={() => editFrontmatter(matterKey, !matterValue)}
      />
    );

    if (matterType === undefined) {
      switch (typeof matterValue) {
        case "string":
          return stringEditor;
        case "number":
          return stringEditor;
        case "boolean":
          return boolEditor;
        default:
          return stringEditor;
      }
    }

    if (matterType.split(".")[0] === "Array") {
      if (matterValue !== null && !Array.isArray(matterValue)) {
        console.warn(matterKey + " is not type of Array");
        return stringEditor;
      }
      switch (matterType.split(".")[1]) {
        case "String":
          return ArrayOfStringEditor();
        default:
          return ArrayOfStringEditor();
      }
    }

    switch (matterType) {
      case "String":
        return stringEditor;

      case "Date":
        return dateEditor;

      case "Bool":
        return boolEditor;

      default:
        return stringEditor;
    }
  };
  return (
    <Stack spacing={1}>
      {Object.keys(file.frontmatter).length !== 0 &&
        Object.keys(file.frontmatter).map((matterKey) => (
          <Grid container spacing={0} alignItems="center">
            <Grid item xs={2}>
              <Typography>{matterKey}</Typography>
            </Grid>
            <Grid item xs={9}>
              {frontmatterEditor(
                matterKey,
                file.frontmatter[matterKey],
                getFrontmatterType(matterKey)
              )}
            </Grid>
          </Grid>
        ))}
    </Stack>
  );
}

function MarkdownEditor({ file, editDoc }) {
  const tuiRef = useRef(null);
  return (
    <>
      <Tui
        ref={tuiRef}
        initialValue={file.doc}
        previewStyle="vertical"
        height="100%"
        //frontMatter={true}
        onChange={() => {
          console.log("doc");
          editDoc(tuiRef.current.getInstance());
        }}
        toolbarItems={[
          ["heading", "bold", "italic", "strike"],
          ["hr", "quote"],
          ["ul", "ol", "task", "indent", "outdent"],
          ["table", "image", "link"],
          ["code", "codeblock"],
        ]}
      />
    </>
  );
}

//function createButton(dom) {
//  const el = document.createElement("div");
//  ReactDOM.render(dom, el);
//  return el;
//}

export default Editor;
