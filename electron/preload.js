const { contextBridge } = require("electron");

console.log("🚀 PRELOAD EJECUTADO");

contextBridge.exposeInMainWorld("electronAPI", {
  isServerRunning: () => true,
});