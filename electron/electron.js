const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron/main");
const path = require("path");
const isDev = require("electron-is-dev"); //is not a devDependencies
const { loadConfig, saveNewFile, openFile } = require("./api");

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

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("load-config", loadConfig);
  ipcMain.handle("save-new-file", saveNewFile);
  ipcMain.handle("open-file", openFile);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});