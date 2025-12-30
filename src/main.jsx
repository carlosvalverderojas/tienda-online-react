// Importa React y ReactDOM para renderizar la app
import React from "react";
import ReactDOM from "react-dom/client";

// Importa el componente principal
import App from "./App";

// Importa estilos globales
import "./index.css";

// Renderiza la aplicación dentro del div con id="root"
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
