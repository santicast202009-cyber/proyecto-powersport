import StockItem from "./StockItem";

function StockList({ productos }) {
  return productos.map((producto) => (
    <StockItem key={producto._id} producto={producto} />
  ));
}

export default StockList;
