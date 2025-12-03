import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { productos } from "../data/productos";
import "./ProductoDetalle.css";

export default function ProductoDetalle({ onAdd }) {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === parseInt(id));

  // Manejo de imagen principal
  const [imgPrincipal, setImgPrincipal] = useState(producto.imagen);

  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <div className="detalle">
      
      {/* Galería izquierda */}
      <div className="detalle__galeria">
        <img
          src={imgPrincipal}
          alt={producto.nombre}
          className="detalle__img-main"
        />

        <div className="detalle__thumbs">
          <img
            src={producto.imagen}
            className="thumb"
            onClick={() => setImgPrincipal(producto.imagen)}
          />
          {/* Si quieres más imágenes, puedes agregarlas aquí */}
        </div>
      </div>

      {/* Información */}
      <div className="detalle__info">
        <h2>{producto.nombre}</h2>

        <p className="detalle__desc">{producto.descripcion}</p>

        <p className="detalle__price">${producto.precio}</p>

        <button className="detalle__btn" onClick={() => onAdd(producto)}>
          Añadir al carrito
        </button>

        <div className="detalle__extra">
          <h3>Características</h3>
          <ul>
            <li>Producto de alta calidad</li>
            <li>Garantía de 1 año</li>
            <li>Envío rápido disponible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
