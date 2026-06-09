import Bonjour from "bonjour-service";

const bonjour = new Bonjour();

export function startBonjour() {
  bonjour.publish({
    name: "PC de Luz",
    type: "localsend",
    port: 53317,
  });

  console.log("Servicio Bonjour publicado");
}