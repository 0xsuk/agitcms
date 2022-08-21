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

const textEditor = ({ node, parentNames, updateFrontmatter }) => (
  <TextField
    placeholder={FrontmatterTypes.Text}
    value={node.value}
    variant="standard"
    onChange={(e) => updateFrontmatter(node.name, e.target.value, parentNames)}
    fullWidth
  />
);
const arrayOfTextEditor = ({ node, parentNames, updateFrontmatter }) => (
  <>
    <TextField
      placeholder={FrontmatterTypes.Text}
      variant="standard"
      id={"agit-" + node.name + "-input"}
      InputProps={{
        endAdornment: (
          <Button
            onClick={() => {
              let ref = document.getElementById("agit-" + node.name + "-input");
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
const multilineTextEditor = ({ node, parentNames, updateFrontmatter }) => (
  <TextField
    placeholder={FrontmatterTypes.MultilineText}
    value={node.value}
    variant="outlined"
    onChange={(e) => updateFrontmatter(node.name, e.target.value, parentNames)}
    fullWidth
    multiline
  />
);

const dateEditor = ({ node, parentNames, updateFrontmatter }) => (
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

const boolEditor = ({ node, parentNames, updateFrontmatter }) => (
  <Switch
    aria-label="bool"
    size="small"
    checked={node.value}
    onChange={() => updateFrontmatter(node.name, !node.value, parentNames)}
  />
);
const nestEditor = (props) => {
  const { node, updateFrontmatter } = props;
  let { parentNames } = props;
  if (parentNames === undefined) parentNames = [];
  parentNames.push(node.name);
  return (
    <>
      <Stack spacing={1}>
        <Typography>{node.name}</Typography>
        {node.children?.map((childNode) => (
          <div style={{ marginLeft: "10px" }}>
            {pickEditor({
              node: childNode,
              parentNames,
              updateFrontmatter,
            })}
          </div>
        ))}
      </Stack>
    </>
  );
};
const pickEditor = (props) => {
  const { node } = props;
  switch (node.type) {
    case FrontmatterTypes.Text:
      return wrap(node, textEditor(props));

    case FrontmatterTypes.ListOfText:
      return wrap(node, arrayOfTextEditor(props));

    case FrontmatterTypes.MultilineText:
      return wrap(node, multilineTextEditor(props));

    case FrontmatterTypes.Date:
      return wrap(node, dateEditor(props));

    case FrontmatterTypes.Bool:
      return wrap(node, boolEditor(props));

    case FrontmatterTypes.Nest:
      return nestEditor(props);
  }
};

function FrontmatterEditor({
  fileManager: { file, updateFrontmatter },
  siteConfig,
}) {
  if (file.isFrontmatterEmpty) {
    return (
      <>
        <Typography>Frontmatter is empty</Typography>
      </>
    );
  }

  const frontmatterTree = generateFrontmatterTree(siteConfig, file.frontmatter);
  //have to be function

  return (
    <>
      <Stack spacing={2}>
        {frontmatterTree.children.map((node) => (
          <>{pickEditor({ node, parentNames: undefined, updateFrontmatter })}</>
        ))}
      </Stack>
    </>
  );
}

export default FrontmatterEditor;
