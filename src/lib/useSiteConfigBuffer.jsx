import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { configContext } from "../context/ConfigContext";

function useSiteConfigBuffer(initialSiteConfig) {
  const [siteConfig, setSiteConfig] = useState(initialSiteConfig);
  const { updateSiteConfig, deleteSiteConfig } = useContext(configContext);
  const history = useHistory();
  //siteConfig !== siteConfigCopy //true
  const siteConfigCopy = JSON.parse(JSON.stringify(siteConfig));

  const editName = async (newName) => {
    setSiteConfig({ ...siteConfig, name: newName });
  };

  const editPath = async () => {
    const { folderPath, err, canceled } =
      await window.electronAPI.getFolderPath();
    if (err) {
      alert(err);
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
  const addNewCommand = () => {
    siteConfigCopy.commands.push({ key: Date.now(), name: "", command: "" });
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
    if (!isSiteConfigValid()) {
      return;
    }
    updateSiteConfig(siteConfig);
    alert("Saved!");
    // navigate(-1);
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

  const isSiteConfigValid = () => {
    if (siteConfig.name === "") {
      alert("name cannot be empty");
      return false;
    }
    if (siteConfig.path === "") {
      alert("path cannot be empty");
      return false;
    }

    const isCommandsValid = siteConfig.commands.every((command, i) => {
      if (command.key === "") {
        alert(i, "th command's key is empty");
        return false;
      }
      if (command.command === "") {
        alert(i, "th command's command is empty");
        return false;
      }
      return true;
    });
    if (!isCommandsValid) return false;

    const isFrontmatterValid = siteConfig.frontmatter.every(
      (singlematter, i) => {
        if (singlematter.key === "") {
          alert(i + 1 + "th frontmatter's key is empty");
          return false;
        }
        if (singlematter.type === "") {
          alert(i + 1 + "th frontmatter's type is empty");
          return false;
        }
        return true;
      }
    );

    if (!isFrontmatterValid) return false;

    return true;
  };

  return [
    siteConfig,
    {
      editName,
      editCommand,
      editCommandName,
      addNewCommand,
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
