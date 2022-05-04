const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron/main");
const {
  readConfig,
  updateConfig,
  readFile,
  saveFile,
  getFolderPath,
  getFilesAndFolders,
  renameFile,
  runCommand,
  stopCommand,
  createFolder,
  createFile,
  removeFile,
  removeFolder,
} = require("./api");
const { createWindow } = require("./lib/window_manager");

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("read-config", readConfig);
  ipcMain.handle("update-config", updateConfig);
  ipcMain.handle("save-file", saveFile);
  ipcMain.handle("read-file", readFile);
  ipcMain.handle("rename-file", renameFile);
  ipcMain.handle("get-folder-path", getFolderPath);
  ipcMain.handle("get-files-and-folders", getFilesAndFolders);
  ipcMain.handle("create-folder", createFolder);
  ipcMain.handle("create-file", createFile);
  ipcMain.handle("remove-file", removeFile);
  ipcMain.handle("remove-folder", removeFolder);
  ipcMain.handle("run-command", runCommand);
  ipcMain.handle("stop-command", stopCommand);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
