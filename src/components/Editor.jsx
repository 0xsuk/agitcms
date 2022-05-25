import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import {
  Button,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useEffect, useState } from "react";
import useFileBuffer from "../lib/useFileBuffer";
import useSiteConfig from "../lib/useSiteConfig";
import useTuiEditor from "../lib/useTuiEditor";
//filePath is a only dependency
function Editor({ filePath }) {
  const [
    file,
    { editName, editFrontmatter, editDoc, editContent, readFile, saveFile },
  ] = useFileBuffer(filePath);
  const siteConfig = useSiteConfig();
  const [editor, setEditor] = useState(null);
  const [showFrontmatter, setShowFrontmatter] = useState(false);
  console.log("EDITOR", {
    filePath,
    file,
    siteConfig,
    editor,
    showFrontmatter,
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

  if (file.isRead) {
    saveFile();

    //when frontmatter editor has change (meaning file.content has updated), editor content should change
    if (showFrontmatter && file.content !== editor.getMarkdown()) {
      editor.setMarkdown(file.content);
    }
  }

  useEffect(() => {
    readFile(editor).then((isFrontmatterEmpty) => {
      if (isFrontmatterEmpty) {
        switchTab("editor");
      }
    });
  }, []); //eslint-disable-line

  useEffect(() => {
    if (!file.isRead) return;
    console.log("setEditor", file);
    if (showFrontmatter) {
      setEditor(
        useTuiEditor(
          file.content,
          editContent,
          showFrontmatter,
          setShowFrontmatter
        )
      );
    } else {
      setEditor(
        useTuiEditor(file.doc, editDoc, showFrontmatter, setShowFrontmatter)
      );
    }
  }, [file.isRead, showFrontmatter]);

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
      <div id="editor-tab"></div>
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

export default Editor;
