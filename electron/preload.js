const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadConfig: () => ipcRenderer.invoke("load-config"),
  saveFile: (content, filePath) => ipcRenderer.invoke("save-file", content, filePath),
  openFile: () => ipcRenderer.invoke("open-file"),
});
