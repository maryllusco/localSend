import { ipcMain, dialog, Notification } from "electron";
import { sendFileRequest } from "../services/wsClient.js";

let mainWindowRef = null;

export function registerIPCHandlers(mainWindow) {
  mainWindowRef = mainWindow;

  ipcMain.handle("select-file", async () => {
    const result = await dialog.showOpenDialog({ properties: ["openFile"] });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });

  ipcMain.on("send-file", (event, data) => {
    console.log("Enviar archivo solicitado:", data);
    sendFileRequest(data.device.ip, data.fileInfo);
  });

  ipcMain.on("accept-transfer", () => {
    mainWindowRef?.webContents.send("transfer-response", { accepted: true });
  });

  ipcMain.on("reject-transfer", () => {
    mainWindowRef?.webContents.send("transfer-response", { accepted: false });
  });
}

export async function showIncomingNotification(request) {
  const { response } = await dialog.showMessageBox(mainWindowRef, {
    type: "question",
    buttons: ["Aceptar", "Rechazar"],
    defaultId: 0,
    cancelId: 1,
    title: "📥 Transferencia entrante",
    message: `${request.senderName} quiere enviarte:`,
    detail: `📄 ${request.fileName}`,
  });

  const accepted = response === 0;
  mainWindowRef?.webContents.send("transfer-response", { accepted });
}