const { Fragment } = require("react");

function Shell() {
  if (typeof window !== undefined) {
    window.electronAPI.onShellProcessLine((e, data) => {
      console.log(data.line);
    });
  }

  return <Fragment></Fragment>;
}

export default Shell;
