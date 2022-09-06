import { useState, createContext } from "react";
import { createTool } from "../lib/plugin";

export const stateContext = createContext();

const initialState = {
  media: {
    port: undefined,
  },
  plugins: [],
};

const StateContext = ({ children }) => {
  const [state, setState] = useState(initialState);

  const initState = async () => {
    const res = await window.electronAPI.loadPlugins();
    if (res.err) {
      alert(res.err);
      return;
    }
    window.createTool = createTool;
    let plugins = [];
    res.plugins.forEach((plugin) => {
      plugins.push(eval(plugin.raw));
    });

    setPlugins(plugins);
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
    <stateContext.Provider
      value={{
        state,
        initState,
        setMediaPort,
        setPlugins,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export default StateContext;
