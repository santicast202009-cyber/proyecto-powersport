import MessageList from "./MessageList";
import StockList from "./StockList";
import mensajes from "../../data/mensajes";
import productos from "../../data/productos";

function AdminPanel({ visible = false }) {
  return (
    <section id="panel-section" hidden={!visible}>
      <div className="section-title">
        <p>GESTIÓN INTERNA</p>
        <h1>Panel de administración</h1>
      </div>

      <p
        className="form-status"
        id="panel-status"
        role="status"
        aria-live="polite"
      />

      <h2 className="admin-title">Mensajes de contacto</h2>
      <div id="messages-list" className="admin-list">
        <MessageList mensajes={mensajes} />
      </div>

      <h2 className="admin-title">Inventario</h2>
      <div id="stock-list" className="admin-list">
        <StockList productos={productos} />
      </div>
    </section>
  );
}

export default AdminPanel;
