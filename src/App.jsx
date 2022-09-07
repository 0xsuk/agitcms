import { Fragment, useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import "./App.scss";
import BottomBar from "./components/BottomBar";
import EditorWrapper from "./components/EditorWrapper";
import Explorer from "./components/Explorer";
import Home from "./components/Home";
import Settings from "./components/Settings";
import SideBar from "./components/SideBar";
import SiteSettigs from "./components/SiteSettings";
import Terminal from "./components/Terminal";
import { configContext } from "./context/ConfigContext";
import { siteContext } from "./context/SiteContext";
import { isMac } from "./lib/constants";
import { setup } from "./lib/setup";
import useSiteConfig from "./lib/useSiteConfig";
import Test from "./Test";

function App() {
  const { config, readConfig } = useContext(configContext);

  useEffect(() => {
    readConfig();
  }, []);

  useEffect(() => {
    if (config === undefined) return;
    setup(config);
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
        <Route path="/">
          <Terminal />
        </Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
        <Route path="/site">
          <SiteWrapper>
            <Route path="/site/settings/:siteKey">
              <SiteSettigs />
            </Route>
            <Route path="/site/explorer/:siteKey">
              <BottomBar />
              <Explorer />
            </Route>
            <Route path="/site/editor/:siteKey">
              <BottomBar />
              <EditorWrapper />
            </Route>
          </SiteWrapper>
        </Route>
      </div>
    </div>
  );
}

function SiteWrapper({ children }) {
  const siteConfig = useSiteConfig();
  const { state, initState } = useContext(siteContext);
  useEffect(() => {
    if (!siteConfig) return;
    initState(siteConfig);
  }, [siteConfig]);
  if (!state.isInitialized) return <></>;
  if (!siteConfig) return <></>;
  return <>{children}</>;
}

export default App;
