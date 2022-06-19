import { v4 as uuid } from "uuid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";

function CommandDialog({ open, onClose, addCommand }) {
  const key = uuid();
  const [commandName, setCommandName] = useState("");
  const [command, setCommand] = useState("");

  const handleClose = () => {
    onClose();
    setCommandName("");
    setCommand("");
  };

  const handleSave = () => {
    addCommand(key, commandName, command);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Command Shortcut</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              placeholder="Name"
              value={commandName}
              onChange={(e) => setCommandName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              placeholder="Command"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          disabled={commandName === "" || command === ""}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CommandDialog;
