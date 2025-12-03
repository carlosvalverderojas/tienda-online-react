// Importa React para poder usar componentes.
import React from "react";

// Importa createRoot, que permite iniciar nuestra aplicación en React.
import { createRoot } from "react-dom/client";

// Importa el componente principal de la aplicación.
import App from "./App";

// Importa los estilos globales del proyecto.
import "./index.css";

// Busca en el HTML el elemento con id="root",
// que es donde se mostrará toda la aplicación.
const root = createRoot(document.getElementById("root"));

// Muestra la aplicación dentro del elemento root.
root.render(<App />);
