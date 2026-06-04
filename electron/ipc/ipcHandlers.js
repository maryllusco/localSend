import { ipcMain } from "electron";

export function registerIPCHandlers() {

  ipcMain.on(
    "send-file",
    (event, data) => {

      console.log(
        "Enviar archivo solicitado:",
        data
      );

    }
  );

}