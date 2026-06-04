import dgram from "dgram";

const PORT = 53317;

export function startUDPServer() {
  const server = dgram.createSocket("udp4");

  server.on("listening", () => {
    const address = server.address();

    console.log(
      `UDP escuchando en ${address.address}:${address.port}`
    );
  });

  server.on("message", (msg, rinfo) => {
    const message = msg.toString();

    console.log(
      `Mensaje recibido: ${message} desde ${rinfo.address}`
    );

    if (message === "DISCOVER") {
      const response = JSON.stringify({
        type: "DEVICE",
        name: "PC de Luz",
        port: 8080,
      });

      server.send(
        response,
        rinfo.port,
        rinfo.address
      );
    }
  });

  server.bind(PORT);

  return server;
}