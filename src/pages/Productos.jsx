// Importa React y useState para manejar el estado del buscador.
import React, { useState } from "react";

// Importa la lista completa de productos.
import { productos } from "../data/productos";

// Importa el componente que mostrará cada tarjeta de producto.
import ProductCard from "../components/ProductCard";

// Importa los estilos de esta página.
import "./Productos.css";

// Componente que muestra todos los productos y permite filtrarlos.
export default function Productos({ onAdd }) {
  
  // Estado que guarda lo que el usuario escribe en el buscador.
  const [busqueda, setBusqueda] = useState("");

  // Filtra los productos según lo que el usuario escribe.
  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>

      {/* Título de la página de productos */}
      <h2 className="productos__titulo">Productos</h2>

      {/* Cuadro de búsqueda para filtrar productos por nombre */}
      <input
        value={busqueda} // Muestra lo que el usuario escribe
        onChange={(e) => setBusqueda(e.target.value)} // Actualiza el estado
        placeholder="Buscar productos..." // Texto dentro del input
        className="productos__buscador" // Estilos desde el CSS
      />

      {/* Contenedor que muestra los productos en forma de cuadrícula */}
      <div className="productos__grid">
        {filtrados.map((producto) => (
          // Cada producto se muestra con su tarjeta correspondiente
          <ProductCard 
            key={producto.id} 
            producto={producto} 
            onAdd={onAdd} 
          />
        ))}
      </div>

    </div>
  );
}
