import { configContext } from "@/context/ConfigContext";
import {
  removeFrontmatterConfig,
  reorderFrontmatterConfig,
  updateFrontmatterConfig,
} from "@/utils/frontmatterInterface";
import { IFrontmatterConfig, ISiteConfig } from "@shared/types/config";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { socketClient } from "./socketClient";

function useSiteConfigBuffer(initialSiteConfig: ISiteConfig) {
  const [siteConfig, setSiteConfig] = useState(
    JSON.parse(JSON.stringify(initialSiteConfig)) as ISiteConfig
    //siteConfig reference to initialSiteConfig, so changing siteConfig also changes initialSiteConfig, which breaks isDirty
    //{...initialSiteConfig} does not copy properties' value
  );
  const { updateSiteConfig, deleteSiteConfig } = useContext(configContext);
  const history = useHistory();

  const editMediaPublicPath = (newValue: string) => {
    siteConfig.media.publicPath = newValue;
    setSiteConfig({ ...siteConfig });
  };

  const editMediaStaticPath = async () => {
    //@ts-ignore
    const { folderPath, canceled } = await socketClient.getFolderPath(
      siteConfig.path
    );
    if (!canceled) {
      siteConfig.media.staticPath = folderPath;
      setSiteConfig({ ...siteConfig });
    }
  };

  const editFrontmatterLanguage = (newValue: string) => {
    setSiteConfig((prev) => ({
      ...prev,
      frontmatterLanguage: newValue,
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
    siteConfig.frontmatter = updateFrontmatterConfig(
      siteConfig.frontmatter,
      parentKeys,
      newChildMetainfo
    );
    setSiteConfig({ ...siteConfig });
  };

  const removeFrontmatter = (key: string, parentKeys: string[]) => {
    siteConfig.frontmatter = removeFrontmatterConfig(
      siteConfig.frontmatter,
      parentKeys,
      key
    );
    setSiteConfig({ ...siteConfig });
  };

  const reorderFrontmatter = (result: any, parentKeys: string[]) => {
    siteConfig.frontmatter = reorderFrontmatterConfig(
      siteConfig.frontmatter,
      result,
      parentKeys
    );
    setSiteConfig({ ...siteConfig });
  };

  const removePinnedDir = (path: string, isDir: boolean) => {
    const pinnedDirs = siteConfig.pinnedDirs.filter(
      (df) => df.path !== path || df.isDir !== isDir
    );

    siteConfig.pinnedDirs = pinnedDirs;
    setSiteConfig({ ...siteConfig });
  };
  const reorderPinnedDirs = (result: any) => {
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
