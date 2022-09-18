import { IConfig } from "./config";

type InputResMap<Input, Res> = {
  input: Input;
  res: Res;
};

export interface IEmitterMap {
  readConfig: InputResMap<
    void,
    { config: IConfig; err: null } | { config: null; err: Error }
  >;
  updateConfig: InputResMap<IConfig, Error | null>;
  readFile: InputResMap<
    string,
    { content: string; err: null } | { content: null; err: Error }
  >;
  saveFile: InputResMap<{ filePath: string; content: string }, Error | null>;
  createFolder: InputResMap<string, Error | null>;
  createFile: InputResMap<
    { filePath: string; content: string; doOverwrite: boolean },
    { err: Error | null; fileAlreadyExists: boolean }
  >;
  removeFile: InputResMap<string, Error | null>;
  removeFolder: InputResMap<string, Error | null>;
  getFilesAndFolders: InputResMap<
    string,
    | {
        filesAndFolders: { name: string; isDir: boolean; extension: string }[];
        err: null;
      }
    | {
        filesAndFolders: null;
        err: Error;
      }
  >;
  renameFileOrFolder: InputResMap<
    { oldDfPath: string; newDfPath: string },
    Error | null
  >;
  loadPlugins: InputResMap<
    void,
    | {
        pluginInfos: { name: string; path: string; raw: string }[];
        err: null;
      }
    | {
        pluginInfos: null;
        err: Error;
      }
  >;
  typeCommand: InputResMap<{ cid: string; data: string }, void>;
  spawnShell: InputResMap<
    {
      cwd: string | undefined;
      shell: string | undefined;
    },
    { id: string; err: null } | { id: null; err: Error }
  >;
  startMediaServer: InputResMap<
    { staticPath: string; publicPath: string },
    { port: number; err: null } | { port: null; err: Error }
  >;
  saveImage: InputResMap<
    {
      filePath: string;
      binary: string | NodeJS.ArrayBufferView;
    },
    Error | null
  >;
}

export interface IListenerMap {
  onShellData: (id: string, data: string) => void;
  onShellExit: (id: string) => void;
}

export type IEvent = keyof IEmitterMap | keyof IListenerMap;

export type ISocketEventMap = {
  [key in IEvent]: any;
};
