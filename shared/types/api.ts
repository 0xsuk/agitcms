import { IConfig } from "./config";

type InputResMap<Input, Res> = {
  input: Input;
  res: Res;
};

export interface IEmitterMap {
  readConfig: InputResMap<
    void,
    { config: IConfig; err: null } | { config: null; err: APIError }
  >;
  updateConfig: InputResMap<IConfig, APIError | null>;
  readFile: InputResMap<
    string,
    { content: string; err: null } | { content: null; err: APIError }
  >;
  saveFile: InputResMap<{ filePath: string; content: string }, APIError | null>;
  createFolder: InputResMap<string, APIError | null>;
  createFile: InputResMap<
    { filePath: string; content: string; doOverwrite: boolean },
    { err: APIError | null; fileAlreadyExists: boolean }
  >;
  removeFile: InputResMap<string, APIError | null>;
  removeFolder: InputResMap<string, APIError | null>;
  getFilesAndFolders: InputResMap<
    string,
    | {
        filesAndFolders: { name: string; isDir: boolean; extension: string }[];
        err: null;
      }
    | {
        filesAndFolders: null;
        err: APIError;
      }
  >;
  renameFileOrFolder: InputResMap<
    { oldDfPath: string; newDfPath: string },
    APIError | null
  >;
  loadPlugins: InputResMap<
    void,
    | {
        pluginInfos: { name: string; path: string; raw: string }[];
        err: null;
      }
    | {
        pluginInfos: null;
        err: APIError;
      }
  >;
  typeCommand: InputResMap<{ cid: string; data: string }, void>;
  spawnShell: InputResMap<
    {
      cwd: string | undefined;
      shell: string | undefined;
    },
    { id: string; err: null } | { id: null; err: APIError }
  >;
  startMediaServer: InputResMap<
    { staticPath: string; publicPath: string },
    { port: number; err: null } | { port: null; err: APIError }
  >;
  saveImage: InputResMap<
    {
      filePath: string;
      binary: string | NodeJS.ArrayBufferView;
    },
    APIError | null
  >;
}

export interface IListenerMap {
  onShellData: (id: string, data: string) => void;
  onShellExit: (id: string) => void;
}

//Unlike Error, APIError is sendable via socket.io callback
export class APIError {
  err;
  constructor(err: Error) {
    this.err = JSON.parse(
      JSON.stringify(err, Object.getOwnPropertyNames(err))
    ) as Error;
  }

  warn() {
    if (this.err.message) {
      alert(this.err.message);
    } else {
      alert("Error occured! see the browser console");
    }
    console.error(this.err);
  }
}
