// Importamos React y useState para manejar estados dentro del componente.
import React, { useState } from "react";

// useParams permite leer parámetros que vienen en la URL (como el ID del producto).
import { useParams } from "react-router-dom";

// Importamos la lista de productos para buscar el que vamos a mostrar.
import { productos } from "../data/productos";

// Importamos los estilos específicos del detalle de producto.
import "./ProductoDetalle.css";

// Exportamos el componente principal y recibimos la función onAdd desde App.js,
// que sirve para agregar productos al carrito.
export default function ProductoDetalle({ onAdd }) {

  // Obtenemos el parámetro "id" que viene en la ruta gracias a useParams.
  const { id } = useParams();

  // Buscamos en la lista el producto cuyo id coincida con el de la URL.
  // Convertimos el id a número porque viene como texto.
  const producto = productos.find((p) => p.id === parseInt(id));

  // Creamos un estado llamado imgPrincipal para guardar la imagen que se muestra grande.
  // Al inicio, la imagen principal será la que viene dentro del objeto "producto".
  const [imgPrincipal, setImgPrincipal] = useState(producto.imagen);

  // Si el producto no existe, mostramos un mensaje informando el error.
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    // Contenedor principal del detalle del producto.
    <div className="detalle">
      
      {/* Sección de la izquierda donde va la galería */}
      <div className="detalle__galeria">

        {/* Imagen principal que se ve grande en la parte superior */}
        <img
          src={imgPrincipal}           // Imagen que se está mostrando
          alt={producto.nombre}        // Texto alternativo por accesibilidad
          className="detalle__img-main" // Clase para estilos
        />

        {/* Contenedor de las miniaturas (thumbnails) */}
        <div className="detalle__thumbs">

          {/* Miniatura que al darle clic cambia la imagen principal */}
          <img
            src={producto.imagen}        // Imagen que se muestra en miniatura
            alt={producto.nombre}        // Texto alternativo
            className="thumb"            // Clase para estilos
            onClick={() => setImgPrincipal(producto.imagen)} // Cambia la imagen principal
          />

          {/* Aquí se pueden agregar más miniaturas si el producto tiene varias fotos */}
        </div>
      </div>

      {/* Sección derecha donde va toda la información del producto */}
      <div className="detalle__info">
        
        {/* Título del producto */}
        <h2>{producto.nombre}</h2>

        {/* Descripción del producto */}
        <p className="detalle__desc">{producto.descripcion}</p>

        {/* Precio del producto */}
        <p className="detalle__price">${producto.precio}</p>

        {/* Botón para agregar el producto al carrito usando la función onAdd */}
        <button
          className="detalle__btn"
          onClick={() => onAdd(producto)} // Envía el producto al carrito
        >
          Añadir al carrito
        </button>

        {/* Información adicional debajo del botón */}
        <div className="detalle__extra">
          <h3>Características</h3>

          {/* Lista de características generales del producto */}
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
