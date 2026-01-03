// Base URL del backend (Gateway)
// - En local: usa localhost
// - En producción (Netlify): usa la variable REACT_APP_API_URL
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_URL = `${API_BASE}/cliente/productos`;

// ---- Timeout
async function fetchConTimeout(url, options = {}, ms = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// ---- Cache + cooldown 429
let cacheProductos = null;
let cacheAt = 0;
const CACHE_TTL = 60_000; // 60s

let cooldownUntil = 0;
const COOLDOWN_MS = 12_000; // 12s

const now = () => Date.now();
const inCooldown = () => now() < cooldownUntil;
const setCooldown = () => (cooldownUntil = now() + COOLDOWN_MS);

// Obtener todos los productos
export async function obtenerProductos({ force = false } = {}) {
  if (!force && inCooldown()) {
    throw new Error("Rate limit (429). Espera unos segundos y recarga.");
  }

  if (!force && cacheProductos && now() - cacheAt < CACHE_TTL) {
    return cacheProductos;
  }

  const response = await fetchConTimeout(API_URL);

  if (response.status === 429) {
    setCooldown();
    throw new Error("Rate limit (429). Espera unos segundos y recarga.");
  }

  if (!response.ok) throw new Error("Error al obtener productos");

  const data = await response.json();
  cacheProductos = data;
  cacheAt = now();
  return data;
}

// Buscar productos por texto
export async function buscarProductos(texto) {
  const q = (texto || "").trim();
  if (!q) return [];

  // evita spam: si < 3 chars, no llames al gateway
  if (q.length < 3) return [];

  if (inCooldown()) {
    throw new Error("Rate limit (429). Espera unos segundos.");
  }

  const response = await fetchConTimeout(
    `${API_URL}/buscar?texto=${encodeURIComponent(q)}`
  );

  if (response.status === 429) {
    setCooldown();
    throw new Error("Rate limit (429). Espera unos segundos.");
  }

  if (!response.ok) throw new Error("Error al buscar productos");
  return await response.json();
}

// Facets: desactivado (tu backend da 500)
export async function obtenerFacets() {
  return { nombres: [], precios: [] };
}
