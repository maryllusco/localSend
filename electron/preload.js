const {
  contextBridge,
  ipcRenderer,
} = require("electron");

console.log("🚀 PRELOAD EJECUTADO");

contextBridge.exposeInMainWorld(
  "electronAPI",
  {
    isServerRunning: () => true,

    // Selector nativo de archivos
    selectFile: () =>
      ipcRenderer.invoke("select-file"),

    // Dispositivos encontrados
    onDeviceFound: (callback) => {
      ipcRenderer.on(
        "device-found",
        (_, device) => callback(device)
      );
    },

    // Solicitud de transferencia
    onIncomingRequest: (callback) => {
      ipcRenderer.on(
        "incoming-request",
        (_, data) => callback(data)
      );
    },

    // Respuesta a transferencia
    onTransferResponse: (callback) => {
      ipcRenderer.on(
        "transfer-response",
        (_, data) => callback(data)
      );
    },

    // Archivo recibido
    onFileReceived: (callback) => {
      ipcRenderer.on(
        "file-received",
        (_, data) => callback(data)
      );
    },

    // Solicitar envío de archivo
    sendFile: (
      device,
      fileInfo
    ) => {
      ipcRenderer.send(
        "send-file",
        {
          device,
          fileInfo,
        }
      );
    },
  }
);