import { v4 as uuid } from "uuid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  Grid,
  TextField,
  Typography,
  MenuList,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { FrontmatterTypes } from "../lib/frontmatterInterface";

function ArrayOfTextMatter({
  handleBack,
  Default: initialDefault,
  name: initialName,
  handleMatterSave,
}) {
  const [name, setName] = useState(initialName);
  const [Default, setDefault] = useState(initialDefault);
  const [singleValue, setSingleValue] = useState("");
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Typography>Name:</Typography>
            <TextField
              fullWidth
              value={name}
              label="required"
              onChange={(e) => setName(e.target.value)}
              variant="filled"
            />
          </Grid>
          <Grid item>
            <Typography>Default:</Typography>
            <TextField
              fullWidth
              variant="filled"
              placeholder="String"
              value={singleValue}
              onChange={(e) => {
                setSingleValue(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => {
                      //if (!Default) Default = [];
                      if (!singleValue) return;
                      setDefault((prev) => [...prev, singleValue]);
                      setSingleValue(""); //null does not work
                    }}
                  >
                    ADD
                  </Button>
                ),
              }}
            />
            {Default?.map((v, i) => (
              <Chip
                onDelete={() => {
                  const newDefault = JSON.parse(JSON.stringify(Default));
                  newDefault.splice(i, 1);
                  setDefault(newDefault);
                }}
                label={v}
              ></Chip>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>Back</Button>
        <Button
          disabled={name === ""}
          onClick={() => {
            handleMatterSave(name, Default);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}
function DateMatter({
  handleBack,
  Default: initialDefault,
  name: initialName,
  handleMatterSave,
  option: initialOption,
}) {
  const [name, setName] = useState(initialName);
  const [Default, setDefault] = useState(initialDefault);
  const [option, setOption] = useState(initialOption);
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Typography>Name:</Typography>
            <TextField
              fullWidth
              value={name}
              label="required"
              variant="filled"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Typography>Use now as default:</Typography>
            <Switch
              size="small"
              defaultChecked={option.useNow}
              onChange={() =>
                setOption((prev) => ({ ...prev, useNow: !prev.useNow }))
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>Back</Button>
        <Button
          disabled={name === ""}
          onClick={() => {
            handleMatterSave(name, Default, option);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}
function TextMatter({
  handleBack,
  Default: initialDefault,
  name: initialName,
  handleMatterSave,
}) {
  const [name, setName] = useState(initialName);
  const [Default, setDefault] = useState(initialDefault);
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Typography>Name:</Typography>
            <TextField
              fullWidth
              value={name}
              variant="filled"
              label="required"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Typography>Default:</Typography>
            <TextField
              fullWidth
              value={Default}
              variant="filled"
              label="optional"
              onChange={(e) => {
                let value = e.target.value;
                if (value == "") {
                  setDefault(null);
                  return;
                }
                setDefault(value);
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>Back</Button>
        <Button
          disabled={name === ""}
          onClick={() => {
            handleMatterSave(name, Default);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}
const MultilineTextMatter = ({
  handleBack,
  Default: initialDefault,
  name: initialName,
  handleMatterSave,
}) => {
  const [name, setName] = useState(initialName);
  const [Default, setDefault] = useState(initialDefault);
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Typography>Name:</Typography>
            <TextField
              fullWidth
              value={name}
              variant="filled"
              label="required"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Typography>Default:</Typography>
            <TextField
              fullWidth
              multiline
              value={Default}
              variant="filled"
              label="optional"
              onChange={(e) => {
                let value = e.target.value;
                if (value == "") {
                  setDefault(null);
                  return;
                }
                setDefault(value);
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>Back</Button>
        <Button
          disabled={name === ""}
          onClick={() => {
            handleMatterSave(name, Default);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
};

function BoolMatter({
  handleBack,
  Default: initialDefault,
  name: initialName,
  handleMatterSave,
}) {
  const [name, setName] = useState(initialName);
  const [Default, setDefault] = useState(initialDefault);
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Typography>Name:</Typography>
            <TextField
              fullWidth
              value={name}
              variant="filled"
              label="required"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Typography>Default:</Typography>
            <Switch
              size="small"
              defaultChecked={Default}
              onChange={() => setDefault((prev) => !prev)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>Back</Button>
        <Button
          disabled={name === ""}
          onClick={() => {
            handleMatterSave(name, Default);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}

function NestMatter({
  handleBack,
  handleMatterSave,
  name: initialName,
  Default,
}) {
  const [name, setName] = useState(initialName);
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Typography>Name:</Typography>
            <TextField
              fullWidth
              value={name}
              variant="filled"
              label="required"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>Back</Button>
        <Button
          disabled={name === ""}
          onClick={() => {
            handleMatterSave(name, Default);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}

function TypeDialog({ handleClose, handleSave }) {
  //const [type, setType] = useState(null);
  return (
    <>
      <DialogTitle>Select Frontmatter Type</DialogTitle>
      <MenuList>
        {Object.values(FrontmatterTypes).map((type) => (
          <>
            <Divider></Divider>

            <MenuItem value={type} onClick={() => handleSave(type)}>
              {type}
            </MenuItem>
          </>
        ))}
      </MenuList>
    </>
  );
}

function FrontmatterDialog({ open, onClose, saveFrontmatter, metainfo }) {
  const initialType = metainfo ? metainfo.type : null;
  const [type, setType] = useState(initialType);
  let key = metainfo ? metainfo.key : uuid();
  //save key, default
  const handleClose = () => {
    onClose();
    setType(initialType);
  };
  const handleMatterSave = (name, Default, option) => {
    //double check
    if (name === "") {
      alert("name cannot be empty");
      return;
    }

    const newChildMetainfo = {
      name,
      key,
      type,
      default: Default,
      option,
    };

    saveFrontmatter(newChildMetainfo);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {/* Edit matter type */}
      {type === null && (
        <TypeDialog
          handleClose={handleClose}
          handleSave={(type) => setType(type)}
        />
      )}
      {/* Edit matter key&default*/}
      {type === FrontmatterTypes.Text && (
        <TextMatter
          handleBack={() => setType(null)}
          handleMatterSave={handleMatterSave}
          name={""}
          Default={null}
        />
      )}
      {type === FrontmatterTypes.MultilineText && (
        <MultilineTextMatter
          handleBack={() => setType(null)}
          handleMatterSave={handleMatterSave}
          name={""}
          Default={null}
        />
      )}

      {type === FrontmatterTypes.ListOfText && (
        <ArrayOfTextMatter
          handleBack={() => setType(initialType)}
          handleMatterSave={handleMatterSave}
          name={""}
          Default={[]}
        />
      )}
      {type === FrontmatterTypes.Date && (
        <DateMatter
          handleBack={() => setType(initialType)}
          handleMatterSave={handleMatterSave}
          name={""}
          Default={null}
          option={{ useNow: true }}
        />
      )}
      {type === FrontmatterTypes.Bool && (
        <BoolMatter
          handleBack={() => setType(initialType)}
          handleMatterSave={handleMatterSave}
          name={""}
          Default={false}
        />
      )}
      {type === FrontmatterTypes.Nest && (
        <NestMatter
          handleBack={() => setType(initialType)}
          handleMatterSave={handleMatterSave}
          name={""}
          Default={[]}
        />
      )}
    </Dialog>
  );
}
export default FrontmatterDialog;
