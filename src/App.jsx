import { useEffect, useState } from "react";

export default function App() {
  const [devices, setDevices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
  // Dispositivos encontrados
  window.electronAPI.onDeviceFound((device) => {
    setDevices((prev) => {
      const exists = prev.some(
        (d) => d.ip === device.ip
      );

      if (exists) return prev;

      return [...prev, device];
    });
  });

  // Solicitud de transferencia
  window.electronAPI.onIncomingRequest(
    (request) => {
      const accepted = confirm(
        `${request.senderName} quiere enviarte ${request.fileName}`
      );

      console.log(
        accepted ? "ACEPTADO" : "RECHAZADO"
      );
    }
  );

  // Archivo recibido
  window.electronAPI.onFileReceived(
    (file) => {
      alert(
        `Archivo recibido: ${file.fileName}`
      );
    }
  );
}, []);
const handleSelectFile = async () => {

  const filePath =
    await window.electronAPI.selectFile();

  if (!filePath) return;

  const fileName =
    filePath.split(/[\\/]/).pop();

  setSelectedFile({
    path: filePath,
    name: fileName,
  });
};
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>🚀 LocalSend</h1>

      {/* Archivo seleccionado */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Seleccionar archivo</h2>

        <button
  onClick={handleSelectFile}
  style={{
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  }}
>
  Seleccionar archivo
</button>

        {selectedFile && (
  <div
    style={{
      marginTop: 15,
      padding: 10,
      background: "#f0f0f0",
      borderRadius: 8,
    }}
  >
    <strong>
      {selectedFile.name}
    </strong>

    <p
      style={{
        fontSize: 12,
        color: "#666",
      }}
    >
      {selectedFile.path}
    </p>
  </div>
)}
      </div>

      {/* Dispositivos */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2>
          Dispositivos encontrados ({devices.length})
        </h2>

        {devices.length === 0 ? (
          <p>No se encontraron dispositivos.</p>
        ) : (
          devices.map((device, index) => (
            <div
              key={index}
              style={{
                padding: "12px",
                marginTop: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                cursor: selectedFile ? "pointer" : "default",
              }}
              onClick={() => {
  if (!selectedFile) {
    alert(
      "Primero seleccioná un archivo."
    );
    return;
  }

  window.electronAPI.sendFile(
  device,
  {
    name: selectedFile.name,
    path: selectedFile.path,
  }
);

  alert(
    `Solicitud enviada a ${device.name}`
  );
}}
            >
              <div>
                <strong>📱 {device.name}</strong>
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                {device.ip}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}