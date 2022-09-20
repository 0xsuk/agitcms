import { configContext } from "@/context/ConfigContext";
import useSiteConfig from "@/utils/useSiteConfig";
import { Button } from "@mui/material";
import { ISiteConfig } from "@shared/types/config";
import { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import FolderNavigator from "./FolderNavigator";
function BottomBar() {
  const { updateSiteConfig } = useContext(configContext);
  const siteConfig = useSiteConfig() as ISiteConfig;
  const history = useHistory();
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);
  const cwdf = searchparams.get("path") as string;
  const isInRoot = cwdf === siteConfig.path;
  const isInDir = searchparams.get("isDir") === "true" || isInRoot;
  const isDfPinned = !siteConfig.pinnedDirs.every((df) => {
    if (df.path === cwdf) {
      return false;
    }
    return true;
  });

  const addPinnedDirs = (path: string, isDir: boolean) => {
    const name = path.split("/").reverse()[0];
    updateSiteConfig({
      ...siteConfig,
      pinnedDirs: [...siteConfig.pinnedDirs, { name, path, isDir }],
    });
  };

  const removePinnedDir = (path: string, isDir: boolean) => {
    const pinnedDirs = siteConfig.pinnedDirs.filter(
      (df) => df.path !== path || df.isDir !== isDir
    );
    updateSiteConfig({
      ...siteConfig,
      pinnedDirs,
    });
  };
  return (
    <div id="bottom-bar">
      {isDfPinned ? (
        <Button
          onClick={() => removePinnedDir(cwdf, isInDir)}
          sx={{ padding: "0 5px", lineHeight: "unset", minWidth: "0" }}
        >
          Unpin
        </Button>
      ) : (
        <Button
          onClick={() => addPinnedDirs(cwdf, isInDir)}
          sx={{ padding: "0 5px", lineHeight: "unset", minWidth: "0" }}
        >
          Pin
        </Button>
      )}
      <FolderNavigator
        cwdf={cwdf}
        root={siteConfig.path}
        onClickNewPath={(newPath: string) => {
          if (newPath === cwdf) return;
          history.push(
            "/site/explorer/" +
              siteConfig.key +
              "?path=" +
              newPath +
              "&isDir=true"
          );
        }}
      />
    </div>
  );
}

export default BottomBar;
