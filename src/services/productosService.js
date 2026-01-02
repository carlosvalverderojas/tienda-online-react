// Base URL del backend (Gateway)
// - En local: usa localhost
// - En producción (Netlify): usa la variable REACT_APP_API_URL
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Recurso productos en el Gateway
const API_URL = `${API_BASE}/cliente/productos`;

/** -------------------------
 * Helpers: timeout + sleep
 * ------------------------- */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchConTimeout(url, options = {}, ms = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

/** -------------------------
 * Anti-rate-limit (429)
 * ------------------------- */
// Cache simple en memoria para evitar repetir calls
let cacheProductos = null;
let cacheProductosAt = 0;
const CACHE_TTL_MS = 60_000; // 60s

// Cooldown cuando Render/Cloudflare limita
let cooldownUntil = 0;
const COOLDOWN_MS = 12_000; // 12s

function ahora() {
  return Date.now();
}

function enCooldown() {
  return ahora() < cooldownUntil;
}

function setCooldown() {
  cooldownUntil = ahora() + COOLDOWN_MS;
}

/** -------------------------
 * API
 * ------------------------- */

// Obtener todos los productos
export async function obtenerProductos({ force = false } = {}) {
  // Si estamos en cooldown por 429, NO dispares otra petición
  if (!force && enCooldown()) {
    throw new Error("Rate limit (429). Espera unos segundos y recarga.");
  }

  // Devuelve cache si está fresco
  if (!force && cacheProductos && ahora() - cacheProductosAt < CACHE_TTL_MS) {
    return cacheProductos;
  }

  const response = await fetchConTimeout(API_URL, {}, 20000);

  if (response.status === 429) {
    setCooldown();
    throw new Error("Rate limit (429). Espera unos segundos y recarga.");
  }

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  const data = await response.json();
  cacheProductos = data;
  cacheProductosAt = ahora();
  return data;
}

// Buscar productos por texto (Elastic)
export async function buscarProductos(texto) {
  const q = (texto || "").trim();

  // Evita spamear: si está vacío, mejor que el componente llame obtenerProductos()
  if (!q) return [];

  // Si hay cooldown por 429, evita disparar también aquí
  if (enCooldown()) {
    throw new Error("Rate limit (429). Espera unos segundos e intenta de nuevo.");
  }

  const url = `${API_URL}/buscar?texto=${encodeURIComponent(q)}`;
  const response = await fetchConTimeout(url, {}, 20000);

  if (response.status === 429) {
    setCooldown();
    throw new Error("Rate limit (429). Espera unos segundos e intenta de nuevo.");
  }

  if (!response.ok) throw new Error("Error al buscar productos");
  return await response.json();
}

// Facets (opcional)
// backend en Render está devolviendo 500 en /facets,
// por eso aquí devolvemos null si falla.
export async function obtenerFacets() {
  try {
    // Si estamos rate-limited, no insistir
    if (enCooldown()) return null;

    const response = await fetchConTimeout(`${API_URL}/facets`, {}, 15000);

    if (response.status === 429) {
      setCooldown();
      return null;
    }

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
