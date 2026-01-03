import React, { useCallback, useEffect, useState } from "react";
import {
  obtenerProductos,
  buscarProductos,
  obtenerFacets,
} from "../services/productosService";
import ProductCard from "../components/ProductCard";
import "./Productos.css";

function toNumberSafe(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

// Opciones de precio simples (puedes ajustarlas)
const PRICE_RANGES = [
  { key: "", label: "Todos los precios", min: null, max: null },
  { key: "0-50", label: "₡0 - ₡50", min: 0, max: 50 },
  { key: "51-100", label: "₡51 - ₡100", min: 51, max: 100 },
  { key: "101-200", label: "₡101 - ₡200", min: 101, max: 200 },
  { key: "201+", label: "₡201+", min: 201, max: null },
];

export default function Productos({ onAdd }) {
  const [productos, setProductos] = useState([]);
  const [productosBase, setProductosBase] = useState([]);

  const [facets, setFacets] = useState({ nombres: [], precios: [] });

  const [errorFatal, setErrorFatal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState("");

  // Cargar productos + facets
  useEffect(() => {
    const cargar = async () => {
      try {
        setErrorFatal(false);
        setErrorMsg("");
        setCargando(true);

        const dataProd = await obtenerProductos();
        setProductosBase(dataProd);
        setProductos(dataProd);

        // Facets opcional (si no existe, igual filtramos local)
        try {
          const dataFacets = await obtenerFacets();
          if (dataFacets?.nombres || dataFacets?.precios) {
            setFacets({
              nombres: Array.isArray(dataFacets.nombres) ? dataFacets.nombres : [],
              precios: Array.isArray(dataFacets.precios) ? dataFacets.precios : [],
            });
          } else {
            setFacets({ nombres: [], precios: [] });
          }
        } catch {
          setFacets({ nombres: [], precios: [] });
        }
      } catch {
        setErrorFatal(true);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  // ✅ FIX: aplicarFiltrosLocales estable para que Netlify/ESLint no truene
  const aplicarFiltrosLocales = useCallback(
    (lista) => {
      let out = [...lista];

      if (filtroNombre) {
        const k = filtroNombre.toLowerCase();
        out = out.filter((p) => (p.nombre || "").toLowerCase().includes(k));
      }

      if (filtroPrecio) {
        const rango = PRICE_RANGES.find((r) => r.key === filtroPrecio);
        if (rango) {
          out = out.filter((p) => {
            const precio = toNumberSafe(p.precio);
            const okMin = rango.min == null ? true : precio >= rango.min;
            const okMax = rango.max == null ? true : precio <= rango.max;
            return okMin && okMax;
          });
        }
      }

      return out;
    },
    [filtroNombre, filtroPrecio]
  );

  // Búsqueda + filtros
  useEffect(() => {
    if (productosBase.length === 0) return;

    const timer = setTimeout(async () => {
      setErrorMsg("");

      const q = texto.trim();

      // Si NO hay texto: solo filtros locales
      if (!q) {
        const filtrados = aplicarFiltrosLocales(productosBase);
        setProductos(filtrados);
        return;
      }

      // texto muy corto -> no llamar backend, pero sí filtrar local por nombre
      if (q.length < 3) {
        const filtrados = aplicarFiltrosLocales(
          productosBase.filter((p) =>
            (p.nombre || "").toLowerCase().includes(q.toLowerCase())
          )
        );
        setProductos(filtrados);
        return;
      }

      // Si hay texto >= 3: intentamos Elastic (buscarProductos)
      setCargando(true);
      try {
        const data = await buscarProductos(q);

        // Mapeo a datos completos (imagen/descripcion desde base)
        const completos = (data || []).map((p) => {
          const ref = productosBase.find((x) => x.id === p.id);
          return ref ? { ...ref, ...p } : p;
        });

        // Aún aplicamos filtros locales encima del resultado de Elastic
        const filtrados = aplicarFiltrosLocales(completos);
        setProductos(filtrados);
      } catch {
        // Si Elastic falla, seguimos con búsqueda local por nombre
        const local = productosBase.filter((p) =>
          (p.nombre || "").toLowerCase().includes(q.toLowerCase())
        );
        setProductos(aplicarFiltrosLocales(local));
        setErrorMsg(
          "Búsqueda avanzada no disponible temporalmente. Mostrando resultados locales."
        );
      } finally {
        setCargando(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [texto, productosBase, aplicarFiltrosLocales]);

  if (errorFatal) return <p>No se pudieron cargar los productos.</p>;

  const hayFiltro =
    texto.trim() !== "" || filtroNombre !== "" || filtroPrecio !== "";

  return (
    <div>
      <h2 className="productos__titulo">Productos</h2>

      <input
        type="text"
        placeholder="Buscar producto."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="productos__buscar"
      />

      <div className="productos__filtros">
        <div className="filtro">
          <label className="filtro__label">Sugerencias</label>
          <select
            className="filtro__select"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          >
            <option value="">Selecciona una palabra clave</option>

            {(facets.nombres?.length
              ? facets.nombres.map((b) => b.key)
              : Array.from(
                  new Set(
                    productosBase
                      .map((p) => (p.nombre || "").split(" ")[0])
                      .filter(Boolean)
                  )
                )
            ).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro">
          <label className="filtro__label">Rango de precio</label>
          <select
            className="filtro__select"
            value={filtroPrecio}
            onChange={(e) => setFiltroPrecio(e.target.value)}
          >
            {PRICE_RANGES.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="filtro__btn"
          onClick={() => {
            setTexto("");
            setFiltroNombre("");
            setFiltroPrecio("");
            setErrorMsg("");
            setProductos(productosBase);
          }}
        >
          Limpiar filtros
        </button>
      </div>

      {errorMsg && <p>{errorMsg}</p>}
      {cargando && <p>Cargando...</p>}

      <div className="productos__grid">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} onAdd={onAdd} />
        ))}
      </div>

      {!cargando && productos.length === 0 && hayFiltro && (
        <p>No hay resultados con esos filtros.</p>
      )}
    </div>
  );
}
