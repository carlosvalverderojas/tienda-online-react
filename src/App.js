// Importa React para poder crear componentes.
import React from "react";

// Importa las herramientas para manejar rutas en la aplicación.
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importa los diferentes componentes y páginas.
import Header from "./components/Header";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import Saludo from "./components/Saludo";


// Importa el hook que maneja toda la lógica del carrito.
import { useCarrito } from "./hooks/useCarrito";

//Importa el footer para agregarlo
import Footer from "./components/Footer";

// Importa estilos generales.
import "./App.css";

// Componente principal de toda la aplicación.
export default function App() {

  // Obtiene todas las funciones y datos del carrito desde el hook.
  const { carrito, agregar, eliminar, cambiarCantidad, vaciar, total } = useCarrito();

  // Calcula cuántos artículos hay en total en el carrito.
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    // Encierra toda la aplicación dentro del sistema de rutas.
    <BrowserRouter>

      {/* Header siempre visible, muestra el total de productos en el carrito */}
      <Header totalItems={totalItems} />

      {/* Contenedor principal de las páginas */}
      <div className="container">

        {/* Define las rutas y qué componente mostrar en cada URL */}
        <Routes>

          {/* Página de inicio */}
          <Route path="/" element={<Home />} />

          {/* Página con la lista de productos */}
          <Route path="/productos" element={<Productos onAdd={agregar} />} />

          {/* Página que muestra los detalles de un producto según su ID */}
          <Route path="/producto/:id" element={<ProductoDetalle onAdd={agregar} />} />

          {/* Página del carrito con todas sus funciones */}
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}          // Productos dentro del carrito
                eliminar={eliminar}        // Función para eliminar productos
                cambiarCantidad={cambiarCantidad} // Modifica cantidades
                vaciar={vaciar}            // Vacía todo el carrito
                total={total}              // Total a pagar
              />
            }
          />
          {/* NUEVA RUTA PARA EL MICROSERVICIO */}
          <Route path="/saludo" element={<Saludo />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
