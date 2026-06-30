const { contextBridge, ipcRenderer } = require("electron");

console.log("🚀 PRELOAD EJECUTADO");

contextBridge.exposeInMainWorld("electronAPI", {
  isServerRunning: () => true,

  selectFile: () => ipcRenderer.invoke("select-file"),

  onDeviceFound: (callback) => {
    ipcRenderer.on("device-found", (_, device) => callback(device));
  },

  onIncomingRequest: (callback) => {
    ipcRenderer.on("incoming-request", (_, data) => callback(data));
  },

  onTransferResponse: (callback) => {
    ipcRenderer.on("transfer-response", (_, data) => callback(data));
  },

  onFileReceived: (callback) => {
    ipcRenderer.on("file-received", (_, data) => callback(data));
  },

  sendFile: (device, fileInfo) => {
    ipcRenderer.send("send-file", { device, fileInfo });
  },

  acceptTransfer: () => ipcRenderer.send("accept-transfer"),
  rejectTransfer: () => ipcRenderer.send("reject-transfer"),
});