import BottomBar from "components/BottomBar";
import EditorWrapper from "components/EditorWrapper";
import Explorer from "components/Explorer";
import Home from "components/Home";
import Settings from "components/Settings";
import SideBar from "components/SideBar";
import SiteSettings from "components/SiteSettings";
import Terminal from "components/Terminal";
import { configContext } from "context/ConfigContext";
import { siteContext } from "context/SiteContext";
import { Fragment, useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import { isMac } from "utils/constants";
import useSiteConfig from "utils/useSiteConfig";
import "./App.scss";
import Test from "./Test";
import { setup } from "./utils/setup";

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
  const { config } = useContext(configContext);

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
        <Route path="/">{config.useTerminal && <Terminal />}</Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
        <Route path="/site">
          <SiteWrapper>
            <Route path="/site/settings/:siteKey">
              <SiteSettings />
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
