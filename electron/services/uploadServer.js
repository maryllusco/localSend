import fs from "fs";
import net from "net";

export function uploadFile(filePath, targetIp) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    const fileName = filePath.split("/").pop();
    const fileSize = fs.statSync(filePath).size;

    client.connect(53318, targetIp, () => {
      console.log("📤 Conectado al mobile, enviando FILE_REQUEST...");

      client.write(JSON.stringify({
        type: "FILE_REQUEST",
        senderName: "LocalSend Desktop",
        fileName,
        fileSize,
      }));
    });

    client.on("data", (data) => {
      try {
        const response = JSON.parse(data.toString());
        if (response.type === "FILE_RESPONSE" && response.accepted) {
          console.log("✅ Aceptado, enviando archivo...");
          const fileData = fs.readFileSync(filePath).toString("base64");
          client.write(JSON.stringify({
            type: "FILE_TRANSFER",
            fileName,
            fileData,
          }));
          client.destroy();
          resolve();
        } else {
          console.log("❌ Rechazado");
          client.destroy();
          reject(new Error("Transferencia rechazada"));
        }
      } catch (e) {
        reject(e);
      }
    });

    client.on("error", reject);
  });
}