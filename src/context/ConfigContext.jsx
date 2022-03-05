import { useReducer, createContext} from "react";
import { UPDATE_CONFIG } from "./types";

export const configContext = createContext();

const configReducer = (config, action) => {
  switch (action.type) {
    case UPDATE_CONFIG:
      const newConfig = action.payload;
      console.log("updating config:", newConfig);
      return { ...newConfig };
  }
};

function ConfigContext({ children }) {
  const [config, dispatchConfig] = useReducer(configReducer, {});

  const loadConfig = async () => {
    const res = await window.electronAPI.loadConfig();
    if (res.err) {
      alert(res.err.message);
      return;
    }
    dispatchConfig({ type: UPDATE_CONFIG, payload: res.config });
  };

  const updateConfig = async (newConfig) => {
    const err = await window.electronAPI.updateConfig(newConfig);
    if (err) {
      alert(err.message);
      return;
    }
    dispatchConfig({ type: UPDATE_CONFIG, payload: newConfig });
  };

  const updateSiteConfig = (newSiteConfig) => {
    const isSiteExist = !config.sites.every((site, i) => {
      if (site.key == newSiteConfig.key) {
        config.sites[i] = newSiteConfig;
        return false;
      }
      return true;
    });

    if (!isSiteExist) {
      if (config.sites == undefined) config.sites = [];
      config.sites.push(newSiteConfig);
    }

    console.log("config:", config);
    dispatchConfig({ type: UPDATE_CONFIG, payload: config });
    return isSiteExist;
  };

  return (
    <configContext.Provider
      value={{ config, loadConfig, updateConfig, updateSiteConfig }}
    >
      {children}
    </configContext.Provider>
  );
}

export default ConfigContext;
