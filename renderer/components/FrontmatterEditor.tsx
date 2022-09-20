import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
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
  IFrontmatterNode,
} from "@/utils/frontmatterInterface";
import { IFileManager } from "@/utils/useFileManager";
import { ISiteConfig } from "@shared/types/config";

const wrap = (node: IFrontmatterNode, elem: JSX.Element) => {
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

interface EditorProps {
  node: IFrontmatterNode;
  parentNames: string[] | undefined;
  updateFrontmatter: IFileManager["updateFrontmatter"];
}

const textEditor = ({ node, parentNames, updateFrontmatter }: EditorProps) => (
  <TextField
    placeholder={FrontmatterTypes.Text}
    value={node.value}
    variant="standard"
    onChange={(e) => updateFrontmatter(node.name, e.target.value, parentNames)}
    fullWidth
  />
);
const arrayOfTextEditor = ({
  node,
  parentNames,
  updateFrontmatter,
}: EditorProps) => {
  let value = node.value as string[] | undefined;
  return (
    <>
      <TextField
        placeholder={FrontmatterTypes.Text}
        variant="standard"
        id={"agit-" + node.name + "-input"}
        InputProps={{
          endAdornment: (
            <Button
              onClick={() => {
                const ref = document.getElementById(
                  "agit-" + node.name + "-input"
                ) as HTMLInputElement;
                if (!value) {
                  value = [];
                }
                value.push(ref.value);
                updateFrontmatter(node.name, value, parentNames);
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
      {value?.map((v, i) => (
        <Chip
          label={v}
          onDelete={() => {
            value?.splice(i, 1);
            updateFrontmatter(node.name, value, parentNames);
          }}
        ></Chip>
      ))}
    </>
  );
};
const multilineTextEditor = ({
  node,
  parentNames,
  updateFrontmatter,
}: EditorProps) => (
  <TextField
    placeholder={FrontmatterTypes.MultilineText}
    value={node.value}
    variant="outlined"
    onChange={(e) => updateFrontmatter(node.name, e.target.value, parentNames)}
    fullWidth
    multiline
  />
);

const dateEditor = ({ node, parentNames, updateFrontmatter }: EditorProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <MobileDateTimePicker
      label={FrontmatterTypes.Date}
      value={node.value}
      renderInput={(props: any) => <TextField {...props} />}
      onChange={(newValue: any) =>
        updateFrontmatter(node.name, newValue, parentNames)
      }
      ampm={false}
      //https://mui.com/x/react-date-pickers/custom-components/#action-bar
      componentsProps={{
        actionBar: {
          actions: ["cancel", "today", "accept"],
        },
      }}
    />
  </LocalizationProvider>
);

const boolEditor = ({ node, parentNames, updateFrontmatter }: EditorProps) => (
  <Switch
    aria-label="bool"
    size="small"
    checked={node.value as boolean | undefined}
    onChange={() => updateFrontmatter(node.name, !node.value, parentNames)}
  />
);
const nestEditor = (props: EditorProps) => {
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
const pickEditor = (props: {
  node: IFrontmatterNode;
  parentNames: undefined | string[];
  updateFrontmatter: IFileManager["updateFrontmatter"];
}) => {
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

interface Props {
  fileManager: IFileManager;
  siteConfig: ISiteConfig;
}

function FrontmatterEditor({
  fileManager: { file, updateFrontmatter },
  siteConfig,
}: Props) {
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
