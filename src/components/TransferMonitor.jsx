const card = {
  background: "white", padding: 20, borderRadius: 10,
  marginBottom: 20, boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

export default function TransferMonitor({ transfer }) {
  if (!transfer) return null;

  return (
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>📊 Transferencia</h2>
      <p style={{ margin: "0 0 8px" }}>📄 {transfer.fileName}</p>
      <div style={{ background: "#e5e7eb", borderRadius: 8, height: 16, overflow: "hidden" }}>
        <div style={{
          width: `${transfer.progress}%`,
          height: "100%",
          background: transfer.done ? "#22c55e" : "#2563eb",
          transition: "width 0.3s",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 13, color: "#666" }}>
        <span>{transfer.progress}%</span>
        {!transfer.done && <span>⚡ {transfer.speed} MB/s</span>}
        {transfer.done && <span style={{ color: "#22c55e" }}>✅ Completado</span>}
      </div>
    </div>
  );
}