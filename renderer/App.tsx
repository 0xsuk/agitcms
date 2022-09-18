import BottomBar from "@/components/BottomBar";
import EditorWrapper from "@/components/EditorWrapper";
import Explorer from "@/components/Explorer";
import Home from "@/components/Home";
import Settings from "@/components/Settings";
import SideBar from "@/components/SideBar";
import SiteSettings from "@/components/SiteSettings";
import Terminal from "@/components/Terminal";
import { configContext } from "@/context/ConfigContext";
import { siteContext } from "@/context/SiteContext";
import { useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import { isMac } from "@/utils/constants";
import useSiteConfig from "@/utils/useSiteConfig";
import "./App.scss";
import Test from "./Test";

function App() {
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
    <div id="wrapper">
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

function SiteWrapper({ children }: { children: any }) {
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
