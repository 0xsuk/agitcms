import { Fragment, useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import "./App.scss";
import EditorWrapper from "./components/EditorWrapper";
import Explorer from "./components/Explorer";
import Home from "./components/Home";
import Settings from "./components/Settings";
import SiteSettigs from "./components/SiteSettings";
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

  useEffect(() => {
    if (config === undefined) return;
    window.electronAPI.webFrames.setZoomFactor(config.zoom);
  }, [config]);

  if (config === undefined) {
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
          <SiteSettigs />
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
