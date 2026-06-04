import { useEffect, useState } from "react";

export default function App() {
  const [devices, setDevices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
  window.electronAPI.onIncomingRequest(
    (request) => {
      const accepted = confirm(
        `${request.senderName} quiere enviarte ${request.fileName}`
      );

      console.log(
        accepted
          ? "ACEPTADO"
          : "RECHAZADO"
      );
    }
  );
}, []);

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

        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];

            if (file) {
              setSelectedFile(file);
            }
          }}
        />

        {selectedFile && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background: "#f0f0f0",
              borderRadius: "8px",
            }}
          >
            <strong>{selectedFile.name}</strong>

            <p>
              {(selectedFile.size / 1024 / 1024).toFixed(2)}
              {" "}MB
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

                alert(
                  `Enviar ${selectedFile.name} a ${device.name}`
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