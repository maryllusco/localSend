import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import * as Haptics from "expo-haptics";

const SIZE = Dimensions.get("window").width * 0.6;

type Dispositivo = { nombre: string; ip: string; host: string };
type Props = {
  dispositivos: Dispositivo[];
  onSeleccionar: (d: Dispositivo) => void;
  seleccionado: string;
};

export default function Radar({ dispositivos, onSeleccionar, seleccionado }: Props) {
  const rot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rot, { toValue: 1, duration: 3000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = rot.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={styles.container}>
      <View style={styles.radar}>
        <View style={[styles.circulo, { width: SIZE, height: SIZE }]} />
        <View style={[styles.circulo, { width: SIZE * 0.66, height: SIZE * 0.66 }]} />
        <View style={[styles.circulo, { width: SIZE * 0.33, height: SIZE * 0.33 }]} />
        <Animated.View style={[styles.linea, { transform: [{ rotate: spin }] }]} />
        <View style={styles.centro} />
      </View>

      <Text style={styles.estado}>
        {dispositivos.length === 0 ? "Escaneando..." : `${dispositivos.length} encontrado(s)`}
      </Text>

      {dispositivos.map((d) => (
        <TouchableOpacity
          key={d.ip}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onSeleccionar(d); }}
          style={[styles.item, seleccionado === d.ip && styles.itemSeleccionado]}
        >
          <Text style={styles.nombre}>💻 {d.nombre}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 20 },
  radar: { width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  circulo: { position: "absolute", borderRadius: 999, borderWidth: 1, borderColor: "#00ff88", opacity: 0.3 },
  linea: { position: "absolute", width: SIZE / 2, height: 2, backgroundColor: "#00ff88", left: SIZE / 2, opacity: 0.6, transformOrigin: "left center" },
  centro: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#00ff88" },
  estado: { color: "gray", marginBottom: 10 },
  item: { width: "100%", padding: 14, borderWidth: 1, borderColor: "#333", borderRadius: 10, marginBottom: 8 },
  itemSeleccionado: { borderColor: "#00ff88", backgroundColor: "#0a1a0f" },
  nombre: { color: "white", fontWeight: "bold" },
  ip: { color: "gray", fontSize: 12 },
});