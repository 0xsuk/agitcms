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
  Chip,
} from "@mui/material";

function FrontmatterEditor({ fileManager, siteConfig }) {
  if (fileManager.file.isFrontmatterEmpty) {
    return (
      <>
        <Typography>Frontmatter is empty</Typography>
      </>
    );
  }

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
    const textEditor = (
      <TextField
        placeholder="Text"
        value={matterValue}
        variant="standard"
        onChange={(e) => fileManager.editFrontmatter(matterKey, e.target.value)}
        fullWidth
      />
    );
    //have to be function
    const arrayOfTextEditor = () => (
      <>
        <TextField
          variant="standard"
          id={"agit-" + matterKey + "-input"}
          placeholder="Text"
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
                  fileManager.editFrontmatter(matterKey, matterValue);
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
          <Chip
            label={v}
            onDelete={() => {
              matterValue.splice(i, 1);
              fileManager.editFrontmatter(matterKey, matterValue);
            }}
          ></Chip>
        ))}
      </>
    );

    const multilineTextEditor = (
      <TextField
        placeholder="Multiline Text"
        value={matterValue}
        variant="outlined"
        onChange={(e) => fileManager.editFrontmatter(matterKey, e.target.value)}
        fullWidth
        multiline
      />
    );

    const dateEditor = (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <MobileDateTimePicker
          label="Date"
          value={matterValue}
          renderInput={(props) => <TextField {...props} />}
          onChange={(newValue) =>
            fileManager.editFrontmatter(matterKey, newValue)
          }
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
        onChange={() => fileManager.editFrontmatter(matterKey, !matterValue)}
      />
    );

    if (matterType === undefined) {
      if (Array.isArray(matterValue)) {
        return arrayOfTextEditor();
      }

      if (Object.prototype.toString.call(matterValue) === "[object Date]") {
        return dateEditor;
      }

      if (typeof matterValue === "string") {
        if (matterValue.includes("\n")) {
          return multilineTextEditor;
        }
        return textEditor;
      }

      if (typeof matterValue === "boolean") return boolEditor;

      return textEditor;
    }

    if (matterType.split(".")[0] === "Array") {
      if (matterValue !== null && !Array.isArray(matterValue)) {
        alert(matterKey + " is not type of Array");
        return textEditor;
      }
      switch (matterType.split(".")[1]) {
        case "Text":
          return arrayOfTextEditor();
        default:
          return arrayOfTextEditor();
      }
    }

    switch (matterType) {
      case "Text":
        return textEditor;

      case "Multiline-Text":
        return multilineTextEditor;

      case "Date":
        return dateEditor;

      case "Bool":
        return boolEditor;

      default:
        return textEditor;
    }
  };
  return (
    <>
      <Stack spacing={2}>
        {Object.keys(fileManager.file.frontmatter).length !== 0 &&
          Object.keys(fileManager.file.frontmatter).map((matterKey) => (
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={3}>
                <Typography>{matterKey}</Typography>
              </Grid>
              <Grid item xs={9}>
                {frontmatterEditor(
                  matterKey,
                  fileManager.file.frontmatter[matterKey],
                  getFrontmatterType(matterKey)
                )}
              </Grid>
            </Grid>
          ))}
      </Stack>
    </>
  );
}

export default FrontmatterEditor;
