import { IEvent, IEventMap } from "@shared/types/api";
import { IConfig } from "@shared/types/config";
import * as fs from "fs";
import * as path from "path";

const CONFIG_DIR = path.join(require("os").homedir(), ".agitcms");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

const handlers: {
  [key in IEvent]: (
    data: IEventMap[key]["data"],
    serve: (res: IEventMap[key]["res"]) => any
  ) => void;
} = {
  readConfig: (_, serve) => {
    try {
      if (!fs.existsSync(CONFIG_DIR)) {
        fs.cpSync(path.join(__dirname, "assets", ".agitcms"), CONFIG_DIR, {
          recursive: true,
        });
      }

      const config = JSON.parse(
        fs.readFileSync(CONFIG_FILE).toString()
      ) as IConfig;
      serve(config);
    } catch (err) {
      throw new Error("Failed to load config\n" + err);
    }
  },
  typeCommand: ({ cid, data }, serve) => {
    serve();
    console.log("type command", "TODO");
  },
  spawnShell: ({ cwd, shell }, serve) => {
    serve("id");
  },
  onShellData: (callback, serve) => {
    serve();
    callback("id", "mydata");
  },
  onShellExit: (callback, serve) => {
    serve();
    callback("id");
  },
};

export default handlers;
