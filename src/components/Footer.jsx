// Importamos React para poder usar JSX.
import React from "react";

// Importamos Link para crear enlaces internos sin recargar la página.
import { Link } from "react-router-dom";

// Importamos los estilos específicos del encabezado.
import "./Header.css";

// Componente Header que recibe la cantidad total de ítems en el carrito.
export default function Header({ totalItems }) {
  return (
    // Contenedor principal del encabezado.
    <header className="header">

      {/* Sección izquierda: aquí ponemos el logo y el nombre de la tienda */}
      <div className="header__left">
        <img 
          src="/imagenes/logo.jpg"         // Ruta del logo
          alt="Logo"                        // Texto alternativo por accesibilidad
          className="header__logo"          // Clase para darle estilo al logo
        />

        {/* Nombre de la tienda al lado del logo */}
        <span className="header__title">Tienda CV</span>
      </div>

      {/* Menú de navegación con botones para moverse por la aplicación */}
      <nav className="header__nav">

        {/* Botón que lleva a la página de inicio */}
        <Link className="header__btn" to="/">Inicio</Link>

        {/* Botón que lleva a la lista de productos */}
        <Link className="header__btn" to="/productos">Productos</Link>

        {/* Botón que lleva al carrito e incluye la cantidad actual */}
        <Link className="header__btn carrito" to="/carrito">
          Carrito ({totalItems})   {/* Muestra cuántos ítems hay en el carrito */}
        </Link>
      </nav>
    </header>
  );
}
