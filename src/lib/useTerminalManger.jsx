import { useRef, useState } from "react";
import { Terminal as Xterm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "../lib/xterm-addon-web-links.js";
//import { WebLinksAddon } from "xterm-addon-web-links"; //This can't open link
import "xterm/css/xterm.css";

function useTerminalManager(cwd) {
  //const isAnyActive = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cid, setCid] = useState(null); //current id of terminal
  //const [terminals, setTerminals] = useState([]); //list of terminals {xterm, id}
  const terminals = useRef([]); //{xterm, id, el}
  //const [ter, setTer] = useState(terminals);
  const getParent = () => document.getElementById("terminal-console");

  window.xterm = {};

  if (cid !== null && isVisible) {
    terminals.current.forEach((t) => {
      if (t.id === cid) {
        t.el.style.display = "block";
        setTimeout(() => {
          t.xterm.focus();
        }, 0); //called after forEach finishes
        return;
      }
      t.el.style.display = "none";
    });
  }

  const toggleListener = (e) => {
    if (e.key === "@" && e.ctrlKey) {
      setIsVisible((prev) => !prev);
      if (!terminals.current.length) {
        createNew();
      }
    }
  };
  const createResizeListener = (fitAddon) => {
    return () => {
      console.log("resized");
      fitAddon.fit();
    };
  };

  const init = () => {
    window.addEventListener("keydown", toggleListener);
    window.electronAPI.onShellData((_, id, data) => {
      terminals.current.every((t) => {
        if (t.id === id) {
          t.xterm.write(data);
          return false;
        }
        return true;
      });
    });
    window.electronAPI.onShellExit((_, id) => {
      terminals.current.every((t, i) => {
        if (t.id === id) {
          t.xterm.dispose();
          terminals.current.splice(i, 1);
          if (terminals.current.length === 0) {
            setIsVisible(false);
            setCid(null);
            return false;
          }
          setCid(terminals.current[i]?.id || terminals.current[i - 1].id);
          return false;
        }
        return true;
      });
    });
  };

  const createNew = () => {
    const el = document.createElement("div");
    el.className = "terminal-instance";
    const parent = getParent();
    parent.appendChild(el);
    let cid = undefined;
    const xterm = new Xterm({ rows: 15 });
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.loadAddon(new WebLinksAddon());
    xterm.open(el);
    fitAddon.fit();
    window.addEventListener("resize", createResizeListener(fitAddon)); //TODO?: removeEventListener
    xterm.onData((data) => {
      //Ctrl @
      if (data === "\x1B") {
        setIsVisible(false);
        return;
      }
      window.electronAPI.typeCommand(cid, data);
    });
    window.electronAPI.spawnShell(cwd, undefined).then((id) => {
      cid = id; //!important
      el.dataset.id = id;
      terminals.current.push({ id, xterm, el });
      setCid(id);
    });
  };

  const exit = () => {
    const parent = getParent();
    terminals.current?.forEach(({ el }) => {
      parent.removeChild(el); //TODO not triggered
    });
    window.removeEventListener("keydown", toggleListener);
  };

  return {
    isVisible,
    setIsVisible,
    cid,
    setCid,
    terminals,
    init,
    exit,
    createNew,
  };
}

export default useTerminalManager;
