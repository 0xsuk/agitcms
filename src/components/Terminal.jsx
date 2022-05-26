import { useEffect, useState } from "react";
import { Terminal as Xterm } from "xterm";
import "xterm/css/xterm.css";
import useSiteConfig from "../lib/useSiteConfig";

function Terminal() {
  const siteConfig = useSiteConfig();
  const [cid, setCid] = useState(null);
  useEffect(() => {
    let cid; //!important
    const xterm = new Xterm();
    xterm.open(document.getElementById("terminal"));
    window.electronAPI.onShellData((_, id, data) => {
      console.log(id, cid);
      if (id === cid) {
        xterm.write(data);
      }
    });
    window.electronAPI.onShellExit((_, exitCode, signal) => xterm.dispose());
    xterm.onData((data) => window.electronAPI.typeCommand(cid, data));

    window.electronAPI.spawnShell(siteConfig.path, undefined).then((id) => {
      setCid(id);
      cid = id; //!important
    });
  }, []);

  return <div id="terminal"></div>;
}

export default Terminal;
