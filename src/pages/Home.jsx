// Importamos React para poder crear el componente.
import React from "react";

// Importamos los estilos específicos de la página Home.
import "./Home.css";

// Importamos Link para crear enlaces internos sin recargar la página.
import { Link } from "react-router-dom";

// Componente principal de la página de inicio.
export default function Home() {
  return (
    // Contenedor general de toda la página principal.
    <div className="home">

      {/* Sección del banner grande que aparece arriba */}
      <div className="home__hero">
        
        {/* Imagen principal del banner */}
        <img
          src="/imagenes/principal.png"    // Ruta donde se encuentra la imagen
          alt="Tienda CV"                   // Texto alternativo por accesibilidad
          className="home__hero-img"        // Clase para estilos
        />

        {/* Texto que va encima de la imagen principal */}
        <div className="home__hero-text">
          <h1>Bienvenido a Tienda CV</h1>    {/* Título principal */}
          <p>Calidad, precio y variedad en un solo lugar.</p> {/* Subtítulo */}
          
          {/* Botón que lleva a la página de productos */}
          <Link className="home__btn" to="/productos">
            Ver Productos
          </Link>
        </div>
      </div>

      {/* Nueva sección debajo del banner, dividida en dos columnas */}
      <div className="home__seccion">
        
        {/* Primera columna con información sobre la tienda */}
        <div className="home__col">
          <h2>¿Quiénes somos?</h2>
          <p>
            En Tienda CV ofrecemos productos tecnológicos de calidad,
            seleccionados cuidadosamente para brindarte la mejor experiencia.
          </p>
        </div>

        {/* Segunda columna explicando por qué elegir la tienda */}
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
