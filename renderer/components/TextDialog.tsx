import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void | Promise<void>;
  dialogTitle: string;
  isValid: (value: string) => boolean;
  textType?: string;
  tailValue?: string;
  initialValue?: string;
}

function TextDialog({
  isOpen,
  onClose,
  onSave,
  dialogTitle,
  isValid,
  tailValue,
  textType = "string",
  initialValue = "",
}: Props) {
  const [value, setValue] = useState(initialValue);

  const handleClose = () => {
    onClose();
    setValue(initialValue);
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
          type={textType}
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
