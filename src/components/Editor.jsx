import { Button, Grid, Stack, Switch, TextField } from "@mui/material";
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
        label="String"
        value={matterValue}
        variant="standard"
        onChange={(e) => editFrontmatter(matterKey, e.target.value)}
        fullWidth
      />
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

    switch (matterType) {
      case "String":
        return stringEditor;

      case "Date":
        console.log("matterValue:", matterValue);
        return dateEditor;

      case "Bool":
        return boolEditor;

      default:
        return stringEditor;
    }
  };

  useEffect(() => {
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

      <Stack spacing={1}>
        {/* TODO: frontmatter editor */}
        {Object.keys(file.frontmatter).length !== 0 &&
          Object.keys(file.frontmatter).map((matterKey) => (
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={2}>
                <p>{matterKey}</p>
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
      <Fragment>
        <TuiEditor previewStyle="vertical" ref={editorRef} height="100vh" />
      </Fragment>
    </Fragment>
  );
}

export default Editor;
