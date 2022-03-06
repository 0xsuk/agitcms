import { useReducer, createContext, useCallback } from "react";
import { UPDATE_CONFIG } from "./types";

export const configContext = createContext();

const configReducer = (config, action) => {
  switch (action.type) {
    case UPDATE_CONFIG:
      const newConfig = action.payload;
      console.log("updating config:", newConfig);
      return { ...newConfig };
    default:
      throw new Error("Unexpected Action Type:", action.type);
  }
};

function ConfigContext({ children }) {
  const [config, dispatchConfig] = useReducer(configReducer, {});

  const loadConfig = useCallback(async () => {
    const res = await window.electronAPI.loadConfig();
    if (res.err) {
      alert(res.err.message);
      return;
    }
    dispatchConfig({ type: UPDATE_CONFIG, payload: res.config });
  }, []);

  const updateConfig = useCallback(async (newConfig) => {
    console.log("config:", newConfig);
    const err = await window.electronAPI.updateConfig(newConfig);
    if (err) {
      alert(err.message);
      return;
    }
    dispatchConfig({ type: UPDATE_CONFIG, payload: newConfig });
  }, []);

  const updateSiteConfig = useCallback(
    (newSiteConfig) => {
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
      }

      updateConfig(config);
      return isSiteExist;
    },
    [config, updateConfig]
  );

  const deleteSiteConfig = useCallback(
    (key) => {
      config.sites.every((site, i) => {
        if (site.key === key) {
          //TODO: do something here
          config.sites.splice(i, 1);
          return false;
        }
        return true;
      });

      updateConfig(config);
    },
    [config, updateConfig]
  );

  return (
    <configContext.Provider
      value={{
        config,
        loadConfig,
        updateSiteConfig,
        deleteSiteConfig,
      }}
    >
      {children}
    </configContext.Provider>
  );
}

export default ConfigContext;
