import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import TcpSocket from "react-native-tcp-socket";

let server: any = null;
let expectedFileSize = 0;

function esImagenOVideo(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const imagenes = ["jpg", "jpeg", "png", "gif", "webp", "heic"];
  const videos = ["mp4", "mov", "avi", "mkv"];
  return imagenes.includes(ext) || videos.includes(ext);
}

async function guardarArchivoRecibido(fileName: string, fileDataBase64: string) {
  // 1. Lo escribimos primero en el almacenamiento privado de la app
  // (expo-file-system necesita un archivo real en disco antes de
  // poder pasarlo a la galería o compartirlo).
  const tempPath = FileSystem.cacheDirectory + fileName;

  await FileSystem.writeAsStringAsync(tempPath, fileDataBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // 2a. Si es foto o video, va a la Galería (es lo único que admite
  // MediaLibrary).
  if (esImagenOVideo(fileName)) {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      throw new Error(
        "Permiso de galería denegado: el archivo quedó solo en el almacenamiento interno de la app."
      );
    }

    const asset = await MediaLibrary.createAssetAsync(tempPath);

    const album = await MediaLibrary.getAlbumAsync("LocalSend");
    if (album) {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    } else {
      await MediaLibrary.createAlbumAsync("LocalSend", asset, false);
    }

    return { uri: asset.uri, tipo: "galeria" as const };
  }

  // 2b. Para cualquier otro archivo (PDF, Word, ZIP, etc.) no hay
  // "galería" en Android: lo dejamos guardado y ofrecemos el panel
  // nativo de Compartir/Abrir con, para que la usuaria elija una app
  // (lector de PDF, Drive, WhatsApp, etc.).
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(tempPath);
  }

  return { uri: tempPath, tipo: "archivo" as const };
}

export function startWSServer() {
  if (server) return server;

  server = TcpSocket.createServer((socket: any) => {
    let chunks: string[] = [];

    socket.on("data", (data: any) => {
      chunks.push(data.toString());
      const buffer = chunks.join("");

      console.log(
        "📦 Chunk recibido, total chunks:",
        chunks.length,
        "tamaño:",
        buffer.length
      );

      if (!buffer.endsWith("}")) return;

      let message: any;

      try {
        message = JSON.parse(buffer);
      } catch (e) {
        return;
      }

      chunks = [];
      console.log("📦 Mensaje recibido:", message.type);

      if (message.type === "FILE_REQUEST") {
         expectedFileSize = message.fileSize;
        Alert.alert(
          "📥 Archivo entrante",
          `${message.senderName} quiere enviarte:\n${message.fileName}`,
          [
            {
              text: "Aceptar",
              onPress: () => {
                socket.write(
                  JSON.stringify({ type: "FILE_RESPONSE", accepted: true })
                );
              },
            },
            {
              text: "Rechazar",
              onPress: () => {
                socket.write(
                  JSON.stringify({ type: "FILE_RESPONSE", accepted: false })
                );
              },
            },
          ]
        );
        return;
      }

      if (message.type === "FILE_TRANSFER") {
        console.log("💾 Guardando archivo:", message.fileName);

        guardarArchivoRecibido(message.fileName, message.fileData)
  .then(async ({ uri, tipo }) => {

    const info = await FileSystem.getInfoAsync(uri);

    if (info.exists) {

      if (info.size === expectedFileSize) {

        console.log("✅ Integridad correcta");

        Alert.alert(
          "✅ Transferencia completa",
          `El archivo se recibió correctamente.\n\nTamaño: ${info.size} bytes`
        );

      } else {

        console.log("❌ Tamaño distinto");

        Alert.alert(
          "⚠ Archivo incompleto",
          `Esperado: ${expectedFileSize} bytes\nRecibido: ${info.size} bytes`
        );

      }

    }

    console.log("Guardado:", uri);

  })
          .catch((err) => {
            console.error("❌ Error guardando archivo:", err);
            Alert.alert(
              "❌ No se pudo guardar el archivo",
              err.message ?? String(err)
            );
          });
      }
    });

    socket.on("error", (err: any) => console.log("Socket error:", err));
    socket.on("close", () => {
      console.log("Cliente desconectado");
      chunks = [];
    });
  });

  server.listen({ host: "0.0.0.0", port: 53318 }, () => {
    console.log("✅ TCP Server escuchando en 53318");
  });

  return server;
}