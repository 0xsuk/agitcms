import { ArrowDropDown } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { configContext } from "../context/ConfigContext";
import useSiteConfig from "../lib/useSiteConfig";
import Editor from "./Editor";
import TextDialog from "./TextDialog";

function Dir() {
  const [filesAndFolders, setFilesAndFolders] = useState([]);
  const { siteConfig } = useSiteConfig();
  const { updateSiteConfig } = useContext(configContext);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  //current working dir or filek
  const cwdf = params.get("path");
  const dfName = params.get("name");
  const isInRoot = cwdf === siteConfig.path;
  const isInDir = params.get("isDir") === "true" || isInRoot;
  const isDfPinned = !siteConfig.pinnedDirs.every((df) => {
    if (df.path === cwdf) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    console.warn("Dir Effect");
    if (!isInDir) return;
    window.electronAPI.getFilesAndFolders(cwdf).then((res) => {
      if (res.err) {
        alert(res.err.message);
        return;
      }
      setFilesAndFolders(res.filesAndFolders);
    });
  }, [cwdf]); //eslint-disable-line

  const addPinnedDirs = (name, path, isDir) => {
    updateSiteConfig({
      ...siteConfig,
      pinnedDirs: [...siteConfig.pinnedDirs, { name, path, isDir }],
    });
  };

  const removePinnedDir = (path, isDir) => {
    const pinnedDirs = siteConfig.pinnedDirs.filter(
      (df) => df.path !== path || df.isDir !== isDir
    );
    updateSiteConfig({
      ...siteConfig,
      pinnedDirs,
    });
  };

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
    // TODO: read default frontmatter settings here
    const fileName = document.getElementById("agit-file-dialog").value;
    const data = "sample data";
    const filePath = cwdf + "/" + fileName;
    const { err } = await window.electronAPI.createFile(filePath, data);
    if (err !== null) {
      alert("createFile:", err.message);
      return;
    }
    navigate(
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
    <div id="explorer">
      <div id="top-bar">
        {cwdf}{" "}
        {isDfPinned ? (
          <button onClick={() => removePinnedDir(cwdf, isInDir)}>Unpin</button>
        ) : (
          <button onClick={() => addPinnedDirs(dfName, cwdf, isInDir)}>
            Pin
          </button>
        )}
      </div>
      {isInDir && (
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
                      {/* TODO */}
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
          />
          <TextDialog
            isOpen={isFolderDialogOpen}
            onClose={closeFolderDialog}
            onSave={createFolder}
            dialogTitle="Folder name:"
            dialogId="agit-folder-dialog"
          />
        </>
      )}
      {isInDir &&
        filesAndFolders.map((df) => (
          <>
            {df.isDir ? (
              <div>
                <Link
                  to={
                    "?path=" +
                    cwdf +
                    "/" +
                    df.name +
                    "&isDir=true&name=" +
                    df.name
                  }
                >
                  <p style={{ color: "gray" }}>{df.name}</p>
                </Link>
              </div>
            ) : (
              <>
                {df.extension === ".md" && (
                  <div>
                    <Link
                      to={
                        "?path=" +
                        cwdf +
                        "/" +
                        df.name +
                        "&isDir=false&name=" +
                        df.name
                      }
                    >
                      <p>{df.name}</p>
                    </Link>
                  </div>
                )}
              </>
            )}
          </>
        ))}
      {!isInDir && <Editor filePath={cwdf}></Editor>}
    </div>
  );
}

export default Dir;
