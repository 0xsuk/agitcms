import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { configContext } from "context/ConfigContext";
import {
  removeFrontmatterConfig,
  reorderFrontmatterConfig,
  updateFrontmatterConfig,
} from "utils/frontmatterInterface";

function useSiteConfigBuffer(initialSiteConfig) {
  const [siteConfig, setSiteConfig] = useState(
    JSON.parse(JSON.stringify(initialSiteConfig))
    //siteConfig reference to initialSiteConfig, so changing siteConfig also changes initialSiteConfig, which breaks isDirty
    //{...initialSiteConfig} does not copy properties' value
  );
  const { updateSiteConfig, deleteSiteConfig } = useContext(configContext);
  const history = useHistory();

  const editMediaPublicPath = (newValue) => {
    siteConfig.media.publicPath = newValue;
    setSiteConfig({ ...siteConfig });
  };

  const editMediaStaticPath = async () => {
    const { folderPath, err, canceled } =
      await window.electronAPI.getFolderPath(siteConfig.path);
    if (err) {
      alert(err);
      return;
    }
    if (!err && !canceled) {
      siteConfig.media.staticPath = folderPath;
      setSiteConfig({ ...siteConfig });
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
    siteConfig.frontmatter[i].name = newName;
    setSiteConfig({ ...siteConfig });
  };
  const editFrontmatterType = (newType, i) => {
    siteConfig.frontmatter[i].type = newType;
    setSiteConfig({ ...siteConfig });
  };
  const editFrontmatterDefault = (newDefault, i) => {
    siteConfig.frontmatter[i].default = newDefault;
    setSiteConfig({ ...siteConfig });
  };
  //TODO: const editFrontmatterOption = () => {}
  const editFrontmatter = (id, key, type, Default, option) => {
    for (let i = 0; i < siteConfig.frontmatter.length; i++) {
      if (siteConfig.frontmatter[i].id === id) {
        siteConfig.frontmatter[i] = {
          id,
          key,
          type,
          default: Default,
          option,
        };
        setSiteConfig({ ...siteConfig });
        return;
      }
    }
  };

  const saveFrontmatter = (newChildMetainfo, parentKeys) => {
    siteConfig.frontmatter = updateFrontmatterConfig(
      siteConfig.frontmatter,
      parentKeys,
      newChildMetainfo
    );
    setSiteConfig({ ...siteConfig });
  };

  const removeFrontmatter = (key, parentKeys) => {
    siteConfig.frontmatter = removeFrontmatterConfig(
      siteConfig.frontmatter,
      parentKeys,
      key
    );
    setSiteConfig({ ...siteConfig });
  };

  const reorderFrontmatter = (result, parentKeys) => {
    siteConfig.frontmatter = reorderFrontmatterConfig(
      siteConfig.frontmatter,
      result,
      parentKeys
    );
    setSiteConfig({ ...siteConfig });
  };

  const removePinnedDir = (path, isDir) => {
    const pinnedDirs = siteConfig.pinnedDirs.filter(
      (df) => df.path !== path || df.isDir !== isDir
    );

    siteConfig.pinnedDirs = pinnedDirs;
    setSiteConfig({ ...siteConfig });
  };
  const reorderPinnedDirs = (result) => {
    const newPinnedDirs = Array.from(siteConfig.pinnedDirs);
    const [removed] = newPinnedDirs.splice(result.source.index, 1);
    newPinnedDirs.splice(result.destination.index, 0, removed);
    siteConfig.pinnedDirs = newPinnedDirs; //important (prevent lag)
    setSiteConfig({ ...siteConfig });
  };

  const saveSiteConfig = () => {
    updateSiteConfig({ ...siteConfig });
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
