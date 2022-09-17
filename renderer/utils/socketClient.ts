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
  readConfig() {
    return emitSocket<IConfig>("readConfig");
  },
  readFile(filePath) {
    return emitSocket("readFile", filePath);
  },
  saveFile(input) {
    return emitSocket("saveFile", input);
  },
  getFilesAndFolders(folderPath) {
    return emitSocket("getFilesAndFolders", folderPath);
  },
  loadPlugins() {
    return emitSocket("loadPlugins");
  },
  typeCommand(input) {
    return emitSocket("typeCommand", input);
  },
  spawnShell(input) {
    return emitSocket("spawnShell", input);
  },
  startMediaServer(input) {
    return emitSocket("startMediaServer", input);
  },
  onShellData(callback) {
    return listenSocket("onShellData", callback);
  },
  onShellExit(callback) {
    return listenSocket("onShellExit", callback);
  },
};
