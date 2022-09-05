import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { configContext } from "../context/ConfigContext";
import {
  removeFrontmatterConfig,
  reorderFrontmatterConfig,
  updateFrontmatterConfig,
} from "../lib/frontmatterInterface";

//TODO do not use siteConfigCopy
function useSiteConfigBuffer(initialSiteConfig) {
  const [siteConfig, setSiteConfig] = useState(
    JSON.parse(JSON.stringify(initialSiteConfig)) //since siteConfig reference to initialSiteConfig, modifying siteConfig changes the initialSiteConfig(which is useSiteConfig())
  );
  const { updateSiteConfig, deleteSiteConfig } = useContext(configContext);
  const history = useHistory();
  //siteConfig !== siteConfigCopy //true
  const siteConfigCopy = JSON.parse(JSON.stringify(siteConfig));

  const editMediaPublicPath = (newValue) => {
    siteConfigCopy.media.publicPath = newValue;
    setSiteConfig(siteConfigCopy);
  };

  const editMediaStaticPath = async () => {
    const { folderPath, err, canceled } =
      await window.electronAPI.getFolderPath(siteConfigCopy.path);
    if (err) {
      alert(err);
      return;
    }
    if (!err && !canceled) {
      siteConfigCopy.media.staticPath = folderPath;
      setSiteConfig(siteConfigCopy);
    }
  };

  const editShowFrontmatter = (newValue) => {
    setSiteConfig((prev) => ({
      ...prev,
      showFrontmatter: newValue,
    }));
  };

  const editFrontmatterLanguage = (newValue) => {
    setSiteConfig((prev) => ({
      ...prev,
      frontmatterLanguage: newValue,
    }));
  };
  const editFrontmatterDelimiter = (newValue) => {
    setSiteConfig((prev) => ({
      ...prev,
      frontmatterDelimiter: newValue,
    }));
  };

  const editFrontmatterName = (newName, i) => {
    siteConfigCopy.frontmatter[i].name = newName;
    setSiteConfig(siteConfigCopy);
  };
  const editFrontmatterType = (newType, i) => {
    siteConfigCopy.frontmatter[i].type = newType;
    setSiteConfig(siteConfigCopy);
  };
  const editFrontmatterDefault = (newDefault, i) => {
    siteConfigCopy.frontmatter[i].default = newDefault;
    setSiteConfig(siteConfigCopy);
  };
  //TODO: const editFrontmatterOption = () => {}
  const editFrontmatter = (id, key, type, Default, option) => {
    for (let i = 0; i < siteConfigCopy.frontmatter.length; i++) {
      if (siteConfigCopy.frontmatter[i].id === id) {
        siteConfigCopy.frontmatter[i] = {
          id,
          key,
          type,
          default: Default,
          option,
        };
        setSiteConfig(siteConfigCopy);
        return;
      }
    }
  };

  const saveFrontmatter = (newChildMetainfo, parentKeys) => {
    siteConfigCopy.frontmatter = updateFrontmatterConfig(
      siteConfigCopy.frontmatter,
      parentKeys,
      newChildMetainfo
    );
    setSiteConfig(siteConfigCopy);
  };

  const removeFrontmatter = (key, parentKeys) => {
    siteConfigCopy.frontmatter = removeFrontmatterConfig(
      siteConfigCopy.frontmatter,
      parentKeys,
      key
    );
    setSiteConfig(siteConfigCopy);
  };

  const reorderFrontmatter = (result, parentKeys) => {
    siteConfigCopy.frontmatter = reorderFrontmatterConfig(
      siteConfigCopy.frontmatter,
      result,
      parentKeys
    );
    setSiteConfig(siteConfigCopy);
  };

  const removePinnedDir = (path, isDir) => {
    const pinnedDirs = siteConfigCopy.pinnedDirs.filter(
      (df) => df.path !== path || df.isDir !== isDir
    );

    siteConfigCopy.pinnedDirs = pinnedDirs;
    setSiteConfig(siteConfigCopy);
  };
  const reorderPinnedDirs = (result) => {
    const newPinnedDirs = Array.from(siteConfigCopy.pinnedDirs);
    const [removed] = newPinnedDirs.splice(result.source.index, 1);
    newPinnedDirs.splice(result.destination.index, 0, removed);
    siteConfigCopy.pinnedDirs = newPinnedDirs; //important (prevent lag)
    setSiteConfig(siteConfigCopy);
  };

  const saveSiteConfig = () => {
    updateSiteConfig(siteConfig);
    console.log("Saved!");
    // navigate(-1);
    return true;
  };

  const removeSiteConfig = (key) => {
    if (
      !window.confirm(
        "Delete this site from Agit CMS? Local site folder will not be lost."
      )
    )
      return;
    deleteSiteConfig(key);
    history.push("/");
  };

  return {
    siteConfig,
    editMediaPublicPath,
    editMediaStaticPath,
    editShowFrontmatter,
    editFrontmatterLanguage,
    editFrontmatterDelimiter,
    editFrontmatterDefault,
    editFrontmatterName,
    editFrontmatterType,
    editFrontmatter,
    saveFrontmatter,
    removeFrontmatter,
    reorderFrontmatter,
    removePinnedDir,
    reorderPinnedDirs,
    removeSiteConfig,
    saveSiteConfig,
  };
}

export default useSiteConfigBuffer;
