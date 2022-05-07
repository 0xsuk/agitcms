import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { FrontmatterTypes } from "../../../App";

function StringMatter({
  handleBack,
  Default: initialDefault,
  Key: initialKey,
  handleMatterSave,
}) {
  const [Key, setKey] = useState(initialKey);
  const [Default, setDefault] = useState(initialDefault);
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <TextField
          value={Key}
          label="name"
          onChange={(e) => setKey(e.target.value)}
        />
        <TextField
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>Back</Button>
        <Button
          onClick={() => {
            handleMatterSave(Key, Default);
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
  handleMatterSave,
}) {
  const [Key, setKey] = useState(initialKey);
  const [Default, setDefault] = useState(initialDefault);
  return (
    <>
      <DialogTitle>Set frontmatter name & default value</DialogTitle>
      <DialogContent>
        <TextField
          value={Key}
          label="name"
          onChange={(e) => setKey(e.target.value)}
        />
        <Switch
          size="small"
          defaultChecked={Default}
          onChange={() => setDefault((prev) => !prev)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>Back</Button>
        <Button
          onClick={() => {
            handleMatterSave(Key, Default);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}

function TypeDialog({ handleClose, handleSave }) {
  const [type, setType] = useState(null);
  return (
    <>
      <DialogTitle>Select Frontmatter Type</DialogTitle>
      <DialogContent>
        <Select
          onChange={(e) => {
            setType(e.target.value);
          }}
          value={type}
          label="Type"
        >
          {FrontmatterTypes.map((t) => (
            <MenuItem value={t.name}>{t.name}</MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleSave(type);
          }}
        >
          Next
        </Button>
      </DialogActions>
    </>
  );
}

function FrontmatterDialog({ open, onClose, addOrEditFrontmatter }) {
  const [type, setType] = useState(null);
  //save key, default
  const handleClose = () => {
    onClose();
    setType(null);
  };
  const handleMatterSave = (key, Default) => {
    addOrEditFrontmatter(key, type, Default);
    onClose();
    setType(null);
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
        />
      )}
      {type === "String" && (
        <StringMatter
          handleBack={() => setType(null)}
          handleMatterSave={handleMatterSave}
          Key={""}
          Default={null}
        />
      )}
    </Dialog>
  );
}
export default FrontmatterDialog;
