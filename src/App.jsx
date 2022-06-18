import { Fragment, useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import "./App.scss";
import EditorWrapper from "./components/EditorWrapper";
import Explorer from "./components/Explorer";
import Home from "./components/Home";
import Settings from "./components/settings/Settings";
import Site from "./components/settings/site/Site";
import SideBar from "./components/SideBar";
import Terminal from "./components/Terminal";
import BottomBar from "./components/BottomBar";
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
      <Route path="/">
        {/* component={} renders Wrapper every single time */}
        <Wrapper />
      </Route>
      {/*<Link to={"/test"}>test</Link> */}
    </>
  );
}

function Wrapper() {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return (
    // list of workspace
    <div
      style={{
        display: "flex",
        height: isMac ? "calc(100vh - 22px)" : "calc(100vh - 30px)",
      }}
    >
      <SideBar />
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
        <Route path="/site/settings/:siteKey">
          <Site />
        </Route>
        <Route path="/site/explorer/:siteKey">
          <Explorer />
          <BottomBar />
        </Route>
        <Route path="/site/editor/:siteKey">
          <EditorWrapper />
          <BottomBar />
        </Route>
        <Route path="/site">
          <Terminal />
        </Route>
      </div>
    </div>
  );
}

export default App;
