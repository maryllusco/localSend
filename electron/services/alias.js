const adjetivos = ["Cheerful", "Brave", "Calm", "Swift", "Bright", "Cool", "Happy", "Lucky"];
const colores = ["Orange", "Blue", "Green", "Purple", "Silver", "Gold", "Coral", "Teal"];

const adj = adjetivos[Math.floor(Math.random() * adjetivos.length)];
const color = colores[Math.floor(Math.random() * colores.length)];

export const alias = `${adj} ${color}`;