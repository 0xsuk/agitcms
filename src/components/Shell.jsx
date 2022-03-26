import { Button } from "@mui/material";

const { useState, useEffect } = require("react");

function Shell() {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (typeof window !== undefined) {
      window.electronAPI.onShellProcessLine((e, data) => {
        setLines((prev) => [...prev, data.line]);
      });
    }
  }, []);

  return (
    <div id="shell">
      <Button onClick={() => setLines([])}>Clear</Button>
      {lines.map((line) => (
        <p>{line}</p>
      ))}
    </div>
  );
}

export default Shell;
