import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Editor from "./Editor";
import { useSiteConfig } from "../lib/config";

function Dir() {
  const [filesAndFolders, setFilesAndFolders] = useState([]);
  const [siteKey, siteConfig] = useSiteConfig();

  //TODO: decoding URI here
  const pathname = decodeURIComponent(useLocation().pathname);
  const relativeDirPath = pathname
    .replace("/edit/" + siteKey, "")
    .replace("/", ""); //ex) /edit/1234/dir1/dir2 -> dir1/dir2
  const [params] = useSearchParams();
  const isInDir = params.get("isDir") === "true" || relativeDirPath === "";
  const fullDirPath = siteConfig.path + "/" + relativeDirPath; // even if relativeDirPath == "", works fine
  const fileName = params.get("fileName"); //optional //already decoded by get method

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
                      //if f.name == "some filename with space", Link url-encode it
                      to={
                        relativeDirPath === ""
                          ? f.name + "?isDir=false&fileName=" + f.name
                          : relativeDirPath +
                            "/" +
                            f.name +
                            "?isDir=false&fileName=" +
                            f.name
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
      {!isInDir && <Editor filePath={fullDirPath} fileName={fileName}></Editor>}
    </Fragment>
  );
}

export default Dir;
