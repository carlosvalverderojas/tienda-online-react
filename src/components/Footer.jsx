// Importamos React para poder crear el componente.
import React from "react";

// Importamos los estilos del footer.
import "./Footer.css";

// Componente que muestra el pie de página de la aplicación.
export default function Footer() {
  return (
    // Etiqueta <footer> que contiene el texto final de la página.
    <footer className="footer">
      {/* Texto que aparecerá centrado en la parte inferior */}
      © 2025 Tienda CV — Todos los derechos reservados.
    </footer>
  );
}
