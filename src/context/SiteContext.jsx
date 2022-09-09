import { createContext, useState } from "react";
import { ToolbarItem, TransactionFilter } from "../lib/plugin";

export const siteContext = createContext();

const initialState = {
  media: {
    port: undefined,
  },
  plugins: [],
  isInitialized: false,
};

const SiteContext = ({ children }) => {
  const [state, setState] = useState(initialState);

  const initState = async (siteConfig) => {
    async function initPlugins() {
      const res = await window.electronAPI.loadPlugins();
      if (res.err) {
        alert(res.err);
        return;
      }
      window.ToolbarItem = ToolbarItem;
      window.TransactionFilter = TransactionFilter;
      const plugins = [];
      res.plugins.forEach((plugin) => {
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
  const updateState = (newState) => {
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
