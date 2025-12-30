import { useEffect, useState } from "react";

function Saludo() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/cliente/saludo")
      .then(response => response.text())
      .then(data => setMensaje(data))
      .catch(error => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h2>Respuesta del Microservicio</h2>
      <p>{mensaje}</p>
    </div>
  );
}

export default Saludo;
