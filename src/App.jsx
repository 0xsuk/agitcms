import { Fragment, useContext, useEffect, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.scss";
import Explorer from "./components/Explorer";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Site from "./components/settings/site/Site";
import Shell from "./components/Shell";
import SideBar from "./components/SideBar";
import Test from "./components/Test";
import { configContext } from "./context/ConfigContext";

function App() {
  const { config, readConfig } = useContext(configContext);
  const [lines, setLines] = useState([]);
  useEffect(() => {
    readConfig();
    window.electronAPI.onShellProcessLine((e, data) => {
      setLines((prev) => [...prev, data.line]);
    });
  }, []); //eslint-disable-line

  if (config.sites === undefined) {
    console.log("reading config", config);
    return <Fragment />;
  }
  console.log("configuration:", config);

  return (
    <Routes>
      <Route path="/" element={<Wrapper />}>
        <Route path="test" element={<Test />}></Route>
        <Route path="" element={<Home />}></Route>
        <Route path="settings">
          <Route path="" element={<Settings />}></Route>
          <Route path=":siteKey" element={<Site />}></Route>
        </Route>
        <Route path="shell">
          <Route
            path=":siteKey"
            element={<Shell lines={lines} setLines={setLines} />}
          ></Route>
        </Route>
        <Route path="edit">
          <Route path=":siteKey/*" element={<Explorer />}></Route>
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
