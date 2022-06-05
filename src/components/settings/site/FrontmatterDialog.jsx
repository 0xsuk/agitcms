import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
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
} from "@mui/material";
import { useState } from "react";
import { FrontmatterTypes } from "../../../lib/useSiteConfig";

function ArrayOfStringMatter({
  handleBack,
  Default: initialDefault,
  Key: initialKey,
  id,
  handleMatterSave,
}) {
  const [Key, setKey] = useState(initialKey);
  const [Default, setDefault] = useState(initialDefault);
  const [singleValue, setSingleValue] = useState("");
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <TextField
              fullWidth
              value={Key}
              label="name"
              onChange={(e) => setKey(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Typography>Default</Typography>
            <TextField
              fullWidth
              variant="standard"
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
              <p
                onClick={() => {
                  const newDefault = JSON.parse(JSON.stringify(Default));
                  newDefault.splice(i, 1);
                  setDefault(newDefault);
                }}
              >
                {v} x
              </p>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>Back</Button>
        <Button
          disabled={Key === ""}
          onClick={() => {
            handleMatterSave(id, Key, Default);
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
  Key: initialKey,
  id,
  handleMatterSave,
  option: initialOption,
}) {
  const [Key, setKey] = useState(initialKey);
  const [Default, setDefault] = useState(initialDefault);
  const [option, setOption] = useState(initialOption);
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <TextField
              fullWidth
              value={Key}
              label="name"
              onChange={(e) => setKey(e.target.value)}
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
          disabled={Key === ""}
          onClick={() => {
            handleMatterSave(id, Key, Default, option);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}
function StringMatter({
  handleBack,
  Default: initialDefault,
  Key: initialKey,
  id,
  handleMatterSave,
}) {
  const [Key, setKey] = useState(initialKey);
  const [Default, setDefault] = useState(initialDefault);
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <TextField
              fullWidth
              value={Key}
              label="name"
              onChange={(e) => setKey(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              value={Default}
              label="default"
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
          disabled={Key === ""}
          onClick={() => {
            handleMatterSave(id, Key, Default);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}

function BoolMatter({
  handleBack,
  Default: initialDefault,
  Key: initialKey,
  id,
  handleMatterSave,
}) {
  const [Key, setKey] = useState(initialKey);
  const [Default, setDefault] = useState(initialDefault);
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <TextField
              fullWidth
              value={Key}
              label="name"
              onChange={(e) => setKey(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Typography>Default</Typography>
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
          disabled={Key === ""}
          onClick={() => {
            handleMatterSave(id, Key, Default);
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
        {FrontmatterTypes.map((t) => (
          <>
            <Divider></Divider>

            <MenuItem value={t.key} onClick={() => handleSave(t.key)}>
              {t.name}
            </MenuItem>
          </>
        ))}
      </MenuList>
    </>
  );
}

function FrontmatterDialog({ open, onClose, addFrontmatter }) {
  const [type, setType] = useState(null);
  const id = uuid();
  //save key, default
  const handleClose = () => {
    onClose();
    setType(null);
  };
  const handleMatterSave = (id, key, Default, option) => {
    //double check
    if (key === "") {
      alert("name cannot be empty");
      return;
    }
    addFrontmatter(id, key, type, Default, option);
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
      {type === "Bool" && (
        <BoolMatter
          handleBack={() => setType(null)}
          handleMatterSave={handleMatterSave}
          Key={""}
          Default={false}
          id={id}
        />
      )}
      {type === "String" && (
        <StringMatter
          handleBack={() => setType(null)}
          handleMatterSave={handleMatterSave}
          Key={""}
          Default={null}
          id={id}
        />
      )}
      {type === "Date" && (
        <DateMatter
          handleBack={() => setType(null)}
          handleMatterSave={handleMatterSave}
          Key={""}
          Default={null}
          id={id}
          option={{ useNow: true }}
        />
      )}
      {type === "Array.String" && (
        <ArrayOfStringMatter
          handleBack={() => setType(null)}
          handleMatterSave={handleMatterSave}
          Key={""}
          Default={[]}
          id={id}
        />
      )}
    </Dialog>
  );
}
export default FrontmatterDialog;
