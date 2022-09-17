import {
  IEmitterMap,
  IEvent,
  IListenerMap,
  ISocketEventMap,
} from "@shared/types/api";
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

const listenSocket = async (eventName: IEvent, callback: any) => {
  await connected;
  socket.emit(eventName, undefined, callback); //does not send any data
};

export const socketClient:
  | {
      [key in keyof IEmitterMap]: (
        input: IEmitterMap[key]["input"]
      ) => Promise<IEmitterMap[key]["res"]>;
    } & {
      [key in keyof IListenerMap]: (input: IListenerMap[key]) => Promise<void>;
    } = {
  readConfig: () => emitSocket<IConfig>("readConfig"),
  typeCommand: ({ cid, data }) => emitSocket("typeCommand", { cid, data }),
  spawnShell: ({ cwd, shell }) => emitSocket("spawnShell", { cwd, shell }),
  onShellData: (callback) => listenSocket("onShellData", callback),
  onShellExit: (callback) => listenSocket("onShellExit", callback),
};

//@ts-ignore
window.onShellData = socketClient.onShellData;
