import Zeroconf from "react-native-zeroconf";
import { useEffect, useState, useRef } from "react";
import { startUDPListener } from "./udpDiscovery";
import { obtenerNombreDispositivo } from "./deviceName";

type Dispositivo = {
  nombre: string;
  ip: string;
  host: string;
  lastSeen: number;
};

const useDispositivos = () => {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const zeroconfRef = useRef(new Zeroconf());

  const agregarDispositivo = (
  nombre: string,
  ip: string,
  host: string
) => {
  setDispositivos((prev) => {
    const ahora = Date.now();

    const existe = prev.find((d) => d.ip === ip);

    if (existe) {
      return prev.map((d) =>
        d.ip === ip
          ? { ...d, lastSeen: ahora }
          : d
      );
    }

    return [
      ...prev,
      {
        nombre,
        ip,
        host,
        lastSeen: ahora,
      },
    ];
  });
};

  useEffect(() => {
    const zeroconf = zeroconfRef.current;

    zeroconf.on("start", () => console.log("🔍 Escaneo iniciado"));
    zeroconf.on("stop", () => console.log("⏹ Escaneo detenido"));
    zeroconf.on("error", (err) => console.error("❌ Error:", err));
    zeroconf.on("resolved", (service) => {
      console.log("✅ Zeroconf encontrado:", service.name);
      agregarDispositivo(service.name, service.addresses[0], service.host);
    });

    zeroconf.scan("localsend", "tcp", "local.");

    let udpSocket: any = null;
    obtenerNombreDispositivo().then((nombre) => {
      udpSocket = startUDPListener(nombre, (device: any) => {
        agregarDispositivo(device.name, device.ip, device.ip);
      });
    });
    const ttl = setInterval(() => {
  const ahora = Date.now();

  setDispositivos((prev) =>
    prev.filter(
      (d) => ahora - d.lastSeen < 7000
    )
  );
}, 1000);

    return () => {
      clearInterval(ttl);
      zeroconf.stop();
      zeroconf.removeDeviceListeners();
      udpSocket?.close();
      
    };
    
  }, []);

  return { dispositivos };
};

export default useDispositivos;