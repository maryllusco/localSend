import http from "http";
import fs from "fs";
import path from "path";
import os from "os";

const HTTP_PORT = 53319;

export function startHTTPServer(mainWindow) {
  const server = http.createServer(
    (req, res) => {
      if (
        req.method === "POST" &&
        req.url === "/upload"
      ) {
        const fileName =
          req.headers["x-file-name"] ||
          "archivo.bin";

        const downloadFolder = path.join(
          os.homedir(),
          "Downloads"
        );

        const filePath = path.join(
          downloadFolder,
          fileName
        );

        console.log(
          "Recibiendo archivo:",
          fileName
        );

        const writeStream =
          fs.createWriteStream(filePath);

        req.pipe(writeStream);

        writeStream.on("finish", () => {
          console.log(
            "Archivo guardado:",
            filePath
          );

          mainWindow?.webContents.send(
            "file-received",
            {
              fileName,
              filePath,
            }
          );

          res.writeHead(200);
          res.end("OK");
        });

        writeStream.on("error", (err) => {
          console.error(err);

          res.writeHead(500);
          res.end("ERROR");
        });

        return;
      }

      res.writeHead(404);
      res.end();
    }
  );

  server.listen(HTTP_PORT, () => {
    console.log(
      `HTTP escuchando en ${HTTP_PORT}`
    );
  });

  return server;
}