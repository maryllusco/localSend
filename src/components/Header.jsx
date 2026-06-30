export default function Header({ serverActive }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      <span style={{ fontSize: 28 }}>🚀</span>
      <h1 style={{ margin: 0 }}>LocalSend</h1>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 12, height: 12, borderRadius: "50%",
          backgroundColor: serverActive ? "#22c55e" : "#ef4444",
          boxShadow: serverActive ? "0 0 8px #22c55e" : "0 0 8px #ef4444",
        }} />
        <span style={{ fontSize: 13, color: "#666" }}>
          {serverActive ? "Servidor activo" : "Servidor inactivo"}
        </span>
      </div>
    </div>
  );
}