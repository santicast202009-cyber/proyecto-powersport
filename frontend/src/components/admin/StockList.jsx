function StockList({ productos }) {
  return productos.map((producto) => (
    <div className="admin-item admin-stock" key={producto._id}>
      <span>
        {producto.name} ({producto.brand})
      </span>

      <input
        type="number"
        min={0}
        step={1}
        defaultValue={producto.stock}
        aria-label={`Stock de ${producto.name}`}
      />

      <button type="button" className="buy-button">
        Guardar
      </button>
    </div>
  ));
}

export default StockList;
