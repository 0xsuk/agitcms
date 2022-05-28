import { useEffect } from "react";
import "xterm/css/xterm.css";
import useSiteConfig from "../lib/useSiteConfig";
import useTerminalManager from "../lib/useTerminalManger";

function Terminal() {
  const siteConfig = useSiteConfig();
  const { init, exit, createNew, isVisible } = useTerminalManager(siteConfig);
  useEffect(() => {
    if (!siteConfig.path) return;
    init();
    createNew();
    createNew();
    return exit;
  }, [siteConfig.path]);

  return <div id="terminal" style={{ display: !isVisible && "none" }}></div>;
}

export default Terminal;
