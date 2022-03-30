import {
  Button,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import DateAdapter from "@mui/lab/AdapterDateFns";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as TuiEditor } from "@toast-ui/react-editor";
import { Fragment, useEffect, useRef } from "react";
import useFileBuffer from "../lib/useFileBuffer";
import useSiteConfig from "../lib/useSiteConfig";
import { LocalizationProvider } from "@mui/lab";
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
    const stringOfArrayEditor = () => (
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
        {matterValue?.map((v) => (
          <p>{v} x</p>
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
        defaultChecked={matterValue}
        onChange={() => editFrontmatter(matterKey, !matterValue)}
      />
    );

    if (matterType.split(".")[0] === "Array") {
      switch (matterType.split(".")[1]) {
        case "String":
          return stringOfArrayEditor();
        default:
          return stringOfArrayEditor();
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

  useEffect(() => {
    readFile(editorRef.current);
  }, [filePath]); //eslint-disable-line

  return (
    <Fragment>
      <div>
        <Button onClick={() => saveFile(editorRef.current)} variant="contained">
          Save
        </Button>
      </div>
      <TextField
        label="File name"
        value={file.name}
        variant="standard"
        onChange={(e) => editName(e.target.value)}
        fullWidth
      />

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
      <TuiEditor previewStyle="vertical" ref={editorRef} height="100vh" />
    </Fragment>
  );
}

export default Editor;
