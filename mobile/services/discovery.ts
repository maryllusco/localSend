// services/discovery.js

import Zeroconf from "react-native-zeroconf";

// export function discoverDevices(onDeviceFound) {
//   zeroconf.on("resolved", (service) => {
//     onDeviceFound({
//       name: service.name,
//       ip: service.addresses?.[0],
//       port: service.port,
//     });
//   });

//   zeroconf.scan("localsend", "tcp", "local.");

//   return zeroconf;
// }

import { useEffect, useState } from "react";

type Dispositivo = {
  nombre: string;
  ip: string;
  host: string;
};

const zeroconf = new Zeroconf();
const useDispositivos = () => {
  const [dispositivos, gestionarDispositivos] = useState<Dispositivo[]>([]);

  console.log("Instancia:", zeroconf);

  useEffect(() => {
    zeroconf.scan("http", "tcp", "local.");
    zeroconf.on("resolved", (service) => {
      console.log("Found service:", service.name);
      console.log("IP addresses:", service.addresses);
      console.log("Port:", service.port);
      gestionarDispositivos([
        ...dispositivos,
        {
          nombre: service.name,
          ip: service.addresses[0],
          host: service.host,
        },
      ]);
    });
    return () => {
      zeroconf.stop();
    };
  });
  return {
    dispositivos,
  };
};

export default useDispositivos;
