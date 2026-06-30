const card = {
  background: "white", padding: 20, borderRadius: 10,
  marginBottom: 20, boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const btn = {
  padding: "10px 16px", borderRadius: 8, border: "none",
  background: "#2563eb", color: "white", cursor: "pointer", fontSize: 14,
};

export default function FileSelector({ selectedFile, onSelectFile }) {
  return (
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>Seleccionar archivo</h2>
      <button onClick={onSelectFile} style={btn}>
        Seleccionar archivo
      </button>
      {selectedFile && (
        <div style={{ marginTop: 12, padding: 10, background: "#f0f0f0", borderRadius: 8 }}>
          <strong>📄 {selectedFile.name}</strong>
          <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0" }}>{selectedFile.path}</p>
        </div>
      )}
    </div>
  );
}