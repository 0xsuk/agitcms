const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  confirm: (message) => ipcRenderer.invoke("confirm", message),
  readConfig: () => ipcRenderer.invoke("read-config"),
  updateConfig: (newConfig) => ipcRenderer.invoke("update-config", newConfig),
  saveFile: (filePath, content) =>
    ipcRenderer.invoke("save-file", filePath, content),
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
  typeCommand: (id, cmd) => ipcRenderer.invoke("type-command", id, cmd),
  spawnShell: (cwd, shell) => ipcRenderer.invoke("spawn-shell", cwd, shell),
  resizeShell: (id, size) => ipcRenderer.invoke("resize-shell", id, size),
  startMediaServer: (staticPath, publicPath) =>
    ipcRenderer.invoke("start-media-server", staticPath, publicPath),
  onShellData: (callback) => ipcRenderer.on("shell-data", callback),
  onShellExit: (callback) => ipcRenderer.on("shell-exit", callback),
});
