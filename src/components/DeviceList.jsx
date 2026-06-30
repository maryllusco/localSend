const card = {
  background: "white", padding: 20, borderRadius: 10,
  marginBottom: 20, boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

export default function DeviceList({ devices, onSendFile }) {
  return (
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>Dispositivos encontrados ({devices.length})</h2>
      {devices.length === 0 ? (
        <p style={{ color: "#999" }}>No se encontraron dispositivos.</p>
      ) : (
        devices.map((device, index) => (
          <div
            key={index}
            onClick={() => onSendFile(device)}
            style={{
              padding: 14, marginTop: 10,
              border: "1px solid #ddd", borderRadius: 10,
              cursor: "pointer", display: "flex",
              alignItems: "center", gap: 12,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f0f7ff"}
            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
          >
            <span style={{ fontSize: 28 }}>📱</span>
            <div>
              <strong>{device.name}</strong>
              <p style={{ margin: 0, fontSize: 12, color: "#999" }}>{device.ip}</p>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#2563eb" }}>
              Enviar →
            </span>
          </div>
        ))
      )}
    </div>
  );
}