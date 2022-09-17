import { IEmitterMap, IListenerMap } from "@shared/types/api";
import { IConfig } from "@shared/types/config";
import * as fs from "fs";
import * as path from "path";
import { defaultShell } from "@/utils/constants";
import { spawnShell, writeToShell } from "@/utils/shellProcess";
import { runMediaServer } from "./utils/mediaServer";

const CONFIG_DIR = path.join(require("os").homedir(), ".agitcms");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

let onShellDataCallback: IListenerMap["onShellData"];
let onShellExitCallback: IListenerMap["onShellExit"];

function _getFilesAndFolders(folderPath: string) {
  const dirents = fs.readdirSync(folderPath, { withFileTypes: true });
  const filesAndFolders = dirents.map((dirent) => ({
    name: dirent.name,
    isDir: dirent.isDirectory(),
    extension: path.extname(dirent.name).toLowerCase(),
  }));
  return filesAndFolders;
}

function _readFile(filePath: string) {
  const content = fs.readFileSync(filePath).toString();
  return content;
}
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
  readConfig(_, resolve) {
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
  readFile(filePath, resolve) {
    const content = _readFile(filePath);
    resolve(content);
  },
  saveFile({ filePath, content }, resolve) {
    try {
      fs.writeFileSync(filePath, content);
      resolve(null);
    } catch (err) {
      if (err instanceof Error) {
        resolve(err);
      }
    }
  },
  getFilesAndFolders(folderPath, resolve) {
    const filesAndFolders = _getFilesAndFolders(folderPath);
    resolve(filesAndFolders);
  },
  loadPlugins(_, resolve) {
    const pluginFolder = path.join(CONFIG_DIR, "plugins");
    const filesAndFolders = _getFilesAndFolders(pluginFolder);

    const plugins = filesAndFolders
      .filter((dirent) => dirent.isDir === false && dirent.extension === ".js")
      .map((file) => {
        const filePath = path.join(pluginFolder, file.name);
        return {
          name: file.name,
          path: filePath,
          raw: _readFile(filePath),
        };
      });
    resolve(plugins);
  },
  typeCommand({ cid, data }, resolve) {
    resolve();
    writeToShell(cid, data);
  },
  spawnShell({ cwd, shell }, resolve) {
    if (shell === undefined) shell = defaultShell as string;
    if (!onShellDataCallback || !onShellExitCallback)
      throw Error(
        "shell spawned before onShellDataCallback || onShellExitCallback is registered"
      );
    const id = spawnShell(cwd, shell, onShellDataCallback, onShellExitCallback);
    resolve(id);
  },
  startMediaServer({ staticPath, publicPath }, resolve) {
    const port = runMediaServer(staticPath, publicPath);
    resolve(port);
  },
  //should be called once
  onShellData(_, callback) {
    onShellDataCallback = callback;
  },
  //should be called once
  onShellExit(_, callback) {
    onShellExitCallback = callback; //register action to perform when a shell exits
  },
};

export default handlers;
