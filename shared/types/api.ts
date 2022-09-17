import { IConfig } from "./config";

type DataResMap<Data, Res> = {
  data: Data;
  res: Res;
};

export interface IEventMap {
  readConfig: DataResMap<void, IConfig>;
  typeCommand: DataResMap<{ cid: string; data: string }, void>;
  spawnShell: DataResMap<
    {
      cwd: string | undefined;
      shell: string | undefined;
    },
    string
  >;
  onShellData: DataResMap<(id: string, data: string) => void, void>;
  onShellExit: DataResMap<(id: string) => void, void>;
}

export type IEvent = keyof IEventMap;

export type ISocketEventMap = {
  [key in IEvent]: any;
};

export interface IPostData {
  event: IEvent;
  payload: any;
}
