const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  readConfig: () => ipcRenderer.invoke("read-config"),
  updateConfig: (newConfig) => ipcRenderer.invoke("update-config", newConfig),
  saveFile: (doc, frontmatter, filePath) =>
    ipcRenderer.invoke("save-file", doc, frontmatter, filePath),
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  renameFile: (filePath, newFileName) =>
    ipcRenderer.invoke("rename-file", filePath, newFileName),
  getFolderPath: () => ipcRenderer.invoke("get-folder-path"),
  getFilesAndFolders: (folderPath) =>
    ipcRenderer.invoke("get-files-and-folders", folderPath),
  runCommand: (command, cwd, cid) =>
    ipcRenderer.invoke("run-command", command, cwd, cid),
  stopCommand: (cid) => ipcRenderer.invoke("stop-command", cid),
});
