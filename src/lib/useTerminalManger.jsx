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
  const terminals = useRef([]); //{xterm, id, el}
  //const [ter, setTer] = useState(terminals);

  console.log({ terminals });

  if (cid !== null) {
    terminals.current.every((t) => {
      if (t.id === cid) {
        t.el.style.display = "block";
        return false;
      }
      t.el.style.display = "none";
      return true;
    });
  }

  const createToggleListener = () => {
    return (e) => {
      if (e.key === "@" && e.ctrlKey) {
        setIsVisible((prev) => !prev);
        if (!isAnyActive.current) {
          createNew();
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
          //TODO
          //terminals.pop
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
    const parent = document.getElementById("terminal-console");
    const el = document.createElement("div");
    el.className = "terminal-instance";
    parent.appendChild(el);
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
      cid = id; //!important
      el.dataset.id = id;
      terminals.current.push({ id, xterm, el });
      setCid(id);
    });
  };

  const exit = () => {
    window.removeEventListener("keydown", createToggleListener());
  };

  return {
    isAnyActive,
    isVisible,
    setIsVisible,
    cid,
    setCid,
    terminals,
    init,
    createNew,
    exit,
  };
}

export default useTerminalManager;
