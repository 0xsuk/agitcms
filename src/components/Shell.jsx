import { Button } from "@mui/material";

const { Fragment, useState, useEffect } = require("react");

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
    <Fragment>
      <Button onClick={() => setLines([])}>Clear</Button>
      {lines.map((line) => (
        <p>{line}</p>
      ))}
    </Fragment>
  );
}

export default Shell;
