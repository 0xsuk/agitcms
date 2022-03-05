import "./App.scss";
import { Routes, Route, Outlet } from "react-router-dom";
import { Fragment, useEffect, useContext } from "react";
import { configContext } from "./context/ConfigContext";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Dir from "./components/Dir";
import SideBar from "./components/SideBar";

function App() {
  console.log("App");
  const { config, loadConfig } = useContext(configContext);
  useEffect(() => loadConfig(), []);

  if (config.sites == undefined) {
    console.log("reading config", config);
    return <Fragment />;
  }

  return (
    <Routes>
      <Route path="/" element={<Wrapper />}>
        <Route path="" element={<Home />}></Route>
        <Route path="settings" element={<Settings />}></Route>
        <Route path="edit">
          <Route path=":siteKey/*" element={<Dir />}></Route>
        </Route>
      </Route>
    </Routes>
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
