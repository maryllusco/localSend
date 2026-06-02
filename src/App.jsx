import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div>
      <h1>LocalSend Desktop</h1>

      <div>
        🟢 Escuchando
      </div>

      <hr />

      <div>
        <h2>Dispositivos encontrados</h2>

        <ul>
          <li>📱 Mi Celular - 192.168.0.5</li>
          <li>💻 Notebook - 192.168.0.10</li>
        </ul>
      </div>

      <hr />

      <div
        style={{
          border: "2px dashed gray",
          padding: "50px",
          textAlign: "center"
        }}
      >
        Arrastre archivos aquí
      </div>

      <hr />

      <div>
        <h2>Transferencia</h2>
        <progress value="50" max="100"></progress>
        <p>50%</p>
      </div>
    </div>
  );
}

export default App;
