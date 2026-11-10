function formatPrice(price) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductCard({ producto }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {producto.image ? (
          <img src={producto.image} alt={producto.name} loading="lazy" />
        ) : (
          <p className="image-placeholder">Imagen próximamente</p>
        )}
      </div>

      <div className="product-info">
        <span className="brand">{producto.brand}</span>
        <h3>{producto.name}</h3>
        <p className="description">{producto.description}</p>
        <p className="price">{formatPrice(producto.price)}</p>
        <p className="stock">
          {producto.stock > 0 ? `Disponible: ${producto.stock}` : "Agotado"}
        </p>
        <button className="buy-button" type="button">
          Ver producto
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
