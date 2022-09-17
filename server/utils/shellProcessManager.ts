import { randomid } from "@shared/utils/randomid";
import * as pty from "node-pty";

interface IProcessObj {
  ptyProcess: pty.IPty;
  id: string;
}

let processList: IProcessObj[] = []; //this module has to be singleton

export const spawn = (cwd: string | undefined, shell: string) => {
  const id = randomid();
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cwd, //undefined OK
    env: process.env as { [key: string]: string },
  });

  ptyProcess.onData((data) => {
    let win: any; //TODO
    win.webContents.send("shell-data", id, data);
  });
  ptyProcess.onExit(() => {
    //TODO
    //const win = getWindow();
    //win.webContents.send("shell-exit", id, exitCode, signal);
    //processList = processList.filter((obj) => obj.id !== id);
  });

  processList.push({ ptyProcess, id });

  return id;
};

export const write = (id: string | undefined, cmd: string) => {
  if (id === undefined) return;
  let processObj: IProcessObj | undefined;
  processList.some((obj) => {
    if (obj.id === id) {
      processObj = obj;
      return true;
    }
    return false;
  });
  if (processObj === undefined) return;
  processObj.ptyProcess.write(cmd);
};
