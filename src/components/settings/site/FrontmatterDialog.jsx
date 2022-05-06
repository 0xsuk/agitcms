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

function BoolMatter({
  handleClose,
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
        <Button onClick={handleClose}>Cancel</Button>
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
  const handleMatterSave = (key, Default) => {
    addOrEditFrontmatter(key, type, Default);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {/* Edit matter type */}
      {type === null && (
        <TypeDialog
          handleClose={onClose}
          handleSave={(type) => setType(type)}
        />
      )}
      {/* Edit matter key&default*/}
      {type === "Bool" && (
        <BoolMatter
          handleClose={onClose}
          handleMatterSave={handleMatterSave}
          Key={""}
          Default={false}
        />
      )}
    </Dialog>
  );
}
export default FrontmatterDialog;
