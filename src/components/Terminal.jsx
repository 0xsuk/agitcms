import { useContext, useEffect } from "react";
import useSiteConfig from "../lib/useSiteConfig";
import useTerminalManager from "../lib/useTerminalManger";
import { configContext } from "../context/ConfigContext";

function Terminal() {
  const { config } = useContext(configContext);
  const siteConfig = useSiteConfig();
  const { init, exit, isVisible, cid, setCid, terminals, createNew } =
    useTerminalManager(siteConfig);
  useEffect(() => {
    if (!siteConfig.path || !config.useTerminal) return;
    init();
    return exit;
  }, [siteConfig.path]);

  return (
    <div id="terminal" style={{ display: !isVisible && "none" }}>
      <div id="terminal-header">
        {terminals.current.map((t, i) => (
          <>
            <div
              className="terminal-tab"
              style={
                cid === t.id ? { background: "white", color: "black" } : {}
              }
              onClick={() => setCid(t.id)}
            >
              {i}
            </div>
          </>
        ))}
        <div className="terminal-tab" onClick={createNew}>
          +
        </div>
      </div>
      <div id="terminal-console"></div>
    </div>
  );
}

export default Terminal;
