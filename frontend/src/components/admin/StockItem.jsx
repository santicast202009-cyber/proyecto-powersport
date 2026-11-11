import { useState } from "react";

function StockItem({ producto }) {
  const [stock, setStock] = useState(producto.stock);

  return (
    <div className="admin-item admin-stock">
      <span>
        {producto.name} ({producto.brand})
      </span>

      <input
        type="number"
        min={0}
        step={1}
        value={stock}
        onChange={(event) => setStock(event.target.value)}
        aria-label={`Stock de ${producto.name}`}
      />

      <button type="button" className="buy-button">
        Guardar
      </button>
    </div>
  );
}

export default StockItem;
