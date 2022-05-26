import { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Route } from "react-router-dom";
import "./App.scss";
import Explorer from "./components/Explorer";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Site from "./components/settings/site/Site";
import SideBar from "./components/SideBar";
import Terminal from "./components/Terminal";
import { configContext } from "./context/ConfigContext";
import Test from "./Test";

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
      <Link to={"/test"}>test</Link>
      <Route path="/">
        {/* component={} renders Wrapper every single time */}
        <Wrapper />
      </Route>
    </>
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
        <Route path="/test">
          <Test />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
        <Route path="/settings/:siteKey">
          <Site />
        </Route>
        <Route path="/edit/:siteKey">
          <Explorer />
        </Route>
        <Terminal />
      </div>
    </div>
  );
}

export default App;
