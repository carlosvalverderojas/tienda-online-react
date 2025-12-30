import React, { useEffect, useState } from "react";
import { obtenerSaludo } from "../services/api";

export default function SaludoBackend() {
  const [saludo, setSaludo] = useState("Cargando...");

  useEffect(() => {
    obtenerSaludo()
      .then(data => setSaludo(data))
      .catch(() => setSaludo("Error al conectar con el backend"));
  }, []);

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", background: "#f4f4f4", borderRadius: "8px" }}>
      <h3>Respuesta del Backend</h3>
      <p>{saludo}</p>
    </div>
  );
}
