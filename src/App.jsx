import { Fragment, useContext, useEffect } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.scss";
import Dir from "./components/Dir";
import Home from "./components/Home";
import Settings from "./components/Settings";
import SideBar from "./components/SideBar";
import Site from "./components/settings/site/Site";
import { configContext } from "./context/ConfigContext";

function App() {
  const { config, loadConfig } = useContext(configContext);
  useEffect(() => loadConfig(), [loadConfig]);

  if (config.sites === undefined) {
    console.log("reading config", config);
    return <Fragment />;
  }

  return (
    <Routes>
      <Route path="/" element={<Wrapper />}>
        <Route path="" element={<Home />}></Route>
        <Route path="settings" element={<Settings />}>
          <Route path=":siteKey" element={<Site />}>
            <Route path="frontmatter"></Route>
          </Route>
        </Route>
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
