// URL del Gateway (base del recurso productos)
const API_URL = "http://localhost:8080/cliente/productos";

// Obtener todos los productos
export async function obtenerProductos() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  return await response.json();
}

// Buscar productos por texto
export async function buscarProductos(texto) {
  const response = await fetch(
    `${API_URL}/buscar?texto=${encodeURIComponent(texto)}`
  );

  if (!response.ok) {
    throw new Error("Error al buscar productos");
  }

  return await response.json();
}

// Buscar productos con Facets
export async function obtenerFacets() {
  const response = await fetch("http://localhost:8080/cliente/productos/facets");
  if (!response.ok) throw new Error("Error al obtener facets");
  return await response.json();
}
