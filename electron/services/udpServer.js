import dgram from "dgram";
import os from "os";
import { alias } from "./alias.js";

const PORT = 53317;

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return null;
}

export function startUDPServer(mainWindow) {
  const server = dgram.createSocket({ type: "udp4", reuseAddr: true });

  server.on("error", (err) => console.error("Error UDP:", err));

  server.on("listening", () => {
    server.setBroadcast(true);
    console.log(`UDP escuchando en 0.0.0.0:${PORT}`);

    // Broadcast cada 3 segundos para descubrir dispositivos
    setInterval(() => {
      const msg = Buffer.from("DISCOVER");
      server.send(msg, 0, msg.length, PORT, "255.255.255.255");
    }, 3000);
  });

  server.on("message", (msg, rinfo) => {
    try {
      const text = msg.toString();
      const localIp = getLocalIp();

      // Ignorar mensajes propios
      if (rinfo.address === localIp) return;

      // Responder a DISCOVER con nuestra info
      if (text === "DISCOVER") {
        const device = { name: alias, ip: localIp, port: 53318 };
        const response = JSON.stringify({ type: "DEVICE", ...device });
        server.send(Buffer.from(response), rinfo.port, rinfo.address);
        console.log("Respondí DISCOVER a:", rinfo.address);
        return;
      }

      // Recibir respuesta DEVICE de otro dispositivo (el celular)
      try {
        const parsed = JSON.parse(text);
        if (parsed.type === "DEVICE") {
          console.log("📱 Dispositivo encontrado:", parsed.name, parsed.ip);
          mainWindow?.webContents.send("device-found", {
            name: parsed.name,
            ip: parsed.ip,
            port: parsed.port,
          });
        }
      } catch (_) {}

    } catch (error) {
      console.error("Error UDP:", error);
    }
  });

  server.bind(PORT);
  return server;
}