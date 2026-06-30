import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

const PORT = 53317;

export async function recibirArchivo(request: any) {
  try {
    const fileName = request.headers["x-file-name"] || "archivo.bin";
    const path = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(path, request.body, {
      encoding: FileSystem.EncodingType.Base64,
    });

    Alert.alert("📥 Archivo recibido", `${fileName} guardado correctamente`);
    console.log("✅ Archivo guardado en:", path);
    return path;
  } catch (error) {
    console.error("Error guardando archivo:", error);
    throw error;
  }
}