import {
  IEmitterMap,
  IEvent,
  IListenerMap,
  ISocketEventMap,
} from "@shared/types/api";
const endpoint = "http://localhost:5151";

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
    return emitSocket("readConfig");
  },
  updateConfig(config) {
    return emitSocket("updateConfig", config);
  },
  readFile(filePath) {
    return emitSocket("readFile", filePath);
  },
  saveFile(input) {
    return emitSocket("saveFile", input);
  },
  createFolder(folderPath) {
    return emitSocket("createFolder", folderPath);
  },
  createFile(filePath) {
    return emitSocket("createFile", filePath);
  },
  removeFolder(folderPath) {
    return emitSocket("removeFolder", folderPath);
  },
  removeFile(filePath) {
    return emitSocket("removeFile", filePath);
  },
  getFilesAndFolders(folderPath) {
    return emitSocket("getFilesAndFolders", folderPath);
  },
  renameFileOrFolder(input) {
    return emitSocket("renameFileOrFolder", input);
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
  saveImage(input) {
    return emitSocket("saveImage", input);
  },
  onShellData(callback) {
    return listenSocket("onShellData", callback);
  },
  onShellExit(callback) {
    return listenSocket("onShellExit", callback);
  },
};
