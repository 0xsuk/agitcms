import { useState, createContext } from "react";

export const stateContext = createContext();

const initialState = {
  media: {
    port: undefined,
  },
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

  return (
    <stateContext.Provider
      value={{
        state,
        setMediaPort,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export default StateContext;
