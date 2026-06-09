export function sendFileRequest(
  ip: string,
  fileName: string
) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(
      `ws://${ip}:53318`
    );

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "FILE_REQUEST",
          senderName: "Mi Celular",
          fileName,
        })
      );

      resolve(ws);
    };

    ws.onerror = (error) => {
      reject(error);
    };
  });
}