import TextDialog from "@/components/TextDialog";
import { fillFrontmatterJson, genContent } from "@/utils/frontmatterInterface";
import useSiteConfig from "@/utils/useSiteConfig";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { ISiteConfig } from "@shared/types/config";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";

function CreateNewDf({ cwdf }: { cwdf: string }) {
  const siteConfig = useSiteConfig() as ISiteConfig;
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

  const createFile = async (value: string) => {
    const fileName = value + ".md";
    const filePath = cwdf + "/" + fileName;
    const doc = "";
    //the default frontmatter
    const frontmatter = fillFrontmatterJson(siteConfig.frontmatter);
    const content = genContent(siteConfig, doc, frontmatter);

    //@ts-ignore
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
      //@ts-ignore
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
      "/site/editor/" +
        siteConfig.key +
        "?path=" +
        cwdf +
        "/" +
        fileName +
        "&isDir=false&name=" +
        fileName
    );
  };

  const createFolder = async (folderName: string) => {
    const folderPath = cwdf + "/" + folderName;
    //@ts-ignore
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
        isValid={(value: string) => value !== ""} //TODO:
      />
      <TextDialog
        isOpen={isFolderDialogOpen}
        onClose={closeFolderDialog}
        onSave={createFolder}
        dialogTitle="Folder name:"
        isValid={(value: string) => value !== ""} //TODO
      />
    </div>
  );
}

export default CreateNewDf;
