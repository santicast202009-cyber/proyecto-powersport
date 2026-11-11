import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { obtenerProductos } from "../api";

const categorias = [
  {
    key: "proteina",
    seccionId: "proteinas",
    tituloId: "proteinas-title",
    gridId: "protein-grid",
    titulo: "Proteínas",
  },
  {
    key: "creatina",
    seccionId: "creatinas",
    tituloId: "creatinas-title",
    gridId: "creatine-grid",
    titulo: "Creatinas",
  },
  {
    key: "preentreno",
    seccionId: "pre-entrenos",
    tituloId: "preentrenos-title",
    gridId: "preworkout-grid",
    titulo: "Pre-entrenos",
  },
];

function Products() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // useEffect carga los productos cuando el componente aparece.
  useEffect(() => {
    let activo = true;

    obtenerProductos()
      .then((datos) => {
        if (activo) setProductos(datos);
      })
      .catch((err) => {
        if (!activo) return;
        setError(
          err.status
            ? err.message
            : "No se pudo conectar con la API. Comprueba que el backend esté iniciado.",
        );
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  function textoEstado() {
    if (cargando) return "Cargando productos...";
    if (error) return error;
    if (!productos.length) return "Todavía no hay productos registrados.";
    return `Mostrando ${productos.length} productos del catálogo.`;
  }

  return (
    <section className="products" id="productos">
      <div className="section-title">
        <p>CONOCE NUESTRO CATÁLOGO</p>
        <h2>Productos destacados</h2>
      </div>

      <p
        className={error ? "api-status error" : "api-status"}
        id="api-status"
        role="status"
        aria-live="polite"
      >
        {textoEstado()}
      </p>

      {categorias.map((categoria) => (
        <section
          key={categoria.key}
          className="product-category"
          id={categoria.seccionId}
          aria-labelledby={categoria.tituloId}
        >
          <h3 className="category-title" id={categoria.tituloId}>
            {categoria.titulo}
          </h3>

          <div className="product-grid" id={categoria.gridId}>
            {error ? (
              <p className="description">
                Catálogo no disponible en este momento.
              </p>
            ) : (
              productos
                .filter((producto) => producto.category === categoria.key)
                .map((producto) => (
                  <ProductCard key={producto._id} producto={producto} />
                ))
            )}
          </div>
        </section>
      ))}
    </section>
  );
}

export default Products;
