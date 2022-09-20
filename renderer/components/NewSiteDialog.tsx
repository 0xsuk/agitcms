import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import FolderPicker from "./FolderPicker";

function Name({ handleSave }: { handleSave: (newName: string) => void }) {
  const [name, setName] = useState("");
  const isValid = name !== "";

  return (
    <>
      <DialogTitle>Enter a site name</DialogTitle>
      <DialogContent>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="standard"
          placeholder="Name of the site"
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button disabled={!isValid} onClick={() => handleSave(name)}>
          NEXT
        </Button>
      </DialogActions>
    </>
  );
}

function Path({
  handleSave,
  handleBack,
}: {
  handleSave: (newPath: string) => void;
  handleBack: () => void;
}) {
  return (
    <>
      <DialogTitle>Select a site folder</DialogTitle>
      <DialogContent sx={{ width: "500px", height: "500px" }}>
        <FolderPicker onPickFolder={(folderPath) => handleSave(folderPath)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack}>BACK</Button>
      </DialogActions>
    </>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  addNewSite: (siteName: string, sitePath: string) => void;
}

function NewSiteDialog({ open, onClose, addNewSite }: Props) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  const handleClose = () => {
    onClose();
    setName("");
    setPath("");
  };

  const save = () => {
    addNewSite(name, path);
    handleClose();
  };

  if (path !== "") {
    save();
    return <></>;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      {name === "" ? (
        <Name handleSave={(newName) => setName(newName)} />
      ) : (
        <Path
          handleSave={(newPath) => setPath(newPath)}
          handleBack={() => setName("")}
        />
      )}
    </Dialog>
  );
}

export default NewSiteDialog;
