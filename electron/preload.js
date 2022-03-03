const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadConfig: () => ipcRenderer.invoke("load-config"),
  updateConfig: (newConfig) => ipcRenderer.invoke("update-config", newConfig),
  saveFile: (content, filePath) =>
    ipcRenderer.invoke("save-file", content, filePath),
  readFile: () => ipcRenderer.invoke("read-file"),
  getFolderPath: () => ipcRenderer.invoke("get-folder-path"),
  getFolders: (folderPath) => ipcRenderer.invoke("get-folders", folderPath),
  getFilesAndFolders: (folderPath) =>
    ipcRenderer.invoke("get-files-and-folders", folderPath),
});
