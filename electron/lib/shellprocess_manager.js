const pty = require("node-pty");
const { getWindow } = require("./window_manager");
const { v4: uuid } = require("uuid");

module.exports = class ShellProcessManager {
  constructor() {
    this.processObjList = [];
  }

  spawn(cwd, shell) {
    const id = uuid();
    const ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd,
      env: process.env,
    });

    ptyProcess.onData((data) => {
      const win = getWindow();
      win.webContents.send("shell-data", id, data);
    });
    ptyProcess.onExit((exitCode, signal) => {
      const win = getWindow();
      win.webContents.send("shell-exit", id, exitCode, signal);
      this.processObjList = this.processObjList.filter((obj) => obj.id !== id);
    });

    this.processObjList.push({ ptyProcess, id });

    return id;
  }

  write(id, cmd) {
    if (id === undefined) return;
    let processObj;
    this.processObjList.every((obj) => {
      if (obj.id === id) {
        processObj = obj;
        return false;
      }
      return true;
    });
    if (processObj === undefined) return;
    processObj.ptyProcess.write(cmd);
  }

  killAll() {}
};
