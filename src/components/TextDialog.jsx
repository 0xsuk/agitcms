import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

function TextDialog({
  initialValue = "",
  isOpen,
  onClose,
  onSave,
  dialogTitle,
  tailValue,
  isValid,
}) {
  const [value, setValue] = useState(initialValue);

  const handleClose = () => {
    onClose();
    setValue("");
  };

  const handleSave = () => {
    onClose();
    onSave(value);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          fullWidth
          value={value}
          variant="standard"
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && isValid(value)) {
              handleSave();
            }
          }}
          InputProps={{
            endAdornment: <p>{tailValue}</p>,
          }}
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={!isValid(value)} onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TextDialog;
