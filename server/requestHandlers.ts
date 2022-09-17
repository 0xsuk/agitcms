import { IEmitterMap, IListenerMap } from "@shared/types/api";
import { IConfig } from "@shared/types/config";
import * as fs from "fs";
import * as path from "path";

const CONFIG_DIR = path.join(require("os").homedir(), ".agitcms");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

const handlers:
  | {
      [key in keyof IEmitterMap]: (
        input: IEmitterMap[key]["input"],
        resolve: (res: IEmitterMap[key]["res"]) => any
      ) => void;
    } & {
      [key in keyof IListenerMap]: (
        input: undefined,
        callback: IListenerMap[key]
      ) => void;
    } = {
  readConfig: (_, resolve) => {
    try {
      if (!fs.existsSync(CONFIG_DIR)) {
        fs.cpSync(path.join(__dirname, "assets", ".agitcms"), CONFIG_DIR, {
          recursive: true,
        });
      }

      const config = JSON.parse(
        fs.readFileSync(CONFIG_FILE).toString()
      ) as IConfig;
      resolve(config);
    } catch (err) {
      throw new Error("Failed to load config\n" + err);
    }
  },
  typeCommand: ({ cid, data }, resolve) => {
    resolve();
  },
  spawnShell: ({ cwd, shell }, resolve) => {
    resolve("id");
  },
  onShellData: (_, callback) => {
    callback("a", "a");
    //callback("id", "mydata");
  },
  onShellExit: (_, callback) => {
    callback("id");
  },
};

export default handlers;
