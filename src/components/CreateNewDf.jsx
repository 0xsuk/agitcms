import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
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
import { fillFrontmatterJson, genContent } from "../lib/frontmatterInterface";

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

  const createFile = async (value) => {
    const fileName = value + ".md";
    const filePath = cwdf + "/" + fileName;
    const doc = "";
    //the default frontmatter
    const frontmatter = fillFrontmatterJson(siteConfig.frontmatter);
    const content = genContent(siteConfig, doc, frontmatter);

    const { err, isFileExists } = await window.electronAPI.createFile(
      filePath,
      content
    );
    if (err !== null) {
      window.alert(err.message);
      return;
    }
    if (isFileExists) {
      if (!window.confirm("File already exists! Overwrite?")) {
        return;
      }
      const { err } = await window.electronAPI.createFile(
        filePath,
        content,
        true
      );
      if (err !== null) {
        window.alert(err.message);
        return;
      }
    }
    history.push(
      "?path=" + cwdf + "/" + fileName + "&isDir=false&name=" + fileName
    );
  };

  const createFolder = async (folderName) => {
    const folderPath = cwdf + "/" + folderName;
    const { err } = await window.electronAPI.createFolder(folderPath);
    if (err !== null) {
      alert(err.message);
      return;
    }
    window.location.reload();
  };

  return (
    <div>
      <Button
        onClick={toggleNewButton}
        ref={anchorRef}
        endIcon={<ArrowDropDown />}
        size="large"
      >
        Create New
      </Button>
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
        tailValue=".md"
        isValid={(value) => value !== ""} //TODO:
      />
      <TextDialog
        isOpen={isFolderDialogOpen}
        onClose={closeFolderDialog}
        onSave={createFolder}
        dialogTitle="Folder name:"
        isValid={(value) => value !== ""} //TODO
      />
    </div>
  );
}

export default CreateNewDf;
