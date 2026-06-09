import dgram from "react-native-udp";
import { Buffer } from "buffer";

const PORT = 53317;

export function discoverDevices(onDeviceFound) {
  const socket = dgram.createSocket({
    type: "udp4",
  });

  socket.bind(PORT, () => {
    console.log("UDP listo");

    socket.setBroadcast(true);

    socket.on("message", (msg) => {
      try {
        console.log("Respuesta:", msg.toString());

        const data = JSON.parse(msg.toString());

        if (data.type === "DEVICE") {
          onDeviceFound(data);
        }
      } catch (e) {
        console.log("Error parseando:", e);
      }
    });

    const message = Buffer.from("DISCOVER");

    console.log("Enviando DISCOVER...");

    socket.send(
      message,
      0,
      message.length,
      PORT,
      "255.255.255.255"
    );
  });

  return socket;
}