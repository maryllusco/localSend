import { useState } from "react";

export function useDevices() {
  const [devices, setDevices] = useState([]);

  const addDevice = (device) => {
    setDevices((prev) => {
      if (prev.some((d) => d.ip === device.ip)) return prev;
      return [...prev, device];
    });
  };

  return { devices, addDevice };
}