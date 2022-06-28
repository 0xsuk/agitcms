import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import {
  Button,
  Chip,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  FrontmatterTypes,
  generateFrontmatterTree,
} from "../lib/frontmatterInterface";

function FrontmatterEditor({
  fileManager: { file, updateFrontmatter },
  siteConfig,
}) {
  if (!file.isRead || file.isFrontmatterEmpty) {
    return (
      <>
        <Typography>Frontmatter is empty</Typography>
      </>
    );
  }

  const frontmatterTree = generateFrontmatterTree(siteConfig, file.frontmatter);
  const textEditor = (node, parentNames) => (
    <TextField
      placeholder={FrontmatterTypes.Text}
      value={node.value}
      variant="standard"
      onChange={(e) =>
        updateFrontmatter(node.name, e.target.value, parentNames)
      }
      fullWidth
    />
  );
  //have to be function
  const arrayOfTextEditor = (node, parentNames) => (
    <>
      <TextField
        placeholder={FrontmatterTypes.Text}
        variant="standard"
        id={"agit-" + node.name + "-input"}
        InputProps={{
          endAdornment: (
            <Button
              onClick={() => {
                let ref = document.getElementById(
                  "agit-" + node.name + "-input"
                );
                if (!node.value) {
                  node.value = [];
                }
                node.value.push(ref.value);
                updateFrontmatter(node.name, node.value, parentNames);
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
      {node.value?.map((v, i) => (
        <Chip
          label={v}
          onDelete={() => {
            node.value.splice(i, 1);
            updateFrontmatter(node.name, node.value, parentNames);
          }}
        ></Chip>
      ))}
    </>
  );

  const multilineTextEditor = (node, parentNames) => (
    <TextField
      placeholder={FrontmatterTypes.MultilineText}
      value={node.value}
      variant="outlined"
      onChange={(e) =>
        updateFrontmatter(node.name, e.target.value, parentNames)
      }
      fullWidth
      multiline
    />
  );

  const dateEditor = (node, parentNames) => (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <MobileDateTimePicker
        label={FrontmatterTypes.Date}
        value={node.value}
        renderInput={(props) => <TextField {...props} />}
        onChange={(newValue) =>
          updateFrontmatter(node.name, newValue, parentNames)
        }
        ampm={false}
        showTodayButton={true}
        todayText="Now"
      />
    </LocalizationProvider>
  );

  const boolEditor = (node, parentNames) => (
    <Switch
      aria-label="bool"
      size="small"
      checked={node.value}
      onChange={() => updateFrontmatter(node.name, !node.value, parentNames)}
    />
  );
  const nestEditor = (node, parentNames) => {
    if (parentNames === undefined) parentNames = [];
    return (
      <>
        <Stack spacing={1}>
          <Typography>{node.name}</Typography>
          {node.children?.map((childNode) => (
            <div style={{ marginLeft: "10px" }}>
              {frontmatterEditor(childNode, [...parentNames, node.name])}
            </div>
          ))}
        </Stack>
      </>
    );
  };

  const wrap = (node, elem) => {
    return (
      <Grid container spacing={0} alignItems="center">
        <Grid item xs={3}>
          <Typography>{node.name}</Typography>
        </Grid>
        <Grid item xs={9}>
          {elem}
        </Grid>
      </Grid>
    );
  };

  const frontmatterEditor = (node, parentNames) => {
    switch (node.type) {
      case FrontmatterTypes.Text:
        return wrap(node, textEditor(node, parentNames));

      case FrontmatterTypes.ListOfText:
        return wrap(node, arrayOfTextEditor(node, parentNames));

      case FrontmatterTypes.MultilineText:
        return wrap(node, multilineTextEditor(node, parentNames));

      case FrontmatterTypes.Date:
        return wrap(node, dateEditor(node, parentNames));

      case FrontmatterTypes.Bool:
        return wrap(node, boolEditor(node, parentNames));

      case FrontmatterTypes.Nest:
        return nestEditor(node, parentNames);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        {frontmatterTree.children.map((node) => (
          <> {frontmatterEditor(node)}</>
        ))}
      </Stack>
    </>
  );
}

export default FrontmatterEditor;
