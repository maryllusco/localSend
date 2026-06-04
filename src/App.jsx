import { useEffect, useState } from "react";

function App() {
  const [active, setActive] = useState(false);

  useEffect(() => {
  console.log("electronAPI:", window.electronAPI);

  if (window.electronAPI) {
    const status = window.electronAPI.isServerRunning();
    setActive(status);
  }
}, []);

  return (
    <div>
      <h1>LocalSend</h1>

      <p>
        Estado:
        {window.electronAPI.isServerRunning()
          ? " Activo"
          : " Inactivo"}
      </p>
    </div>
  );
}

export default App;