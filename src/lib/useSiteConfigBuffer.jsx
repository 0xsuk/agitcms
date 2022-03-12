import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { configContext } from "../context/ConfigContext";

function useSiteConfigBuffer(initialSiteConfig) {
  const [siteConfig, setSiteConfig] = useState(initialSiteConfig);
  const { updateSiteConfig, deleteSiteConfig } = useContext(configContext);
  const navigate = useNavigate();

  const editName = async (newName) => {
    siteConfig.name = newName;
    setSiteConfig({ ...siteConfig });
  };

  const editPath = async () => {
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

  const editCommandKey = (newKey, i) => {
    siteConfig.commands[i].key = newKey;
    setSiteConfig({ ...siteConfig });
  };
  const editCommand = (newCommand, i) => {
    siteConfig.commands[i].command = newCommand;
    setSiteConfig({ ...siteConfig });
  };

  const editFrontmatterKey = (newKey, i) => {
    siteConfig.frontmatter[i].key = newKey;
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
      editName,
      editCommand,
      editCommandKey,
      editFrontmatterDefault,
      editFrontmatterKey,
      editFrontmatterType,
      editPath,
      deleteSiteConfig,
      cancelSiteConfig,
      saveSiteConfig,
    },
  ];
}

export default useSiteConfigBuffer;
