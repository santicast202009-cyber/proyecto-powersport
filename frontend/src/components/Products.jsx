import ProductCard from "./ProductCard";
import productos from "../data/productos";

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
  return (
    <section className="products" id="productos">
      <div className="section-title">
        <p>CONOCE NUESTRO CATÁLOGO</p>
        <h2>Productos destacados</h2>
      </div>

      <p className="api-status" id="api-status" role="status" aria-live="polite">
        Mostrando {productos.length} productos del catálogo.
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
            {productos
              .filter((producto) => producto.category === categoria.key)
              .map((producto) => (
                <ProductCard key={producto._id} producto={producto} />
              ))}
          </div>
        </section>
      ))}
    </section>
  );
}

export default Products;
