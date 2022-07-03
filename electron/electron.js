const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron/main");
const {
  confirm,
  readConfig,
  updateConfig,
  readFile,
  saveFile,
  getFolderPath,
  getFilesAndFolders,
  typeCommand,
  createFolder,
  createFile,
  removeFile,
  removeFolder,
  spawnShell,
  startMediaServer,
  getMediaFile,
  saveImage,
  renameFileOrFolder,
} = require("./api");
const { createWindow } = require("./lib/window_manager");

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("confirm", confirm);
  ipcMain.handle("read-config", readConfig);
  ipcMain.handle("update-config", updateConfig);
  ipcMain.handle("save-file", saveFile);
  ipcMain.handle("read-file", readFile);
  ipcMain.handle("rename-file-or-folder", renameFileOrFolder);
  ipcMain.handle("get-folder-path", getFolderPath);
  ipcMain.handle("get-files-and-folders", getFilesAndFolders);
  ipcMain.handle("create-folder", createFolder);
  ipcMain.handle("create-file", createFile);
  ipcMain.handle("remove-file", removeFile);
  ipcMain.handle("remove-folder", removeFolder);
  ipcMain.handle("type-command", typeCommand);
  ipcMain.handle("spawn-shell", spawnShell);
  ipcMain.handle("start-media-server", startMediaServer);
  ipcMain.handle("get-media-file", getMediaFile);
  ipcMain.handle("save-image", saveImage);
  //ipcMain.handle("resize-shell", resizeShell);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
