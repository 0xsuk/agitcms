import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Grow from "@mui/material/Grow";
import TextDialog from "./TextDialog";
import { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import useSiteConfig from "../lib/useSiteConfig";

function CreateNewDf({ cwdf }) {
  const siteConfig = useSiteConfig();
  const history = useHistory();
  const [isNewButtonOpen, setIsNewButtonOpen] = useState(false);
  const anchorRef = useRef(null);
  const closeNewButton = () => {
    setIsNewButtonOpen(false);
  };
  const toggleNewButton = () => {
    setIsNewButtonOpen((prev) => !prev);
  };
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const closeFolderDialog = () => {
    setIsFolderDialogOpen(false);
  };
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const closeFileDialog = () => {
    setIsFileDialogOpen(false);
  };

  const createFile = async () => {
    const fileName = document.getElementById("agit-file-dialog").value + ".md";
    const filePath = cwdf + "/" + fileName;
    const doc = "";
    //the default frontmatter
    const frontmatter = {};
    siteConfig.frontmatter.forEach((matter) => {
      const key = matter.key;
      let value = matter.default;
      if (matter.type === "Date" && matter.option?.useNow) {
        value = Date.now();
      }
      frontmatter[key] = value;
    });

    const { err, isFileExists } = await window.electronAPI.createFile(
      filePath,
      doc,
      frontmatter
    );
    if (err !== null) {
      window.alert("createFile:", err.message);
      return;
    }
    if (isFileExists) {
      const doOverwrite = window.confirm("File already exists! Overwrite?");
      if (!doOverwrite) {
        return;
      }
      const { err } = await window.electronAPI.createFile(
        filePath,
        doc,
        frontmatter
      );
      if (err !== null) {
        window.alert("createFile:", err.message);
        return;
      }
    }
    history.push(
      "?path=" + cwdf + "/" + fileName + "&isDir=false&name=" + fileName
    );
  };

  const createFolder = async () => {
    const folderName = document.getElementById("agit-folder-dialog").value;
    const folderPath = cwdf + "/" + folderName;
    const { err } = await window.electronAPI.createFolder(folderPath);
    if (err !== null) {
      alert(err.message);
      return;
    }
    window.location.reload();
  };

  return (
    <>
      <ButtonGroup>
        <Button onClick={toggleNewButton}>Create New</Button>
        <Button ref={anchorRef} onClick={toggleNewButton}>
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Popper
        open={isNewButtonOpen}
        disablePortal
        transition
        anchorEl={anchorRef.current}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={closeNewButton}>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setIsFileDialogOpen(true);
                      setIsNewButtonOpen(false);
                    }}
                  >
                    File
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setIsFolderDialogOpen(true);
                      setIsNewButtonOpen(false);
                    }}
                  >
                    Folder
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <TextDialog
        isOpen={isFileDialogOpen}
        onClose={closeFileDialog}
        onSave={createFile}
        dialogTitle="File name:"
        dialogId="agit-file-dialog"
        tailValue=".md"
      />
      <TextDialog
        isOpen={isFolderDialogOpen}
        onClose={closeFolderDialog}
        onSave={createFolder}
        dialogTitle="Folder name:"
        dialogId="agit-folder-dialog"
      />
    </>
  );
}

export default CreateNewDf;
