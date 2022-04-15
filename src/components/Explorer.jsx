import { ArrowDropDown } from "@mui/icons-material";
import { Button, ButtonGroup } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { configContext } from "../context/ConfigContext";
import useSiteConfig from "../lib/useSiteConfig";
import Editor from "./Editor";

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
        <ButtonGroup>
          <Button>Create New</Button>
          <Button>
            <ArrowDropDown />
          </Button>
        </ButtonGroup>
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
