const {
  contextBridge,
  ipcRenderer,
} = require("electron");

console.log("🚀 PRELOAD EJECUTADO");

contextBridge.exposeInMainWorld(
  "electronAPI",
  {
    isServerRunning: () => true,

    onDeviceFound: (callback) => {
      ipcRenderer.on(
        "device-found",
        (_, device) => callback(device)
      );
    },

    onIncomingRequest: (callback) => {
      ipcRenderer.on(
        "incoming-request",
        (_, data) => callback(data)
      );
    },

    onTransferResponse: (callback) => {
      ipcRenderer.on(
        "transfer-response",
        (_, data) => callback(data)
      );
    },
  }
);