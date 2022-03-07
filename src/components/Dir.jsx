import { Fragment, useContext, useEffect, useState } from "react";
import {
  Link,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { configContext } from "../context/ConfigContext";
import Editor from "./Editor";
import { findSiteConfigBySiteKey } from "../lib/config";

function Dir() {
  const { config } = useContext(configContext);
  const [filesAndFolders, setFilesAndFolders] = useState([]);
  const pathname = useLocation().pathname;
  const [params] = useSearchParams();
  const siteKey = Number(useParams().siteKey);
  const siteConfig = findSiteConfigBySiteKey(config, siteKey);
  const relativeDirPath = pathname
    .replace("/edit/" + siteKey, "")
    .replace("/", ""); //ex) /edit/1234/dir1/dir2 -> dir1/dir2
  const isInDir = params.get("isDir") === "true" || relativeDirPath === "";
  const fullDirPath = siteConfig.path + "/" + relativeDirPath; // even if relativeDirPath == "", works fine

  useEffect(() => {
    console.warn("Dir Effect");
    if (!isInDir) return;
    window.electronAPI.getFilesAndFolders(fullDirPath).then((res) => {
      if (res.err) {
        alert(res.err.message);
        return;
      }
      setFilesAndFolders(res.filesAndFolders);
    });
  }, [fullDirPath, isInDir]);

  return (
    <Fragment>
      <p>{relativeDirPath}</p>

      {isInDir &&
        filesAndFolders.map((f) => (
          <Fragment>
            {f.isDir ? (
              <div>
                <Link
                  to={
                    relativeDirPath === ""
                      ? f.name + "?isDir=true"
                      : relativeDirPath + "/" + f.name + "?isDir=true"
                  }
                >
                  <p style={{ color: "gray" }}>{f.name}</p>
                </Link>
              </div>
            ) : (
              <>
                {f.extension === ".md" && (
                  <div>
                    <Link
                      to={
                        relativeDirPath === ""
                          ? f.name + "?isDir=false"
                          : relativeDirPath + "/" + f.name + "?isDir=false"
                      }
                    >
                      <p>{f.name}</p>
                    </Link>
                  </div>
                )}
              </>
            )}
          </Fragment>
        ))}
      {!isInDir && <Editor filePath={fullDirPath}></Editor>}
    </Fragment>
  );
}

export default Dir;
