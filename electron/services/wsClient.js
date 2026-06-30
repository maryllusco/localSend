import net from "net";
import fs from "fs";
import { alias } from "./alias.js";

export function sendFileRequest(ip, file) {
  console.log("Enviando solicitud TCP a:", ip);

  const client = new net.Socket();
  const fileName = file.name || file.path.split("/").pop();

  client.connect(53318, ip, () => {
    console.log("✅ Conectado por TCP al mobile");

    const fileData = fs.readFileSync(file.path).toString("base64");

    // Primero enviamos FILE_REQUEST
    client.write(JSON.stringify({
      type: "FILE_REQUEST",
      senderName: alias,
      fileName,
      fileSize: fs.statSync(file.path).size,
    }));

    // Cuando recibamos FILE_RESPONSE aceptado, enviamos el archivo
    client.once("data", (data) => {
      try {
        const response = JSON.parse(data.toString());
        console.log("Respuesta mobile:", response);

        if (response.type === "FILE_RESPONSE" && response.accepted) {
          console.log("✅ Aceptado, enviando archivo...");

          const payload = JSON.stringify({
            type: "FILE_TRANSFER",
            fileName,
            fileData,
          });

          // El callback de write() recién se dispara cuando el dato
          // efectivamente salió por el socket. Ahí, y no antes,
          // cerramos la conexión con end() (cierre prolijo, espera
          // a que termine de drenar el buffer) en vez de destroy()
          // (corte abrupto que puede cortar el archivo a la mitad).
          client.write(payload, () => {
            console.log("✅ Archivo enviado completo, cerrando conexión");
            client.end();
          });
        } else {
          console.log("❌ Rechazado");
          client.destroy();
        }
      } catch (e) {
        console.error("Error:", e);
        client.destroy();
      }
    });
  });

  client.on("error", (err) => console.error("Error TCP:", err));
  client.on("close", () => console.log("Conexión TCP cerrada"));

  return client;
}