import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { configContext } from "../context/ConfigContext";

function useSiteConfigBuffer(initialSiteConfig) {
  const [siteConfig, setSiteConfig] = useState(initialSiteConfig);
  const { updateSiteConfig, deleteSiteConfig } = useContext(configContext);
  const navigate = useNavigate();

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
    if (isSiteConfigValid()) updateSiteConfig(siteConfig);
  };

  const cancelSiteConfig = () => {
    setSiteConfig(initialSiteConfig);
    navigate(-1);
  };

  const isSiteConfigValid = () => {
    if (siteConfig.name === "") {
      alert("name cannot be empty");
      return false;
    }
    if (siteConfig.path === "") {
      alert("path cannot be empty");
      return false;
    }

    return true;
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
