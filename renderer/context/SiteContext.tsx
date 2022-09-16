import { ISiteConfig } from "@shared/types/config";
import { createContext, useState } from "react";
import { ToolbarItem, TransactionFilter } from "@/utils/plugin";

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
      //@ts-ignore //TODO
      const res = await window.electronAPI.loadPlugins();
      if (res.err) {
        alert(res.err);
        return;
      }
      //@ts-ignore
      window.ToolbarItem = ToolbarItem;
      //@ts-ignore
      window.TransactionFilter = TransactionFilter;
      const plugins: any[] = [];
      res.plugins.forEach((plugin: any) => {
        plugins.push(eval(plugin.raw));
      });

      const activePlugins = plugins.filter((plugin) => {
        if (plugin.isActive === true) return true;
        if (plugin.isActive === false) return false;
        //then isActive should be function
        return plugin.isActive(siteConfig) !== false;
      });

      state.plugins = activePlugins;
    }
    async function initMediaPort() {
      if (siteConfig.media.staticPath === "") return;
      //@ts-ignore TODO
      const port = await window.electronAPI.startMediaServer(
        siteConfig.media.staticPath,
        siteConfig.media.publicPath
      );
      if (port === undefined) {
        alert("Error occured setting media port");
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
