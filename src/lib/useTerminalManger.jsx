import { useRef, useState } from "react";
import { Terminal as Xterm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

function useTerminalManager(siteConfig) {
  const isAnyActive = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cid, setCid] = useState(null); //current id of terminal
  //const [terminals, setTerminals] = useState([]); //list of terminals {xterm, id}
  const terminals = useRef([]);

  console.log({ terminals });

  const createToggleListener = () => {
    return (e) => {
      if (e.key === "@" && e.ctrlKey) {
        setIsVisible((prev) => !prev);
        if (!isAnyActive.current) {
          createNew(el);
        }
      }
    };
  };
  const createResizeListener = (fitAddon) => {
    return () => {
      console.log("resized");
      fitAddon.fit();
    };
  };

  const init = () => {
    window.addEventListener("keydown", createToggleListener());
    window.electronAPI.onShellData((_, id, data) => {
      terminals.current.every((t) => {
        if (t.id === id) {
          t.xterm.write(data);
          return false;
        }
        return true;
      });
    });
    window.electronAPI.onShellExit((_, id, exitCode, signal) => {
      terminals.current.every((t) => {
        if (t.id === id) {
          t.xterm.dispose();
          return false;
        }
        return true;
      });
      //setIsVisible(false);
      //xterm.dispose();
      //isAnyActive.current = false;

      //window.removeEventListener("resize", resizeListener(fitAddon));
    });
  };

  const createNew = () => {
    const el = document.getElementById("terminal");
    let cid = undefined;
    const xterm = new Xterm();
    isAnyActive.current = true;
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.loadAddon(new WebLinksAddon());
    xterm.open(el);
    fitAddon.fit();
    window.addEventListener("resize", createResizeListener(fitAddon));
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
      terminals.current.push({ xterm, id });
    });
  };

  const exit = () => {
    window.removeEventListener("keydown", createToggleListener());
  };

  return { isAnyActive, isVisible, cid, terminals, init, createNew, exit };
}

export default useTerminalManager;
