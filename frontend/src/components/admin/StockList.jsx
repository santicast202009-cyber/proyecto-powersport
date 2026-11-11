import StockItem from "./StockItem";

function StockList({ productos, onGuardar }) {
  if (!productos.length) {
    return <p>No hay productos registrados.</p>;
  }

  return productos.map((producto) => (
    <StockItem
      key={producto._id}
      producto={producto}
      onGuardar={onGuardar}
    />
  ));
}

export default StockList;
