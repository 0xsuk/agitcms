import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { configContext } from "../context/ConfigContext";

function useSiteConfigBuffer(initialSiteConfig) {
  const [siteConfig, setSiteConfig] = useState(initialSiteConfig);
  const { updateSiteConfig, deleteSiteConfig } = useContext(configContext);
  const history = useHistory();
  let unblock;
  //siteConfig !== siteConfigCopy //true
  const siteConfigCopy = JSON.parse(JSON.stringify(siteConfig));

  const editName = async (newName) => {
    setSiteConfig({ ...siteConfig, name: newName });
  };

  const editPath = async () => {
    const { folderPath, err, canceled } =
      await window.electronAPI.getFolderPath();
    if (err) {
      console.warn(err);
      return;
    }
    if (!err && !canceled) {
      setSiteConfig({ ...siteConfig, path: folderPath });
    }
  };

  const editCommandName = (newName, i) => {
    siteConfigCopy.commands[i].name = newName;
    setSiteConfig(siteConfigCopy);
  };
  const editCommand = (newCommand, i) => {
    siteConfigCopy.commands[i].command = newCommand;
    setSiteConfig(siteConfigCopy);
  };
  const addCommand = (key, name, command) => {
    siteConfigCopy.commands.push({ key, name, command });
    setSiteConfig(siteConfigCopy);
  };
  const removeCommand = (i) => {
    siteConfigCopy.commands.splice(i, 1);
    setSiteConfig(siteConfigCopy);
  };

  const editFrontmatterKey = (newKey, i) => {
    siteConfigCopy.frontmatter[i].key = newKey;
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
  //TODO: const editFrontmatterOption
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

  const addFrontmatter = (id, key, type, Default, option) => {
    siteConfigCopy.frontmatter.push({
      id,
      key,
      type,
      default: Default,
      option,
    });
    setSiteConfig(siteConfigCopy);
  };

  const removeFrontmatter = (id) => {
    siteConfigCopy.frontmatter = siteConfigCopy.frontmatter.filter(
      (matter) => matter.id !== id
    );
    setSiteConfig(siteConfigCopy);
  };

  const reorderFrontmatter = (result) => {
    const list = Array.from(siteConfigCopy.frontmatter);
    const [removed] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, removed);

    siteConfigCopy.frontmatter = list;
    setSiteConfig(siteConfigCopy);
  };

  const saveSiteConfig = () => {
    updateSiteConfig(siteConfig);
    console.log("Saved!");
    // navigate(-1);
    return true;
  };

  const cancelSiteConfig = () => {
    console.log("init:", initialSiteConfig);
    setSiteConfig(initialSiteConfig);
    // navigate(-1);
  };

  const removeSiteConfig = (key) => {
    if (!window.confirm("are you sure?")) return;
    deleteSiteConfig(key);
    history.push("/");
  };

  return [
    siteConfig,
    {
      editName,
      editCommand,
      editCommandName,
      addCommand,
      removeCommand,
      editFrontmatterDefault,
      editFrontmatterKey,
      editFrontmatterType,
      editFrontmatter,
      addFrontmatter,
      removeFrontmatter,
      reorderFrontmatter,
      editPath,
      removeSiteConfig,
      cancelSiteConfig,
      saveSiteConfig,
    },
  ];
}

export default useSiteConfigBuffer;
