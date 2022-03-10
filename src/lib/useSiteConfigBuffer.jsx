import { useState, useContext } from "react";
import { configContext } from "../context/ConfigContext";

function useSiteConfigBuffer(initialSiteConfig) {
  const [siteConfig, setSiteConfig] = useState(initialSiteConfig);
  const { updateSiteConfig, deleteSiteConfig } = useContext(configContext);

  const updateName = async (newName) => {
    siteConfig.name = newName;
    setSiteConfig({ ...siteConfig });
  };

  const updatePath = async () => {
    const { folderPath, err, canceled } =
      await window.electronAPI.getFolderPath();
    if (err) {
      alert(err);
      return;
    }
    if (!err && !canceled) {
      siteConfig.path = folderPath;
      setSiteConfig({ ...siteConfig });
    }
  };

  const updateCommandKey = (newKey, i) => {
    siteConfig.commands[i].key = newKey;
    setSiteConfig({ ...siteConfig });
  };
  const updateCommand = (newCommand, i) => {
    siteConfig.commands[i].command = newCommand;
    setSiteConfig({ ...siteConfig });
  };

  const updateFrontmatterKey = (newKey, i) => {
    siteConfig.frontmatter[i].key = newKey;
    setSiteConfig({ ...siteConfig });
  };
  const updateFrontmatterType = (newType, i) => {
    siteConfig.frontmatter[i].type = newType;
    setSiteConfig({ ...siteConfig });
  };
  const updateFrontmatterDefault = (newDefault, i) => {
    siteConfig.frontmatter[i].default = newDefault;
    setSiteConfig({ ...siteConfig });
  };

  const saveSiteConfig = () => {
    if (siteConfig.name === "") {
      alert("name cannot be empty");
      return;
    }
    if (siteConfig.path === "") {
      alert("path cannot be empty");
      return;
    }

    updateSiteConfig(siteConfig);
  };

  const cancelSiteConfig = () => {
    setSiteConfig(initialSiteConfig);
  };

  return [
    siteConfig,
    {
      updateName,
      updateCommand,
      updateCommandKey,
      updateFrontmatterDefault,
      updateFrontmatterKey,
      updateFrontmatterType,
      updatePath,
      deleteSiteConfig,
      cancelSiteConfig,
      saveSiteConfig,
    },
  ];
}

export default useSiteConfigBuffer;
