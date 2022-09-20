import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Menu, MenuItem } from "@mui/material";
import { ISiteConfig } from "@shared/types/config";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useSiteConfig from "@/utils/useSiteConfig";
import CreateNewDf from "./CreateNewDf";
import TextDialog from "./TextDialog";
import { socketClient } from "@/utils/socketClient";
import { warnError } from "@/utils/warnError";

function Explorer() {
  const [filesAndFolders, setFilesAndFolders] = useState<
    { name: string; isDir: boolean; extension: string }[]
  >([]);
  const siteConfig = useSiteConfig() as ISiteConfig;
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);

  //current working dir or filek
  const cwdf = searchparams.get("path") as string;
  const isInRoot = cwdf === siteConfig.path;
  const isInDir = searchparams.get("isDir") === "true" || isInRoot;

  useEffect(() => {
    if (!isInDir) return;
    loadFilesAndFolders();
  }, [cwdf]); //eslint-disable-line

  const loadFilesAndFolders = async () => {
    const { filesAndFolders, err } = await socketClient.getFilesAndFolders(
      cwdf
    );
    if (err !== null) {
      warnError(err);
      return;
    }
    setFilesAndFolders(filesAndFolders);
  };

  if (!isInDir) {
    return <></>;
  }

  return (
    <div id="explorer">
      <CreateNewDf cwdf={cwdf} />
      {filesAndFolders.map((df) => {
        if (df.isDir || df.extension === ".md")
          return <Df {...{ siteConfig, cwdf, df, loadFilesAndFolders }} />;
      })}
    </div>
  );
}

interface DfProps {
  siteConfig: ISiteConfig;
  cwdf: string;
  df: { name: string; isDir: boolean; extension: string };
  loadFilesAndFolders: () => Promise<void>;
}

function Df({ siteConfig, cwdf, df, loadFilesAndFolders }: DfProps) {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
  const history = useHistory();

  const renameDf = async (newName: string) => {
    const oldDfPath = cwdf + "/" + df.name;
    const newDfPath = cwdf + "/" + newName;
    const err = await socketClient.renameFileOrFolder({
      oldDfPath,
      newDfPath,
    });
    if (err !== null) {
      warnError(err);
      return;
    }
    loadFilesAndFolders();
  };
  const removeDf = async () => {
    const dfPath = cwdf + "/" + df.name;
    if (!window.confirm("Delete " + dfPath + " ?")) return;
    let err;
    if (df.isDir) {
      err = await socketClient.removeFolder(dfPath);
    } else {
      err = await socketClient.removeFile(dfPath);
    }
    if (err !== null) {
      warnError(err);
      return;
    }
    loadFilesAndFolders();
  };

  return (
    <>
      <TextDialog
        initialValue={df.name}
        isOpen={isFileDialogOpen}
        onClose={() => setIsFileDialogOpen(false)}
        onSave={renameDf}
        dialogTitle="File name:"
        isValid={(value) => value !== ""} //TODO:
      />
      <TextDialog
        initialValue={df.name}
        isOpen={isFolderDialogOpen}
        onClose={() => setIsFolderDialogOpen(false)}
        onSave={renameDf}
        dialogTitle="Folder name:"
        isValid={(value) => value !== ""} //TODO
      />
      <div
        className="df"
        onClick={() => {
          if (df.isDir) {
            history.push(
              "?path=" + cwdf + "/" + df.name + "&isDir=" + df.isDir
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
              df.isDir
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
          onClose={(e: Event) => {
            setAnchorEl(null);
            e.stopPropagation();
          }}
          //on Click menuitems
          onClick={(e) => {
            setAnchorEl(null);
            e.stopPropagation();
          }}
        >
          <MenuItem
            onClick={() => {
              if (df.isDir) {
                setIsFolderDialogOpen(true);
              } else {
                setIsFileDialogOpen(true);
              }
            }}
          >
            rename
          </MenuItem>
          <MenuItem onClick={removeDf}>delete</MenuItem>
        </Menu>
      </div>
    </>
  );
}

export default Explorer;
