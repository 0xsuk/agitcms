import { useState, createContext } from "react";
import type { IConfig, ISiteConfig } from "@shared/types/config";
import { socketClient } from "@/utils/socketClient";

export interface IConfigContext {
  config: IConfig;
  readConfig: () => Promise<void>;
  updateConfig: (newConfig: IConfig) => Promise<void>;
  updateSiteConfig: (newSiteConfig: ISiteConfig) => boolean;
  deleteSiteConfig: (key: string) => void;
}

export const configContext = createContext<IConfigContext>(
  {} as IConfigContext
);

interface Props {
  initialConfig: IConfig;
  children: any;
}

const ConfigContext = ({ initialConfig, children }: Props) => {
  const [config, setConfig] = useState<IConfig>(initialConfig);

  const readConfig = async () => {
    const { config: newConfig, err } = await socketClient.readConfig();
    if (err !== null) {
      err.warn();
      return;
    }
    setConfig({ ...newConfig });
  };

  const updateConfig = async (newConfig: IConfig) => {
    const err = await socketClient.updateConfig(newConfig);
    if (err !== null) {
      err.warn();
      return;
    }
    setConfig({ ...newConfig });
  };

  const updateSiteConfig = (newSiteConfig: ISiteConfig) => {
    const isSiteExist = !config?.sites.every((site, i) => {
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
  };

  const deleteSiteConfig = (key: string) => {
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
