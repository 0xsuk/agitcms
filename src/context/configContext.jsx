import { Children, createContext } from "react";

export const configContext = createContext();

function ConfigContext({ children }) {
  return <configContext.Provider>{Children}</configContext.Provider>;
}

export default ConfigContext;
