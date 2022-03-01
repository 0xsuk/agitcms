const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadConfig: () => ipcRenderer.invoke("load-config"),
  updateConfig: (newConfig) => ipcRenderer.invoke("update-config", newConfig),
  saveFile: (content, filePath) =>
    ipcRenderer.invoke("save-file", content, filePath),
  openFile: () => ipcRenderer.invoke("open-file"),
});
