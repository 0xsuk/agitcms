const { contextBridge, ipcRenderer, webFrame } = require("electron");
const { Titlebar, Color } = require("custom-electron-titlebar");

window.addEventListener("DOMContentLoaded", () => {
  // Title bar implemenation
  new Titlebar({
    menu: null,
    backgroundColor: Color.fromHex("#131820"),
  });
});

contextBridge.exposeInMainWorld("electronAPI", {
  webFrames: {
    getZoomFactor: () => webFrame.getZoomFactor(),
    setZoomFactor: (int) => webFrame.setZoomFactor(int),
  },
  confirm: (message) => ipcRenderer.invoke("confirm", message),
  readConfig: () => ipcRenderer.invoke("read-config"),
  updateConfig: (newConfig) => ipcRenderer.invoke("update-config", newConfig),
  saveFile: (filePath, content) =>
    ipcRenderer.invoke("save-file", filePath, content),
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  renameFileOrFolder: (oldPath, newPath) =>
    ipcRenderer.invoke("rename-file-or-folder", oldPath, newPath),
  getFolderPath: (defaultPath) =>
    ipcRenderer.invoke("get-folder-path", defaultPath),
  getFilesAndFolders: (folderPath) =>
    ipcRenderer.invoke("get-files-and-folders", folderPath),
  getMediaFile: (staticPath, publicPath) =>
    ipcRenderer.invoke("get-media-file", staticPath, publicPath),
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
  saveImage: (filePath, binary) =>
    ipcRenderer.invoke("save-image", filePath, binary),
  onShellData: (callback) => ipcRenderer.on("shell-data", callback),
  onShellExit: (callback) => ipcRenderer.on("shell-exit", callback),
});
