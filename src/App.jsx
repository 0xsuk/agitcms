import { Fragment, useContext, useEffect, useState } from "react";
import { Route } from "react-router-dom";
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

  useEffect(() => {
    readConfig();
  }, []);

  if (config.sites === undefined) {
    console.log("reading config", config);
    return <Fragment />;
  }

  return (
    <>
      <Route path="/">
        {/* component={} renders Wrapper every single time */}
        <Wrapper />
      </Route>
    </>
  );
}

function Wrapper() {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    window.electronAPI.onShellProcessLine((_, data) => {
      setLines((prev) => [...prev, data.line]);
    });
  }, []); //eslint-disable-line

  return (
    // list of workspace
    <div className="flex">
      <div id="side">
        <SideBar />
      </div>
      <div id="main">
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/test">
          <Test />
        </Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
        <Route path="/settings/:siteKey">
          <Site />
        </Route>
        <Route path="/shell/:siteKey">
          <Shell lines={lines} setLines={setLines} />
        </Route>
        <Route path="/edit/:siteKey">
          <Explorer />
        </Route>
      </div>
    </div>
  );
}

export const FrontmatterTypes = [
  { name: "String", key: "String" },
  { name: "Array of String", key: "Array.String" },
  { name: "Date", key: "Date" },
  { name: "Bool", key: "Bool" },
];

export default App;
