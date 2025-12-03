import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">

      {/* Banner principal */}
      <div className="home__hero">
        <img
          src="/imagenes/principal.png"
          alt="Tienda CV"
          className="home__hero-img"
        />
        <div className="home__hero-text">
          <h1>Bienvenido a Tienda CV</h1>
          <p>Calidad, precio y variedad en un solo lugar.</p>
          <Link className="home__btn" to="/productos">Ver Productos</Link>
        </div>
      </div>

      {/* Nueva sección dividida en dos columnas */}
      <div className="home__seccion">
        <div className="home__col">
          <h2>¿Quiénes somos?</h2>
          <p>
            En Tienda CV ofrecemos productos tecnológicos de calidad,
            seleccionados cuidadosamente para brindarte la mejor experiencia.
          </p>
        </div>

        <div className="home__col">
          <h2>¿Por qué elegirnos?</h2>
          <p>
            Contamos con precios competitivos, excelente atención y
            un catálogo actualizado constantemente.
          </p>
        </div>
      </div>

    </div>
  );
}
