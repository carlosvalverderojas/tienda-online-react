// Importa useEffect y useState, que permiten manejar estado y efectos en React.
import { useEffect, useState } from "react";

// Hook personalizado que maneja toda la lógica del carrito.
export function useCarrito() {

  // Estado del carrito. Carga datos desde localStorage si existen.
  const [carrito, setCarrito] = useState(() => {
    const raw = localStorage.getItem("carrito"); // Obtiene datos guardados.
    return raw ? JSON.parse(raw) : []; // Si hay datos, los convierte; si no, empieza vacío.
  });

  // Cada vez que el carrito cambie, se guarda en localStorage.
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Función para agregar un producto al carrito.
  const agregar = (producto) => {
    setCarrito((prev) => {
      // Revisa si el producto ya estaba en el carrito.
      const existe = prev.find((p) => p.id === producto.id);

      // Si ya existe, solo aumenta su cantidad.
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }

      // Si no existía, lo agrega al carrito con cantidad 1.
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Elimina un producto del carrito según su id.
  const eliminar = (id) =>
    setCarrito((prev) => prev.filter((p) => p.id !== id));

  // Cambia la cantidad de un producto ya existente.
  const cambiarCantidad = (id, cantidad) =>
    setCarrito((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad } : p))
    );

  // Vacía completamente el carrito.
  const vaciar = () => setCarrito([]);

  // Calcula el total a pagar sumando precios * cantidades.
  const total = carrito.reduce(
    (sum, p) => sum + p.precio * p.cantidad,
    0
  );

  // Devuelve todo lo necesario para usar el carrito en otros componentes.
  return { carrito, agregar, eliminar, cambiarCantidad, vaciar, total };
}
