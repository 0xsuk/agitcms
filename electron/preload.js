const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadConfig: () => ipcRenderer.invoke("load-config"),
  saveNewFile: (content) => ipcRenderer.invoke("save-new-file", content),
});
