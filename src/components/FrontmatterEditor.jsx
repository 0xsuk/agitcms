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
    const stringEditor = (
      <TextField
        placeholder="String"
        value={matterValue}
        variant="standard"
        onChange={(e) => fileManager.editFrontmatter(matterKey, e.target.value)}
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
    <>
      <Stack spacing={1}>
        {Object.keys(fileManager.file.frontmatter).length !== 0 &&
          Object.keys(fileManager.file.frontmatter).map((matterKey) => (
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={2}>
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
