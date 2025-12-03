// Importa React para poder trabajar con componentes.
import React from "react";

// Componente que muestra el contenido del carrito de compras.
export default function Carrito({ carrito, eliminar, cambiarCantidad, vaciar, total }) {
  return (
    <div>
      {/* Título de la página del carrito */}
      <h2>Carrito</h2>

      {/* Si el carrito está vacío, muestra este mensaje */}
      {carrito.length === 0 && <p>Carrito vacío.</p>}

      {/* Recorre todos los productos que están en el carrito */}
      {carrito.map((item) => (
        <div key={item.id}>
          {/* Nombre del producto */}
          <h4>{item.nombre}</h4>

          {/* Precio del producto */}
          <p>${item.precio}</p>

          {/* Campo para modificar la cantidad del producto */}
          <input
            type="number"
            value={item.cantidad} // Muestra la cantidad actual
            onChange={(e) => cambiarCantidad(item.id, parseInt(e.target.value))}
            min="1" // Impide poner cantidades menores a 1
          />

          {/* Botón para eliminar un producto del carrito */}
          <button onClick={() => eliminar(item.id)}>Eliminar</button>
        </div>
      ))}

      {/* Muestra el total a pagar */}
      <h3>Total: ${total}</h3>

      {/* Botón para borrar todo el carrito */}
      <button onClick={vaciar}>Vaciar carrito</button>
    </div>
  );
}
