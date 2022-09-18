import { ISiteConfig } from "@shared/types/config";
import { createContext, useState } from "react";
import { ToolbarItem, TransactionFilter } from "@/utils/plugin";
import { socketClient } from "@/utils/socketClient";

export interface IState {
  media: {
    port: number | undefined;
  };
  plugins: (ToolbarItem | TransactionFilter)[];
  isInitialized: boolean;
}

interface ISiteContext {
  state: IState;
  initState: (siteConfig: ISiteConfig) => Promise<void>;
}

export const siteContext = createContext<ISiteContext>({} as ISiteContext);

const initialState: IState = {
  media: {
    port: undefined,
  },
  plugins: [],
  isInitialized: false,
};

interface Props {
  children: any;
}

const SiteContext = ({ children }: Props) => {
  const [state, setState] = useState(initialState);

  const initState = async (siteConfig: ISiteConfig) => {
    async function initPlugins() {
      const { pluginInfos, err } = await socketClient.loadPlugins();
      if (err) {
        alert(err);
        return;
      }
      //@ts-ignore because it works
      window.ToolbarItem = ToolbarItem;
      //@ts-ignore because it works
      window.TransactionFilter = TransactionFilter;
      const plugins = pluginInfos.map(
        (pluginInfo) => eval(pluginInfo.raw) as ToolbarItem | TransactionFilter
      );

      const activePlugins = plugins.filter((plugin) => {
        if (plugin.isActive === true) return true;
        if (plugin.isActive === false) return false;
        //then isActive should be function
        return plugin.isActive(siteConfig) !== false;
      });

      state.plugins = activePlugins;
    }
    async function initMediaPort() {
      if (!siteConfig.media.staticPath) return;

      const { port, err } = await socketClient.startMediaServer({
        staticPath: siteConfig.media.staticPath,
        publicPath: siteConfig.media.publicPath || "/",
      });
      if (err) {
        alert(err);
        return;
      }
      state.media.port = port;
    }

    await Promise.all([initPlugins(), initMediaPort()]);

    state.isInitialized = true;

    updateState(state);
  };
  const updateState = (newState: IState) => {
    setState({ ...newState });
  };

  return (
    <siteContext.Provider
      value={{
        state,
        initState,
      }}
    >
      {children}
    </siteContext.Provider>
  );
};

export default SiteContext;
