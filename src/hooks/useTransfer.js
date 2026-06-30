import { useState, useRef } from "react";

export function useTransfer() {
  const [transfer, setTransfer] = useState(null);
  const intervalRef = useRef(null);

  const startTransfer = (fileName) => {
    setTransfer({ fileName, progress: 0, speed: 0, done: false });
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(intervalRef.current);
      }
      setTransfer((prev) => ({
        ...prev,
        progress: Math.round(p),
        speed: (Math.random() * 5 + 1).toFixed(1),
      }));
    }, 300);
  };

  const completeTransfer = (fileName) => {
    clearInterval(intervalRef.current);
    setTransfer({ fileName, progress: 100, speed: 0, done: true });
  };

  return { transfer, startTransfer, completeTransfer };
}