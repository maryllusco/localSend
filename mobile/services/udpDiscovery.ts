import dgram from "react-native-udp";
import { Buffer } from "buffer";
import * as Network from "expo-network";

const PORT = 53317;

export function startUDPListener(deviceName, onDeviceFound) {
  const socket = dgram.createSocket({ type: "udp4" });

  socket.bind(PORT, () => {
    console.log("📡 UDP mobile listo");
    socket.setBroadcast(true);

    socket.on("message", async (msg, rinfo) => {
      try {
        const text = msg.toString();
        console.log("UDP recibido:", text, "de", rinfo.address);

        // Responder al DISCOVER del desktop
        if (text === "DISCOVER") {

  const myIp = await Network.getIpAddressAsync();

  const response = JSON.stringify({
    type: "DEVICE",
    name: deviceName,
    ip: myIp,
    port: 53318,
  });

  const buf = Buffer.from(response);

  socket.send(
    buf,
    0,
    buf.length,
    rinfo.port,
    rinfo.address
  );

  console.log("✅ Respondí al desktop:", deviceName, myIp);

  return;
}

        // Recibir respuesta DEVICE del desktop
        const data = JSON.parse(text);
        if (data.type === "DEVICE") {
          onDeviceFound(data);
        }
      } catch (e) {
        console.log("Error UDP:", e);
      }
    });
  });

  return socket;
}