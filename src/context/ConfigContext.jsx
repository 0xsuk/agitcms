import { useState, createContext } from "react";

export const configContext = createContext();

const ConfigContext = ({ children }) => {
  const [config, setConfig] = useState(undefined);

  const readConfig = async () => {
    const { config: newConfig } = await window.electronAPI.readConfig();
    setConfig({ ...newConfig });
  };

  const updateConfig = async (newConfig) => {
    console.log("config:", newConfig);
    const err = await window.electronAPI.updateConfig(newConfig);
    if (err) {
      alert(err.message);
      return;
    }
    setConfig({ ...newConfig });
  };

  const updateSiteConfig = (newSiteConfig) => {
    const isSiteExist = !config.sites.every((site, i) => {
      if (site.key === newSiteConfig.key) {
        config.sites[i] = newSiteConfig;
        return false;
      }
      return true;
    });

    if (!isSiteExist) {
      if (config.sites === undefined) config.sites = [];
      config.sites.push(newSiteConfig);
      console.log("new site created");
    }

    updateConfig(config);
    return isSiteExist;
  };

  const deleteSiteConfig = (key) => {
    config.sites.every((site, i) => {
      if (site.key === key) {
        config.sites.splice(i, 1);
        return false;
      }
      return true;
    });

    updateConfig(config);
  };

  return (
    <configContext.Provider
      value={{
        config,
        readConfig,
        updateConfig,
        updateSiteConfig,
        deleteSiteConfig,
      }}
    >
      {children}
    </configContext.Provider>
  );
};

export default ConfigContext;
