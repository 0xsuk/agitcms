import { socketClient } from "@/utils/socketClient";
import { warnError } from "@/utils/warnError";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import { Button } from "@mui/material";
import * as path from "path";
import { useEffect, useState } from "react";
import FolderNavigator from "./FolderNavigator";

interface Props {
  onPickFolder: (folderPath: string) => void;
  root?: string;
}

function FolderPicker({ onPickFolder, root }: Props) {
  const [folders, setFolders] = useState<string[]>([]);
  const [cwd, setCwd] = useState(root === undefined ? "" : root);

  useEffect(() => {
    loadFolders();
  }, [cwd]); //eslint-disable-line

  const loadFolders = async () => {
    const {
      filesAndFolders,
      err,
      cwd: newCwd,
    } = await socketClient.getFilesAndFolders(cwd);
    if (err !== null) {
      console.log(err);
      warnError(err);
      return;
    }

    const folders = filesAndFolders
      .filter((df) => df.isDir)
      .map((df) => df.name);
    setFolders(folders);
    if (cwd !== newCwd) {
      setCwd(newCwd);
    }
  };

  if (cwd === "") {
    return <></>;
  }
  return (
    <div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <FolderNavigator
          cwdf={cwd}
          root={root}
          onClickNewPath={(newPath) => setCwd(newPath)}
        />
        <Button size="large" onClick={() => onPickFolder(cwd)}>
          SELECT
        </Button>
      </div>
      {folders.map((f) => (
        <div className="df" onClick={() => setCwd(path.join(cwd, "/", f))}>
          <div style={{ display: "flex" }}>
            <FolderOpenOutlinedIcon fontSize="small" />
            <p style={{ paddingLeft: "10px" }}>{f}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FolderPicker;
