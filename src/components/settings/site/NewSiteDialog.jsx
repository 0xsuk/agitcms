import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { useState } from "react";

function NewSiteDialog({ open, onClose, addNewSite }) {
  const [siteName, setSiteName] = useState("");
  const [sitePath, setSitePath] = useState("");
  console.log(siteName, sitePath);
  const isValid = siteName !== "" && sitePath !== "";

  const handleClose = () => {
    onClose();
    setSiteName("");
    setSitePath("");
  };

  const handleSave = () => {
    addNewSite(siteName, sitePath);
    handleClose();
  };

  const editSitePath = async () => {
    const { folderPath, err, canceled } =
      await window.electronAPI.getFolderPath();
    if (err) {
      console.warn(err);
      return;
    }

    if (!err && !canceled) {
      setSitePath(folderPath);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item container spacing={1} alignItems="center">
              <Grid item>
                <Typography>Name:</Typography>
              </Grid>
              <Grid item>
                <TextField
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  variant="standard"
                  placeholder="Name of the site"
                ></TextField>
              </Grid>
            </Grid>
            <Grid item container spacing={1} alignItems="center">
              <Grid item>
                <Typography>Path:</Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ color: "#999" }}>
                  {sitePath ? sitePath : "select root folder path"}
                </Typography>
              </Grid>
              <Grid item>
                <Button onClick={editSitePath}>
                  <DriveFolderUploadOutlinedIcon />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!isValid} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NewSiteDialog;
