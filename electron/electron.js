const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron/main");
const path = require("path");
const fs = require("fs");
const isDev = require("electron-is-dev"); //is not a devDependencies
const {
  readConfig,
  updateConfig,
  readFile,
  saveFile,
  getFolderPath,
  getFilesAndFolders,
  renameFile,
  runCommand,
} = require("./api");

const CONFIG_DIR = path.join(require("os").homedir(), ".agitcms");
const CONFIG_FILE = path.join(exports.CONFIG_DIR, "config.json");
let CONFIG = undefined;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../index.html")}` //be careful on relative path
  );
};

const loadConfig = () => {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o775 });
    }
    if (!fs.existsSync(CONFIG_FILE)) {
      const config_str = fs
        .readFileSync(path.join(__dirname, "assets", "config.json"))
        .toString();
      fs.writeFileSync(CONFIG_FILE, config_str, { mode: 0o664 });
    }

    CONFIG = JSON.parse(fs.readFileSync(CONFIG_FILE));
  } catch (err) {
    throw new Error("Failed to load config\n", err);
  }
};

app.whenReady().then(() => {
  loadConfig();
  createWindow();

  ipcMain.handle("read-config", readConfig);
  ipcMain.handle("update-config", updateConfig);
  ipcMain.handle("save-file", saveFile);
  ipcMain.handle("read-file", readFile);
  ipcMain.handle("rename-file", renameFile);
  ipcMain.handle("get-folder-path", getFolderPath);
  ipcMain.handle("get-files-and-folders", getFilesAndFolders);
  ipcMain.handle("run-command", runCommand);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

module.exports = {
  CONFIG_DIR,
  CONFIG_FILE,
  CONFIG,
  setConfig: (newConfig) => (CONFIG = newConfig),
};
