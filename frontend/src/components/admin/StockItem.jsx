import { useState } from "react";

function StockItem({ producto, onGuardar }) {
  const [stock, setStock] = useState(producto.stock);
  const [guardando, setGuardando] = useState(false);

  async function handleGuardar() {
    setGuardando(true);
    try {
      await onGuardar(producto._id, Number(stock));
    } finally {
      setGuardando(false);
    }
  }

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

      <button
        type="button"
        className="buy-button"
        onClick={handleGuardar}
        disabled={guardando}
      >
        {guardando ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
}

export default StockItem;
