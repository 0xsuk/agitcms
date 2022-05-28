//TODO: multiple terminal
import { useEffect, useRef, useState } from "react";
import { Terminal as Xterm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";
import useSiteConfig from "../lib/useSiteConfig";

function Terminal() {
  const siteConfig = useSiteConfig();
  const [cid, setCid] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  const activateTerminal = (cid, el) => {
    const xterm = new Xterm();
    ref.current = xterm;
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.loadAddon(new WebLinksAddon());
    xterm.open(el);
    fitAddon.fit();
    window.addEventListener("resize", resizeListener(fitAddon));
    window.electronAPI.onShellData((_, id, data) => {
      if (id === cid) {
        xterm.write(data);
      }
    });
    window.electronAPI.onShellExit((_, exitCode, signal) => {
      setIsVisible(false);
      xterm.dispose();
      ref.current = null;

      window.removeEventListener("resize", resizeListener(fitAddon));
    });
    xterm.onData((data) => {
      //Ctrl @
      if (data === "\x1B") {
        setIsVisible(false);
        return;
      }
      window.electronAPI.typeCommand(cid, data);
    });
    window.electronAPI.spawnShell(siteConfig.path, undefined).then((id) => {
      setCid(id);
      cid = id; //!important
    });
  };

  const resizeListener = (fitAddon) => {
    return () => {
      console.log("resized");
      fitAddon.fit();
    };
  };

  useEffect(() => {
    if (!siteConfig.path) return;
    let cid; //!important
    const el = document.getElementById("terminal");
    window.addEventListener("keydown", (e) => {
      if (e.key === "@" && e.ctrlKey) {
        setIsVisible((prev) => !prev);
        if (ref.current !== null) return;
        activateTerminal(cid, el);
      }
    });
  }, [siteConfig.path]);

  return <div id="terminal" style={{ display: !isVisible && "none" }}></div>;
}

export default Terminal;
