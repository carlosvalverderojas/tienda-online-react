const API_URL = "http://localhost:8080";

// Base
export async function obtenerSaludo() {
  const response = await fetch(`${API_URL}/cliente/saludo`);
  return response.text();
}

//traer los 12 productos
export async function getProductos() {
  const response = await fetch(`${API_URL}/cliente/productos`);
  if (!response.ok) throw new Error("Error cargando productos");
  return response.json();
}

//buscar en tiempo real por texto
export async function buscarProductos(texto) {
  const response = await fetch(
    `${API_URL}/cliente/productos/buscar?texto=${encodeURIComponent(texto)}`
  );
  if (!response.ok) throw new Error("Error buscando productos");
  return response.json();
}
