import { useRef } from "react";
import useSiteConfig from "@/utils/useSiteConfig";
import useTerminalManager from "@/utils/useTerminalManger";

function Terminal() {
  const cwd = useSiteConfig()?.path;
  const parentRef = useRef<HTMLDivElement>(null);
  const { isVisible, cid, setCid, terminals, createNew } = useTerminalManager(
    cwd,
    parentRef
  );

  return (
    <div id="terminal" style={{ display: !isVisible ? "none" : undefined }}>
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
      <div id="terminal-console" ref={parentRef}></div>
    </div>
  );
}

export default Terminal;
