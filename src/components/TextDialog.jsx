import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

function TextDialog({ isOpen, onClose, onSave, dialogId, dialogTitle }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          fullWidth
          variant="standard"
          id={dialogId}
          onKeyPress={(e) => {
            if (e.key == "Enter") {
              onClose();
              onSave();
            }
          }}
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onClose();
            onSave();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TextDialog;
