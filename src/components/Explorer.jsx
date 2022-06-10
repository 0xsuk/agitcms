import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useSiteConfig from "../lib/useSiteConfig";
import CreateNewDf from "./CreateNewDf";
import EditorWrapper from "./EditorWrapper";

function Explorer() {
  const [filesAndFolders, setFilesAndFolders] = useState([]);
  const siteConfig = useSiteConfig();
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);

  //current working dir or filek
  const cwdf = searchparams.get("path");
  const isInRoot = cwdf === siteConfig.path;
  const isInDir = searchparams.get("isDir") === "true" || isInRoot;

  useEffect(() => {
    console.warn("Dir Effect");
    if (!isInDir) return;
    loadFilesAndFolders();
  }, [cwdf]); //eslint-disable-line

  const loadFilesAndFolders = async () => {
    const { err, filesAndFolders } =
      await window.electronAPI.getFilesAndFolders(cwdf);
    if (err !== null) {
      alert(err);
      return;
    }
    setFilesAndFolders(filesAndFolders);
  };

  return (
    <div id="explorer">
      {isInDir && <CreateNewDf cwdf={cwdf} />}
      {isInDir &&
        filesAndFolders.map((df) => {
          //if (df.isDir || df.extension === ".md")
          return <Df {...{ siteConfig, cwdf, df, loadFilesAndFolders }} />;
        })}
      {!isInDir && <EditorWrapper filePath={cwdf}></EditorWrapper>}
    </div>
  );
}

function Df({ siteConfig, cwdf, df, loadFilesAndFolders }) {
  const [anchorEl, setAnchorEl] = useState(null);
  //const renameDf = async () => {};
  const history = useHistory();
  const removeDf = async () => {
    const dfPath = cwdf + "/" + df.name;
    let err;
    if (df.isDir) {
      err = (await window.electronAPI.removeFolder(dfPath)).err;
    } else {
      err = (await window.electronAPI.removeFile(dfPath)).err;
    }
    if (err !== null) {
      alert(err);
      return;
    }
    loadFilesAndFolders();
  };

  return (
    <div
      className="df"
      onClick={() => {
        if (df.isDir) {
          history.push(
            "?path=" +
              cwdf +
              "/" +
              df.name +
              "&isDir=" +
              df.isDir +
              "&name=" +
              df.name
          );
          return;
        }
        history.push(
          "/site/editor/" +
            siteConfig.key +
            "?path=" +
            cwdf +
            "/" +
            df.name +
            "&isDir=" +
            df.isDir +
            "&name=" +
            df.name
        );
      }}
    >
      <div style={{ display: "flex" }}>
        {df.isDir && <FolderOpenOutlinedIcon fontSize="small" />}
        <p style={{ paddingLeft: "10px" }}>{df.name}</p>
      </div>
      <MoreHorizIcon
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
          e.stopPropagation();
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={(e) => {
          setAnchorEl(null);
          e.stopPropagation();
        }}
        //on Click menuitems
        onClick={(e) => {
          setAnchorEl(null);
          e.stopPropagation();
        }}
      >
        {/*     <MenuItem onClick={renameDf}>rename</MenuItem> */}
        <MenuItem onClick={removeDf}>delete</MenuItem>
      </Menu>
    </div>
  );
}

export default Explorer;
