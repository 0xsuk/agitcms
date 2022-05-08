const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  confirm: (message) => ipcRenderer.invoke("confirm", message),
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
  createFolder: (folderPath) => ipcRenderer.invoke("create-folder", folderPath),
  createFile: (filePath, doc, frontmatter) =>
    ipcRenderer.invoke("create-file", filePath, doc, frontmatter),
  removeFile: (filePath) => ipcRenderer.invoke("remove-file", filePath),
  removeFolder: (folderPath) => ipcRenderer.invoke("remove-folder", folderPath),
  runCommand: (command, cwd, cid) =>
    ipcRenderer.invoke("run-command", command, cwd, cid),
  stopCommand: (cid) => ipcRenderer.invoke("stop-command", cid),
  onShellProcessLine: (callback) =>
    ipcRenderer.on("shellprocess-line", callback),
});
