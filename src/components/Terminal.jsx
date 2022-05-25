import { useEffect } from "react";
import { Terminal as Xterm } from "xterm";
import "xterm/css/xterm.css";

function Terminal() {
  useEffect(() => {
    const xterm = new Xterm();
    xterm.open(document.getElementById("terminal"));
    xterm.write("Hello Agit");
  }, []);
  return <div id="terminal"></div>;
}

export default Terminal;
