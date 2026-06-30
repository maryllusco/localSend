import { WebSocketServer } from "ws";
import { showIncomingNotification } from "../ipc/ipcHandlers.js";

const WS_PORT = 53318;

export function startWSServer(mainWindow) {
  const wss = new WebSocketServer({
    port: WS_PORT,
  });

  console.log(
    `WebSocket escuchando en puerto ${WS_PORT}`
  );


  wss.on("connection", (socket, req) => {
    console.log(
      "Cliente conectado:",
      req.socket.remoteAddress
    );

    socket.on("message", (data) => {
      try {
        const message = JSON.parse(
          data.toString()
        );

        console.log(
          "Mensaje WS:",
          message
        );

        switch (message.type) {
          case "FILE_REQUEST":
  mainWindow?.webContents.send("incoming-request", message);
  showIncomingNotification(message);
            break;

          case "FILE_RESPONSE":
            mainWindow?.webContents.send(
              "transfer-response",
              message
            );
            break;
        }
      } catch (error) {
        console.error(
          "Error WS:",
          error
        );
      }
    });

    socket.on("close", () => {
      console.log(
        "Cliente desconectado"
      );
    });

    socket.on("error", (error) => {
      console.error(
        "Error socket:",
        error
      );
    });
  });

  return wss;
}