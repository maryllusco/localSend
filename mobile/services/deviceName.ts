const adjetivos = ["Cheerful", "Brave", "Calm", "Swift", "Bright", "Cool", "Happy", "Lucky"];
const colores = ["Orange", "Blue", "Green", "Purple", "Silver", "Gold", "Coral", "Teal"];

function generarAlias() {
  const adj = adjetivos[Math.floor(Math.random() * adjetivos.length)];
  const color = colores[Math.floor(Math.random() * colores.length)];
  return `${adj} ${color}`;
}

// Se genera una vez por sesión
const aliasDelDispositivo = generarAlias();

export async function obtenerNombreDispositivo(): Promise<string> {
  return aliasDelDispositivo;
}