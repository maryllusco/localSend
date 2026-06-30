import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

export function sendFileRequest(ip: string, fileName: string) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://${ip}:53318`);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "FILE_REQUEST",
        senderName: "Mi Celular",
        fileName,
      }));
      resolve(ws);
    };

    ws.onerror = (error) => reject(error);
  });
}

export function listenForIncomingFiles(ip: string) {
  const ws = new WebSocket(`ws://${ip}:53318`);

  ws.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);

      if (message.type === "FILE_TRANSFER") {
        const { fileName, fileData } = message;
        const path = FileSystem.documentDirectory + fileName;

        await FileSystem.writeAsStringAsync(path, fileData, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Alert.alert("📥 Archivo recibido", fileName);
        console.log("✅ Guardado en:", path);
      }
    } catch (e) {
      console.error("Error recibiendo archivo:", e);
    }
  };

  ws.onerror = (err) => console.error("WS error:", err);
  return ws;
}