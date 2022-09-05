import { useState, createContext } from "react";

export const stateContext = createContext();

const initialState = {
  media: {
    port: undefined,
  },
  plugins: [],
};

const StateContext = ({ children }) => {
  const [state, setState] = useState(initialState);

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
        setMediaPort,
        setPlugins,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export default StateContext;
