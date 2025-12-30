// Base URL del backend (Gateway)
// - En local: usa localhost
// - En producción (Netlify): usa la variable REACT_APP_API_URL
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Recurso productos en el Gateway
const API_URL = `${API_BASE}/cliente/productos`;

// Obtener todos los productos
export async function obtenerProductos() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener productos");
  return await response.json();
}

// Buscar productos por texto
export async function buscarProductos(texto) {
  const response = await fetch(
    `${API_URL}/buscar?texto=${encodeURIComponent(texto)}`
  );
  if (!response.ok) throw new Error("Error al buscar productos");
  return await response.json();
}

// Facets
export async function obtenerFacets() {
  const response = await fetch(`${API_URL}/facets`);
  if (!response.ok) throw new Error("Error al obtener facets");
  return await response.json();
}
