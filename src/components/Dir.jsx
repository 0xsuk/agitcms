import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Editor from "./Editor";
import useSiteConfig from "../lib/useSiteConfig";
import { Button } from "@mui/material";
import { configContext } from "../context/ConfigContext";

function Dir() {
  const [filesAndFolders, setFilesAndFolders] = useState([]);
  const { siteConfig } = useSiteConfig();
  const { updateSiteConfig } = useContext(configContext);
  const [params] = useSearchParams();

  //current working dir or filek
  const cwdf = params.get("path");
  const dfName = params.get("name");
  const isInRoot = cwdf === siteConfig.path;
  const isInDir = params.get("isDir") === "true" || isInRoot;

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

  return (
    <Fragment>
      <p>
        {cwdf}{" "}
        <Button onClick={() => addPinnedDirs(dfName, cwdf, isInDir)}>
          Pin
        </Button>
      </p>

      {isInDir &&
        filesAndFolders.map((df) => (
          <Fragment>
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
          </Fragment>
        ))}
      {!isInDir && <Editor filePath={cwdf}></Editor>}
    </Fragment>
  );
}

export default Dir;
