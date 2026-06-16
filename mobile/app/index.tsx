import { useState } from "react";
import useDispositivos from "../services/discovery";
import { uploadFile } from "../services/upload";
// import { sendFileRequest } from "../services/wsClient";

import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

import * as DocumentPicker from "expo-document-picker";

export default function HomeScreen() {
  const [ip, setIp] = useState("");
  const [file, setFile] = useState<any>(null);

  const { dispositivos } = useDispositivos();

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync();

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  async function sendFile() {
    try {
      if (!ip) {
        Alert.alert("Error", "No se encontró ninguna PC");
        return;
      }

      if (!file) {
        Alert.alert("Error", "Elegí un archivo");
        return;
      }

      await sendFileRequest(ip, file.name);

      await uploadFile(ip, file);

      Alert.alert("Éxito", "Archivo enviado");
    } catch (error) {
      console.error(error);

      Alert.alert("Error", "No se pudo enviar");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LocalSend Mobile</Text>

      <Text
        style={{
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        Dispositivos cercanos
      </Text>
      {dispositivos.map((dispositivo) => {
        return (
          <Text style={{ color: "white" }} key={dispositivo.ip}>
            {dispositivo.ip}
          </Text>
        );
      })}
      <TextInput
        placeholder="IP de la PC"
        value={ip}
        onChangeText={setIp}
        style={styles.input}
      />

      <Button title="Elegir archivo" onPress={pickFile} />

      {file ? <Text style={styles.file}>{file.name}</Text> : null}

      <View style={{ height: 20 }} />

      <Button title="Enviar" onPress={sendFile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
  },

  file: {
    marginTop: 15,
    marginBottom: 15,
    textAlign: "center",
  },
});
