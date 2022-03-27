import { Button } from "@mui/material";

function Shell({ lines, setLines }) {
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
