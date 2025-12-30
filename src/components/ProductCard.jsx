// Importa React para poder usar sus componentes.
import React from "react";

// Importa Link para navegar entre páginas sin recargar la web.
import { Link } from "react-router-dom";

// Importa los estilos específicos de productos.
import "./ProductCard.css";

// Componente que muestra la información de un producto individual.
export default function ProductCard({ producto, onAdd }) {
  return (
    // Contenedor principal de la tarjeta del producto.
    <div className="card">

      {/* Imagen del producto. */}
      <img
        className="card__img"
        src={`/img/${producto.imagen}`}
        alt={producto.nombre}
      />
      
      {/* Nombre del producto. */}
      <h3 className="card__title">{producto.nombre}</h3>

      {/* Precio del producto. */}
      <p className="card__price">${producto.precio}</p>

      {/* Zona donde van los botones. */}
      <div className="card__actions">

        {/* Botón para ver más detalles del producto. */}
        <Link
          className="card__btn card__btn--info"
          to={`/producto/${producto.id}`}
        >
          Ver
        </Link>

        {/* Botón que agrega el producto al carrito. */}
        <button
          className="card__btn card__btn--add"
          onClick={() => onAdd(producto)}
        >
          Añadir +
        </button>

      </div>
    </div>
  );
}
