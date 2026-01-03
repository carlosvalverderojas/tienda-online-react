import React, { useEffect, useState } from "react";
import {
  obtenerProductos,
  buscarProductos,
  obtenerFacets,
} from "../services/productosService";
import ProductCard from "../components/ProductCard";
import "./Productos.css";

export default function Productos({ onAdd }) {
  const [productos, setProductos] = useState([]);
  const [productosBase, setProductosBase] = useState([]);
  const [facets, setFacets] = useState({ nombres: [], precios: [] });

  const [errorFatal, setErrorFatal] = useState(false); // solo si falla cargar productos inicial
  const [errorBusqueda, setErrorBusqueda] = useState(""); // fallos de buscar/filtros (no crashea)
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState("");

  // Cargar productos + facets UNA sola vez al inicio
  useEffect(() => {
    const cargar = async () => {
      try {
        setErrorFatal(false);
        setErrorBusqueda("");
        setCargando(true);

        // 1) Productos (obligatorio)
        const dataProd = await obtenerProductos();
        setProductosBase(dataProd);
        setProductos(dataProd);

        // 2) Facets (opcional: si falla NO rompe la UI)
        try {
          const dataFacets = await obtenerFacets();
          if (dataFacets && (dataFacets.nombres || dataFacets.precios)) {
            setFacets(dataFacets);
          } else {
            setFacets({ nombres: [], precios: [] });
          }
        } catch {
          setFacets({ nombres: [], precios: [] });
        }
      } catch {
        // Solo error fatal si NO se pudieron obtener productos
        setErrorFatal(true);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  // Búsqueda en tiempo real con debounce + filtros
  useEffect(() => {
    if (productosBase.length === 0) return;

    const timer = setTimeout(async () => {
      const valor = texto.trim();

      // Si no hay texto ni filtros: mostrar base (sin llamar backend)
      if (valor === "" && filtroNombre === "" && filtroPrecio === "") {
        setErrorBusqueda("");
        setProductos(productosBase);
        return;
      }

      // Si el texto es muy corto (1-2 chars) y no hay filtros: no consultar backend
      if (
        valor.length > 0 &&
        valor.length < 3 &&
        filtroNombre === "" &&
        filtroPrecio === ""
      ) {
        setErrorBusqueda("");
        setProductos(productosBase);
        return;
      }

      setCargando(true);
      setErrorBusqueda("");

      try {
        // Construir query combinando texto + filtros
        let query = valor;
        if (filtroNombre) query = (query + " " + filtroNombre).trim();
        if (filtroPrecio) query = (query + " " + filtroPrecio).trim();

        const data = await buscarProductos(query);

        // Completar campos faltantes (imagen) desde base
        const completos = (data || []).map((p) => {
          const ref = productosBase.find((x) => x.id === p.id);
          return ref ? { ...ref, ...p } : p;
        });

        // Si la búsqueda devuelve vacío, lo mostramos como vacío (no es error)
        setProductos(completos);
      } catch (e) {
        // NO crashear toda la pantalla: volvemos a base y mostramos aviso
        setProductos(productosBase);
        setErrorBusqueda(
          "La búsqueda no está disponible temporalmente. Mostrando catálogo completo."
        );
      } finally {
        setCargando(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [texto, filtroNombre, filtroPrecio, productosBase]);

  if (errorFatal) return <p>No se pudieron cargar los productos</p>;

  const hayFiltro =
    texto.trim() !== "" || filtroNombre !== "" || filtroPrecio !== "";

  return (
    <div>
      <h2 className="productos__titulo">Productos</h2>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar producto."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="productos__buscar"
      />

      {/* Filtros */}
      <div className="productos__filtros">
        <div className="filtro">
          <label className="filtro__label">Sugerencias</label>
          <select
            className="filtro__select"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          >
            <option value="">Selecciona una palabra clave</option>
            {(facets.nombres || []).map((b) => (
              <option key={b.key} value={b.key}>
                {b.key} ({b.count})
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
            <option value="">Todos los precios</option>
            {(facets.precios || []).map((b) => (
              <option key={b.key} value={b.key}>
                {b.key} ({b.count})
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
            setErrorBusqueda("");
            setProductos(productosBase);
          }}
        >
          Limpiar filtros
        </button>
      </div>

      {errorBusqueda && <p>{errorBusqueda}</p>}
      {cargando && <p>Cargando.</p>}

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
