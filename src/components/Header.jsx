import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({ totalItems }) {
  return (
    <header className="header">
      <div className="header__left">
        <img src="/imagenes/logo.jpg" alt="Logo" className="header__logo" />
        <span className="header__title">Tienda CV</span>
      </div>

      <nav className="header__nav">
        <Link className="header__btn" to="/">Inicio</Link>
        <Link className="header__btn" to="/productos">Productos</Link>
        <Link className="header__btn carrito" to="/carrito">
          Carrito ({totalItems})
        </Link>
      </nav>
    </header>
  );
}
