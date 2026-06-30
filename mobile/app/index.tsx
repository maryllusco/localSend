import { useState, useEffect } from "react";
import useDispositivos from "../services/discovery";
import { uploadFile } from "../services/upload";
import { Alert, Button, StyleSheet, Text, View, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import Radar from "../components/Radar";
import { obtenerNombreDispositivo } from "../services/deviceName";
import { startWSServer } from "../services/wsServer";

type Dispositivo = { nombre: string; ip: string; host: string };

export default function HomeScreen() {
  const [seleccionado, setSeleccionado] = useState<Dispositivo | null>(null);
  const [file, setFile] = useState<any>(null);
  const [nombreDispositivo, setNombreDispositivo] = useState("");
  const [progreso, setProgreso] = useState<number | null>(null);
  const { dispositivos } = useDispositivos();

  useEffect(() => {
  obtenerNombreDispositivo().then(setNombreDispositivo);

  startWSServer((request, socket) => {

    Alert.alert(
      "Archivo entrante",
      `${request.senderName} quiere enviarte:\n${request.fileName}`,
      [
        {
          text: "Aceptar",
          onPress: () => {
            socket.write(
              JSON.stringify({
                type: "FILE_RESPONSE",
                accepted: true,
              })
            );
          },
        },
        {
          text: "Rechazar",
          onPress: () => {
            socket.write(
              JSON.stringify({
                type: "FILE_RESPONSE",
                accepted: false,
              })
            );
          },
        },
      ]
    );
  });
}, []);

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) setFile(result.assets[0]);
  }

  async function sendFile() {
    try {
      if (!seleccionado) { Alert.alert("Error", "Tocá un dispositivo primero"); return; }
      if (!file) { Alert.alert("Error", "Elegí un archivo"); return; }

      setProgreso(0);
      const intervalo = setInterval(() => {
        setProgreso((prev) => (prev === null || prev >= 90 ? prev : prev + 10));
      }, 200);

      await uploadFile(seleccionado.ip, file);

      clearInterval(intervalo);
      setProgreso(100);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("✅ Éxito", "Archivo enviado a " + seleccionado.nombre);
      setTimeout(() => setProgreso(null), 2000);
    } catch (error) {
  setProgreso(null);
  console.log("❌ ERROR REAL:", error);
  Alert.alert("Error", "No se pudo enviar");
}
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>LocalSend</Text>
      <Text style={styles.alias}>📱 {nombreDispositivo}</Text>

      <Radar
        dispositivos={dispositivos}
        onSeleccionar={setSeleccionado}
        seleccionado={seleccionado?.ip ?? ""}
      />

      <Button title="Elegir archivo" onPress={pickFile} />

      {file && (
        <View style={styles.previewContainer}>
          <Text style={styles.fileName} numberOfLines={1}>📄 {file.name}</Text>
          {progreso !== null && (
            <View style={styles.barraFondo}>
              <View style={[styles.barraProgreso, { width: `${progreso}%` }]} />
            </View>
          )}
          {progreso !== null && (
            <Text style={styles.progresoTexto}>
              {progreso === 100 ? "✅ Enviado" : `${progreso}%`}
            </Text>
          )}
        </View>
      )}

      <View style={{ height: 20 }} />
      <Button title="Enviar" onPress={sendFile} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8, color: "white" },
  alias: { color: "gray", marginBottom: 24, fontSize: 14 },
  previewContainer: {
    marginTop: 15, width: "100%",
    padding: 12, backgroundColor: "#1a1a1a", borderRadius: 10,
  },
  fileName: { color: "white", fontSize: 13, marginBottom: 6 },
  barraFondo: { height: 8, backgroundColor: "#333", borderRadius: 4, overflow: "hidden" },
  barraProgreso: { height: "100%", backgroundColor: "#00ff88", borderRadius: 4 },
  progresoTexto: { color: "#00ff88", fontSize: 12, marginTop: 4 },
});