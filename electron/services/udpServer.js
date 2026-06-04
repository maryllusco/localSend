import dgram from "dgram";

const PORT = 53317;

export function startUDPServer(mainWindow) {
  const server = dgram.createSocket("udp4");

  server.on("listening", () => {
    const address = server.address();

    console.log(
      `UDP escuchando en ${address.address}:${address.port}`
    );
    setTimeout(() => {
  mainWindow?.webContents.send(
    "device-found",
    {
      name: "Samsung Test",
      ip: "192.168.1.50",
      port: 8080,
    }
  );
}, 3000);
  });

  server.on("message", (msg, rinfo) => {
    const message = msg.toString();

    console.log(
      `Mensaje recibido: ${message}`
    );

    if (message === "DISCOVER") {

      const device = {
        name: "PC de Luz",
        ip: rinfo.address,
        port: 8080,
      };

      const response = JSON.stringify({
        type: "DEVICE",
        ...device,
      });

      server.send(
        response,
        rinfo.port,
        rinfo.address
      );

      mainWindow?.webContents.send(
        "device-found",
        device
      );
    }
  });

  server.bind(PORT);

  return server;
}