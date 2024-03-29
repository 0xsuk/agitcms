import { defaultShell, isWin } from "@/utils/constants";
import { spawnShell, writeToShell } from "@/utils/shellProcess";
import { IEmitterMap, IListenerMap } from "@shared/types/api";
import { IConfig } from "@shared/types/config";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Socket } from "socket.io";
import { runMediaServer } from "./utils/mediaServer";
import { parseError } from "./utils/parseError";

const CONFIG_DIR = path.join(os.homedir(), ".agitcms");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

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

const createEmitters = (
  socket: Socket<IEmitterMap, IListenerMap>
): { [key in keyof IListenerMap]: IListenerMap[key] } => {
  return {
    onShellData(id, data) {
      socket.emit("onShellData", id, data);
    },
    onShellExit(id) {
      socket.emit("onShellExit", id);
    },
  };
};

export const createListeners = (
  socket: Socket //no need to provide socket type because emitter wraps it
): {
  [key in keyof IEmitterMap]: (
    input: IEmitterMap[key]["input"],
    resolve: (res: IEmitterMap[key]["res"]) => void
  ) => void;
} => {
  const emitters = createEmitters(socket);

  return {
    readConfig(_, resolve) {
      try {
        if (!fs.existsSync(CONFIG_DIR)) {
          fs.cpSync(
            path.join(__dirname, "..", "assets", ".agitcms"),
            CONFIG_DIR,
            {
              recursive: true,
            }
          );
        }

        const config = JSON.parse(
          fs.readFileSync(CONFIG_FILE).toString()
        ) as IConfig;
        resolve({ config, err: null });
      } catch (err) {
        if (err instanceof Error) {
          resolve({ config: null, err: parseError(err) });
        }
      }
    },
    updateConfig(config, resolve) {
      try {
        const config_str = JSON.stringify(config, null, "\t");
        fs.writeFileSync(CONFIG_FILE, config_str);
        resolve(null);
      } catch (err) {
        if (err instanceof Error) {
          resolve(parseError(err));
        }
      }
    },
    readFile(filePath, resolve) {
      try {
        const content = _readFile(filePath);
        resolve({ content, err: null });
      } catch (err) {
        if (err instanceof Error) {
          resolve({ content: null, err: parseError(err) });
        }
      }
    },
    saveFile({ filePath, content }, resolve) {
      try {
        fs.writeFileSync(filePath, content);
        resolve(null);
      } catch (err) {
        if (err instanceof Error) {
          resolve(parseError(err));
        }
      }
    },
    createFolder(folderPath, resolve) {
      try {
        // response is folderPath
        fs.mkdirSync(folderPath, { recursive: true });
        resolve(null);
      } catch (err) {
        if (err instanceof Error) {
          resolve(parseError(err));
        }
      }
    },
    createFile({ filePath, content, doOverwrite }, resolve) {
      try {
        if (doOverwrite) {
          fs.writeFileSync(filePath, content);
          resolve({ err: null, fileAlreadyExists: true });
          return;
        }
        const isFileExists = fs.existsSync(filePath);
        if (isFileExists) {
          resolve({ err: null, fileAlreadyExists: true });
        }

        fs.writeFileSync(filePath, content);
        resolve({ err: null, fileAlreadyExists: false });
      } catch (err) {
        if (err instanceof Error) {
          resolve({ err: parseError(err), fileAlreadyExists: false });
        }
      }
    },
    removeFolder(folderPath, resolve) {
      try {
        fs.rmdirSync(folderPath, { recursive: true });
        resolve(null);
      } catch (err) {
        if (err instanceof Error) {
          resolve(parseError(err));
        }
      }
    },
    removeFile(filePath, resolve) {
      try {
        fs.unlinkSync(filePath);
        resolve(null);
      } catch (err) {
        if (err instanceof Error) {
          resolve(parseError(err));
        }
      }
    },
    getFilesAndFolders(folderPath, resolve) {
      try {
        if (folderPath === "") {
          folderPath = os.homedir();
          if (isWin)
            folderPath = path.posix.join(
              "/",
              ...folderPath.split("\\").slice(1)
            );
        }
        const filesAndFolders = _getFilesAndFolders(folderPath);
        resolve({ filesAndFolders, cwd: folderPath, err: null });
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
          resolve({ filesAndFolders: null, cwd: null, err: parseError(err) });
        }
      }
    },
    renameFileOrFolder({ oldDfPath, newDfPath }, resolve) {
      try {
        fs.renameSync(oldDfPath, newDfPath);
        resolve(null);
      } catch (err) {
        if (err instanceof Error) {
          resolve(parseError(err));
        }
      }
    },
    loadPlugins(_, resolve) {
      try {
        const pluginFolder = path.join(CONFIG_DIR, "plugins");
        const filesAndFolders = _getFilesAndFolders(pluginFolder);

        const pluginInfos = filesAndFolders
          .filter(
            (dirent) => dirent.isDir === false && dirent.extension === ".js"
          )
          .map((file) => {
            const filePath = path.join(pluginFolder, file.name);
            return {
              name: file.name,
              path: filePath,
              raw: _readFile(filePath),
            };
          });
        resolve({ pluginInfos, err: null });
      } catch (err) {
        if (err instanceof Error) {
          resolve({ pluginInfos: null, err: parseError(err) });
        }
      }
    },
    typeCommand({ cid, data }, resolve) {
      resolve();
      writeToShell(cid, data);
    },
    spawnShell({ cwd, shell }, resolve) {
      try {
        if (shell === undefined) shell = defaultShell as string;
        const id = spawnShell(
          cwd,
          shell,
          emitters.onShellData,
          emitters.onShellExit
        );
        resolve({ id, err: null });
      } catch (err) {
        if (err instanceof Error) {
          resolve({ id: null, err: parseError(err) });
        }
      }
    },
    startMediaServer({ staticPath, publicPath }, resolve) {
      try {
        const port = runMediaServer(staticPath, publicPath);
        resolve({ port, err: null });
      } catch (err) {
        if (err instanceof Error) {
          resolve({ port: null, err: parseError(err) });
        }
      }
    },
    saveImage({ filePath, binary }, resolve) {
      try {
        fs.writeFileSync(filePath, binary, "binary");
        resolve(null);
      } catch (err) {
        if (err instanceof Error) {
          resolve(parseError(err));
        }
      }
    },
  };
};
