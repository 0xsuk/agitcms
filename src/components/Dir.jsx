import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ConfigContext } from "../App";
import Editor from "./Editor";
import { findSiteConfigBySiteKey } from "../lib/config";

function Dir() {
  console.log("Dir");
  const { config } = useContext(ConfigContext);
  const [filesAndFolders, setFilesAndFolders] = useState([]);
  const pathname = useLocation().pathname;
  const { siteKey } = useParams();
  const siteConfig = findSiteConfigBySiteKey(config, siteKey);
  //current directory path from project root
  //if currentDir ends with / -> folder, else -> file (//TODO: it is possible for files with ending / to exists on win/mac)
  const currentRelativeDir = pathname
    .replace("/edit/" + siteKey, "")
    .replace("/", "");
  const isDir = currentRelativeDir == "" || currentRelativeDir.slice(-1) == "/";
  const currentDirPath = siteConfig.path + "/" + currentRelativeDir; // even if currentRelativeDir == "", works fine
  console.log("currentRelativeDir:", currentRelativeDir);
  console.log("currentDirPath:", currentDirPath);

  useEffect(async () => {
    console.log("reloading folders");

    if (isDir) {
      const res = await window.electronAPI.getFilesAndFolders(currentDirPath);
      if (res.err) {
        alert(res.err.message);
        return;
      }
      setFilesAndFolders(res.filesAndFolders);
    }
  }, [pathname]);

  return (
    <Fragment>
      <p>{currentRelativeDir}</p>

      {isDir &&
        filesAndFolders.map((f) => (
          <Fragment>
            {f.isDir ? (
              <div>
                <Link
                  to={
                    currentRelativeDir == ""
                      ? f.name + "/"
                      : currentRelativeDir + f.name + "/"
                  }
                >
                  <p style={{ color: "gray" }}>{f.name}</p>
                </Link>
              </div>
            ) : (
              <div>
                <Link
                  to={
                    currentRelativeDir == ""
                      ? f.name
                      : currentRelativeDir + f.name
                  }
                >
                  <p>{f.name}</p>
                </Link>
              </div>
            )}
          </Fragment>
        ))}
      {!isDir && <Editor filePath={currentDirPath}></Editor>}
    </Fragment>
  );
}

export default Dir;
