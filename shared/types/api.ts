import { IConfig } from "./config";

type InputResMap<Input, Res> = {
  input: Input;
  res: Res;
};

export interface IEmitterMap {
  readConfig: InputResMap<void, IConfig>;
  readFile: InputResMap<string, string>;
  saveFile: InputResMap<{ filePath: string; content: string }, Error | null>;
  getFilesAndFolders: InputResMap<
    string,
    { name: string; isDir: boolean; extension: string }[]
  >;
  loadPlugins: InputResMap<void, { name: string; path: string; raw: string }[]>;
  typeCommand: InputResMap<{ cid: string; data: string }, void>;
  spawnShell: InputResMap<
    {
      cwd: string | undefined;
      shell: string | undefined;
    },
    string
  >;
  startMediaServer: InputResMap<
    { staticPath: string; publicPath: string },
    number
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

export interface IPostData {
  event: IEvent;
  payload: any;
}
