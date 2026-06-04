const { contextBridge, ipcRenderer } = require("electron");

console.log("🚀 PRELOAD EJECUTADO");

contextBridge.exposeInMainWorld("electronAPI", {
  isServerRunning: () => true,

  onDeviceFound: (callback) => {
    ipcRenderer.on("device-found", (_, device) => {
      callback(device);
    });
  },
});