import { useState } from "react";
import { useDevices } from "./hooks/useDevices";
import { useTransfer } from "./hooks/useTransfer";
import { useFileSelector } from "./hooks/useFileSelector";
import { useElectronEvents } from "./hooks/useElectronEvents";
import Header from "./components/Header";
import FileSelector from "./components/FileSelector";
import DeviceList from "./components/DeviceList";
import TransferMonitor from "./components/TransferMonitor";

export default function App() {
  const [serverActive] = useState(true);
  const { devices, addDevice } = useDevices();
  const { transfer, startTransfer, completeTransfer } = useTransfer();
  const {
    selectedFile, isDragging,
    handleSelectFile, handleDragEnter,
    handleDragLeave, handleDragOver, handleDrop,
  } = useFileSelector();

  useElectronEvents({
    onDeviceFound: addDevice,
    onIncomingRequest: (request) => {
      confirm(`📥 ${request.senderName} quiere enviarte:\n📄 ${request.fileName}`);
    },
    onFileReceived: (file) => {
      completeTransfer(file.fileName);
      new Notification("✅ Archivo recibido", { body: file.fileName });
    },
  });

  const handleSendFile = (device) => {
    if (!selectedFile) { alert("Primero seleccioná un archivo."); return; }
    startTransfer(selectedFile.name);
    window.electronAPI.sendFile(device, { name: selectedFile.name, path: selectedFile.path });
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        minHeight: "100vh",
        padding: "30px",
        backgroundColor: isDragging ? "#e8f4ff" : "#f5f5f5",
        border: isDragging ? "3px dashed #2563eb" : "3px solid transparent",
        transition: "all 0.2s",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {isDragging && (
        <div style={{
          position: "fixed", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(37,99,235,0.1)", zIndex: 999,
          fontSize: 32, fontWeight: "bold", color: "#2563eb",
        }}>
          📂 Soltá el archivo aquí
        </div>
      )}

      <Header serverActive={serverActive} />
      <FileSelector selectedFile={selectedFile} onSelectFile={handleSelectFile} />
      <TransferMonitor transfer={transfer} />
      <DeviceList devices={devices} onSendFile={handleSendFile} />
    </div>
  );
}