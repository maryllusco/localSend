import WebSocket from "ws";
import fs from "fs";
import { uploadFile } from "./uploadServer.js";

export function sendFileRequest(
  ip,
  file
) {
  const socket = new WebSocket(
    `ws://${ip}:53318`
  );

  socket.on("open", () => {

    console.log(
      "Conectado al receptor"
    );

    const stats =
      fs.statSync(file.path);

    socket.send(
      JSON.stringify({
        type: "FILE_REQUEST",
        senderName: "PC de Luz",
        fileName: file.name,
        fileSize: stats.size,
      })
    );
  });

  socket.on("message", async (data) => {

    const message =
      JSON.parse(data.toString());

    console.log(
      "Respuesta:",
      message
    );

    if (
      message.type === "FILE_RESPONSE" &&
      message.accepted
    ) {

      console.log(
        "Transferencia aceptada"
      );

      try {

        await uploadFile(
          file.path,
          ip
        );

        console.log(
          "Archivo enviado correctamente"
        );

      } catch (error) {

        console.error(
          "Error enviando archivo:",
          error
        );

      }
    }
  });

  socket.on("error", (error) => {
    console.error(error);
  });

  return socket;
}