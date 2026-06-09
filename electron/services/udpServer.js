import dgram from "dgram";
import os from "os";

const PORT = 53317;

function getLocalIp() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (
        iface.family === "IPv4" &&
        !iface.internal
      ) {
        return iface.address;
      }
    }
  }

  return null;
}

export function startUDPServer(mainWindow) {
  const server = dgram.createSocket("udp4");

  server.on("error", (err) => {
    console.error(
      "Error UDP:",
      err
    );
  });

  server.on("listening", () => {
    const address = server.address();

    console.log(
      `UDP escuchando en ${address.address}:${address.port}`
    );
  });

  server.on("message", (msg, rinfo) => {
    try {
      const message = msg.toString();

      console.log(
        `Mensaje recibido: ${message} desde ${rinfo.address}:${rinfo.port}`
      );

      if (message === "DISCOVER") {
        const device = {
          name: "PC de Luz",
          ip: getLocalIp(),
          port: 53318,
        };

        console.log(
          "Respondiendo con:",
          device
        );

        const response = JSON.stringify({
          type: "DEVICE",
          ...device,
        });

        server.send(
          response,
          rinfo.port,
          rinfo.address,
          (err) => {
            if (err) {
              console.error(
                "Error enviando respuesta UDP:",
                err
              );
            } else {
              console.log(
                "Respuesta DEVICE enviada"
              );
            }
          }
        );

        mainWindow?.webContents.send(
          "device-found",
          device
        );
      }
    } catch (error) {
      console.error(
        "Error procesando mensaje UDP:",
        error
      );
    }
  });

  server.bind(PORT);

  return server;
}