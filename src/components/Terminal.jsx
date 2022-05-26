import { useEffect, useState } from "react";
import { Terminal as Xterm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";
import useSiteConfig from "../lib/useSiteConfig";

function Terminal() {
  const siteConfig = useSiteConfig();
  const [cid, setCid] = useState(null);
  const fitAddon = new FitAddon();
  const xterm = new Xterm();
  useEffect(() => {
    let cid; //!important
    xterm.loadAddon(fitAddon);
    xterm.loadAddon(new WebLinksAddon());
    xterm.open(document.getElementById("terminal"));
    fitAddon.fit();
    window.addEventListener("resize", () => {
      fitAddon.fit(); //TODO
    });
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
