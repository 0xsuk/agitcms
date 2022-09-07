import { createContext, useState } from "react";
import { ToolbarItem } from "../lib/plugin";

export const siteContext = createContext();

const initialState = {
  media: {
    port: undefined,
  },
  plugins: [],
};

const SiteContext = ({ children }) => {
  const [state, setState] = useState(initialState);

  const initState = async (siteConfig) => {
    {
      const res = await window.electronAPI.loadPlugins();
      if (res.err) {
        alert(res.err);
        return;
      }
      window.ToolbarItem = ToolbarItem;
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

      setPlugins(activePlugins);
    }
  };
  const updateState = (newState) => {
    setState({ ...newState });
  };

  const setMediaPort = (port) => {
    console.log("setting media port to", port);
    state.media.port = port;
    updateState(state);
  };

  const setPlugins = (plugins) => {
    state.plugins = plugins;
    updateState(state);
  };

  return (
    <siteContext.Provider
      value={{
        state,
        initState,
        setMediaPort,
        setPlugins,
      }}
    >
      {children}
    </siteContext.Provider>
  );
};

export default SiteContext;
