import { useEffect } from "react";

export function useElectronEvents({ onDeviceFound, onIncomingRequest, onFileReceived }) {
  useEffect(() => {
    window.electronAPI.onDeviceFound(onDeviceFound);
    window.electronAPI.onIncomingRequest(onIncomingRequest);
    window.electronAPI.onFileReceived(onFileReceived);
  }, []);
}