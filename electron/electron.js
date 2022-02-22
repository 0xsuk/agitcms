const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron/main");
const path = require("path");
const { loadConfig } = require("./api");

// hot reload
require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "..", "node_modules", ".bin", "electron"),
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // win.loadFile('index.html')
  console.log("I love you all!");
  win.loadURL("http://localhost:3000");
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("load-config", loadConfig);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
