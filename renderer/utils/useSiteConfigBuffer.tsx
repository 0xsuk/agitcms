import { configContext } from "@/context/ConfigContext";
import {
  removeFrontmatterConfig,
  reorderFrontmatterConfig,
  updateFrontmatterConfig,
} from "@/utils/frontmatterInterface";
import { IFrontmatterConfig, ISiteConfig } from "@shared/types/config";
import { frontmatterLanguageOptions } from "@shared/utils/constants";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

function useSiteConfigBuffer(initialSiteConfig: ISiteConfig) {
  const [siteConfig, setSiteConfig] = useState(
    JSON.parse(JSON.stringify(initialSiteConfig)) as ISiteConfig
    //siteConfig reference to initialSiteConfig, so changing siteConfig also changes initialSiteConfig, which breaks isDirty
    //{...initialSiteConfig} does not copy properties' value
  );
  const siteConfigCopy = JSON.parse(JSON.stringify(siteConfig)) as ISiteConfig; //whenever I operate on siteConfig, I should not modify siteConfig, because even updating to {...siteCofig} does not work, since it is not deep copy, but partly reference copy

  const { updateSiteConfig, deleteSiteConfig } = useContext(configContext);
  const history = useHistory();

  const editMediaPublicPath = (newValue: string) => {
    siteConfigCopy.media.publicPath = newValue;
    setSiteConfig(siteConfigCopy);
  };

  const editMediaStaticPath = async (folderPath: string) => {
    siteConfigCopy.media.staticPath = folderPath;
    setSiteConfig(siteConfigCopy);
  };

  const editFrontmatterLanguage = (newValue: string) => {
    setSiteConfig((prev) => ({
      ...prev,
      frontmatterLanguage:
        newValue as typeof frontmatterLanguageOptions[number],
    }));
  };
  const editFrontmatterDelimiter = (newValue: string) => {
    setSiteConfig((prev) => ({
      ...prev,
      frontmatterDelimiter: newValue,
    }));
  };

  const saveFrontmatter = (
    newChildMetainfo: IFrontmatterConfig,
    parentKeys: string[]
  ) => {
    siteConfigCopy.frontmatter = updateFrontmatterConfig(
      siteConfigCopy.frontmatter,
      parentKeys,
      newChildMetainfo
    );
    setSiteConfig(siteConfigCopy);
  };

  const removeFrontmatter = (key: string, parentKeys: string[]) => {
    siteConfigCopy.frontmatter = removeFrontmatterConfig(
      siteConfigCopy.frontmatter,
      parentKeys,
      key
    );
    setSiteConfig(siteConfigCopy);
  };

  const reorderFrontmatter = (result: any, parentKeys: string[]) => {
    siteConfigCopy.frontmatter = reorderFrontmatterConfig(
      siteConfigCopy.frontmatter,
      result,
      parentKeys
    );
    setSiteConfig(siteConfigCopy);
  };

  const removePinnedDir = (path: string, isDir: boolean) => {
    const pinnedDirs = siteConfigCopy.pinnedDirs.filter(
      (df) => df.path !== path || df.isDir !== isDir
    );

    siteConfigCopy.pinnedDirs = pinnedDirs;
    setSiteConfig(siteConfigCopy);
  };
  const reorderPinnedDirs = (result: any) => {
    const newPinnedDirs = Array.from(siteConfigCopy.pinnedDirs);
    const [removed] = newPinnedDirs.splice(result.source.index, 1);
    newPinnedDirs.splice(result.destination.index, 0, removed);
    siteConfigCopy.pinnedDirs = newPinnedDirs; //important (prevent lag)
    setSiteConfig(siteConfigCopy);
  };

  const saveSiteConfig = () => {
    updateSiteConfig(siteConfigCopy);
    console.log("Saved!");
    // navigate(-1);
    return true;
  };

  const removeSiteConfig = (key: string) => {
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
    editFrontmatterLanguage,
    editFrontmatterDelimiter,
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
