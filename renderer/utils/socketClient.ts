import { IEvent, IEventMap, ISocketEventMap } from "@shared/types/api";
import { IConfig } from "@shared/types/config";
const endpoint = "http://localhost:5000";

import { io, Socket } from "socket.io-client";

const timeout = 10 * 1000;
const socket: Socket<ISocketEventMap> = io(endpoint);

const connected = new Promise<void>((resolve, reject) => {
  socket.on("connect", () => {
    console.log("socket connected");
    resolve();
  });
  setTimeout(reject, timeout);
});

const emitSocket = async <Response = any>(eventName: IEvent, data?: any) => {
  await connected;
  return new Promise<Response>((resolve, reject) => {
    socket.emit(eventName, data, (res: Response) => resolve(res)); //every listener on server should call callback, even if no data is to returned
    setTimeout(reject, timeout);
  });
};

export const socketClient: {
  [key in IEvent]: (
    data: IEventMap[key]["data"]
  ) => Promise<IEventMap[key]["res"]>;
} = {
  readConfig: () => emitSocket<IConfig>("readConfig"),
  typeCommand: ({ cid, data }) => emitSocket("typeCommand", { cid, data }),
  spawnShell: ({ cwd, shell }) => emitSocket("spawnShell", { cwd, shell }),
  onShellData: (callback) => emitSocket("onShellData", callback),
  onShellExit: (callback) => emitSocket("onShellExit", callback),
};
