import WebSocket from "ws";

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

    socket.send(
      JSON.stringify({
        type: "FILE_REQUEST",
        senderName: "PC de Luz",
        fileName: file.name,
        fileSize: file.size,
      })
    );
  });

  socket.on("message", (data) => {
    console.log(
      "Respuesta:",
      data.toString()
    );
  });

  socket.on("error", (error) => {
    console.error(error);
  });

  return socket;
}