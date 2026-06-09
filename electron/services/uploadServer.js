import fs from "fs";
import http from "http";

export function uploadFile(
  filePath,
  targetIp
) {
  return new Promise((resolve, reject) => {
    const stats = fs.statSync(filePath);

    const req = http.request(
      {
        hostname: targetIp,
        port: 53319,
        path: "/upload",
        method: "POST",
        headers: {
          "Content-Length": stats.size,
          "x-file-name":
            filePath.split("/").pop(),
        },
      },
      (res) => {
        resolve();
      }
    );

    req.on("error", reject);

    const readStream =
      fs.createReadStream(filePath);

    readStream.pipe(req);
  });
}