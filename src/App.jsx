import "./App.scss";
import { Routes, Route, Outlet } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Editor from "./components/Editor";
import SideBar from "./components/SideBar";

export const ConfigContext = createContext();

function App() {
  console.log("App");
  const [config, setConfig] = useState({});

  const updateConfig = async (config) => {
    const err = await window.electronAPI.updateConfig(config);
    if (err) {
      alert(err.message);
      return;
    }
    console.log("udpating config:", config);
    setConfig(Object.assign({}, config)); //!important
  };

  useEffect(async () => {
    const { config, err } = await window.electronAPI.loadConfig();
    if (err) {
      alert(err.message);
      return;
    }
    console.log("configuration read", config);
    setConfig(config);
  }, []);

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      <Routes>
        <Route path="/" element={<Wrapper />}>
          <Route path="" element={<Home />}></Route>
          <Route path="settings" element={<Settings />}></Route>
          <Route path="edit">
            <Route path=":siteKey" element={<Editor />}></Route>
          </Route>
        </Route>
      </Routes>
    </ConfigContext.Provider>
  );
}

function Wrapper() {
  return (
    // list of workspace
    <div className="flex">
      <div id="side">
        <SideBar />
      </div>
      <div id="main">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
