import { ipcMain, dialog } from "electron";
import { sendFileRequest } from "../services/wsClient.js";

export function registerIPCHandlers() {

  ipcMain.handle(
    "select-file",
    async () => {
      const result =
        await dialog.showOpenDialog({
          properties: ["openFile"],
        });

      if (
        result.canceled ||
        result.filePaths.length === 0
      ) {
        return null;
      }

      return result.filePaths[0];
    }
  );

  ipcMain.on(
    "send-file",
    (event, data) => {

      console.log(
        "Enviar archivo solicitado:",
        data
      );
      console.log("LLAMANDO sendFileRequest");

      sendFileRequest(
        data.device.ip,
        data.fileInfo
      );
    }
  );
}