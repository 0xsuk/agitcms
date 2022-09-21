import { randomid } from "@shared/utils/randomid";
import * as pty from "node-pty-prebuilt-multiarch";

interface IProcessObj {
  ptyProcess: pty.IPty;
  id: string;
}

let processList: IProcessObj[] = []; //this module has to be singleton

export const spawnShell = (
  cwd: string | undefined,
  shell: string, //TODO zsh not working
  onData: (id: string, data: string) => any,
  onExit: (id: string) => any
) => {
  const id = randomid();
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cwd, //undefined OK
    env: process.env as { [key: string]: string },
  });

  ptyProcess.onData((data) => {
    onData(id, data);
  });
  ptyProcess.onExit(() => {
    onExit(id);
    processList = processList.filter((processObj) => processObj.id !== id);
  });

  processList.push({ ptyProcess, id });

  return id;
};

export const writeToShell = (id: string | undefined, cmd: string) => {
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
