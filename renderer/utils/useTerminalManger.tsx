import { RefObject, useEffect, useRef, useState } from "react";
import { Terminal as Xterm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "@/utils/xterm-addon-web-links.js";
//import { WebLinksAddon } from "xterm-addon-web-links"; //This can't open link
import "xterm/css/xterm.css";

//@ts-ignore
window.xterm = {};
function useTerminalManager(
  cwd: string | undefined,
  parentRef: RefObject<HTMLDivElement>
) {
  const cwdRef = useRef<string | undefined>();
  cwdRef.current = cwd;
  const [isVisible, setIsVisible] = useState(false);
  const [cid, setCid] = useState<string | null>(null); //current id of terminal
  const terminals = useRef<{ xterm: any; id: string; el: HTMLElement }[]>([]); //{xterm, id, el}

  useEffect(() => {
    if (!parentRef.current) return;
    window.addEventListener("keydown", toggleListener);
    //@ts-ignore
    window.electronAPI.onShellData((_, id, data) => {
      terminals.current.every((t) => {
        if (t.id === id) {
          t.xterm.write(data);
          return false;
        }
        return true;
      });
    });
    //@ts-ignore
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

    return () => {
      terminals.current?.forEach(({ el }) => {
        parentRef.current?.removeChild(el); //TODO not triggered
      });
      window.removeEventListener("keydown", toggleListener);
    };
  }, [parentRef]);

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

  const toggleListener = (e: KeyboardEvent) => {
    if (e.key === "@" && e.ctrlKey) {
      setIsVisible((prev) => !prev);
      if (!terminals.current.length) {
        createNew();
      }
    }
  };
  const createResizeListener = (fitAddon: any) => {
    return () => {
      console.log("resized");
      fitAddon.fit();
    };
  };

  const createNew = () => {
    const el = document.createElement("div");
    el.className = "terminal-instance";
    parentRef.current?.appendChild(el);
    const xterm = new Xterm({ rows: 15 });
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    //@ts-ignore
    xterm.loadAddon(new WebLinksAddon());
    xterm.open(el);
    fitAddon.fit();
    window.addEventListener("resize", createResizeListener(fitAddon)); //TODO?: removeEventListener
    let cid: string | undefined;
    xterm.onData((data) => {
      //Ctrl @
      if (data === "\x1B") {
        setIsVisible(false);
        return;
      }
      //@ts-ignore
      window.electronAPI.typeCommand(cid, data);
    });
    //@ts-ignore
    window.electronAPI.spawnShell(cwdRef.current, undefined).then((id) => {
      cid = id; //!important
      el.dataset.id = id;
      terminals.current.push({ id, xterm, el });
      setCid(id);
    });
  };

  return {
    isVisible,
    setIsVisible,
    cid,
    setCid,
    terminals,
    createNew,
  };
}

export default useTerminalManager;
