import { Fragment, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Editor from "./Editor";
import { useSiteConfig } from "../lib/config";

function Dir() {
  const [filesAndFolders, setFilesAndFolders] = useState([]);
  const [, siteConfig] = useSiteConfig();
  const [params] = useSearchParams();

  //current working dir or filek
  const cwdf = params.get("path");
  const isInRoot = cwdf === siteConfig.path;
  const isInDir = params.get("isDir") === "true" || isInRoot;
  const fileName = params.get("fileName"); //optional //already decoded by get method

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

  return (
    <Fragment>
      <p>{cwdf}</p>

      {isInDir &&
        filesAndFolders.map((df) => (
          <Fragment>
            {df.isDir ? (
              <div>
                <Link to={"?path=" + cwdf + "/" + df.name + "&isDir=true"}>
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
                        "&isDir=false&fileName=" +
                        df.name
                      }
                    >
                      <p>{df.name}</p>
                    </Link>
                  </div>
                )}
              </>
            )}
          </Fragment>
        ))}
      {!isInDir && <Editor filePath={cwdf} fileName={fileName}></Editor>}
    </Fragment>
  );
}

export default Dir;
