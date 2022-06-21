import { Button } from "@mui/material";
import { useContext } from "react";
import { configContext } from "../context/ConfigContext";
import useSiteConfig from "../lib/useSiteConfig";
import { useLocation } from "react-router-dom";
function BottomBar() {
  const { updateSiteConfig } = useContext(configContext);
  const siteConfig = useSiteConfig();
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);
  const cwdf = searchparams.get("path");
  const dfName = searchparams.get("name");
  const isInRoot = cwdf === siteConfig.path;
  const isInDir = searchparams.get("isDir") === "true" || isInRoot;
  const isDfPinned = !siteConfig.pinnedDirs.every((df) => {
    if (df.path === cwdf) {
      return false;
    }
    return true;
  });
  let cwdfForDisplay = cwdf;

  if (window.navigator.platform === "Win32")
    cwdfForDisplay = cwdf.replaceAll("/", "\\");

  //reverse cwdfForDisplay
  cwdfForDisplay = cwdfForDisplay.split("").reverse().join("");

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
    <div id="bottom-bar">
      {isDfPinned ? (
        <Button
          size="small"
          onClick={() => removePinnedDir(cwdf, isInDir)}
          sx={{ padding: "0 5px", lineHeight: "unset", minWidth: "0" }}
        >
          Unpin
        </Button>
      ) : (
        <Button
          size="small"
          onClick={() => addPinnedDirs(dfName, cwdf, isInDir)}
          sx={{ padding: "0 5px", lineHeight: "unset", minWidth: "0" }}
        >
          Pin
        </Button>
      )}
      <span>{cwdfForDisplay}</span>
    </div>
  );
}

export default BottomBar;
