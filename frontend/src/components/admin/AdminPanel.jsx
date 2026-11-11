import { useEffect, useState } from "react";
import MessageList from "./MessageList";
import StockList from "./StockList";
import {
  actualizarStock,
  obtenerMensajes,
  obtenerProductos,
} from "../../api";

function AdminPanel({ token, onSesionExpirada }) {
  const [mensajes, setMensajes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [estado, setEstado] = useState({ texto: "", error: false });

  // useEffect carga los datos privados cuando ya existe un token.
  useEffect(() => {
    let activo = true;

    Promise.all([obtenerMensajes(token), obtenerProductos()])
      .then(([mensajesData, productosData]) => {
        if (!activo) return;
        setMensajes(mensajesData);
        setProductos(productosData);
        setEstado({ texto: "", error: false });
      })
      .catch((error) => {
        if (!activo) return;

        if (error.status === 401) {
          onSesionExpirada("Tu sesión terminó. Ingresa de nuevo.");
          return;
        }

        const texto = error.status
          ? error.message
          : "No se pudo cargar el panel. ¿Está encendido el backend?";
        setErrorCarga(texto);
        setEstado({ texto, error: true });
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [token, onSesionExpirada]);

  async function guardarStock(id, stock) {
    try {
      const actualizado = await actualizarStock(id, stock, token);
      setProductos((actuales) =>
        actuales.map((producto) =>
          producto._id === actualizado._id ? actualizado : producto,
        ),
      );
      setEstado({
        texto: `Stock de "${actualizado.name}" actualizado.`,
        error: false,
      });
    } catch (error) {
      if (error.status === 401) {
        onSesionExpirada("Tu sesión terminó. Ingresa de nuevo.");
        return;
      }

      setEstado({
        texto: error.status
          ? error.message
          : "No se pudo actualizar el stock. Intenta de nuevo.",
        error: true,
      });
    }
  }

  return (
    <section id="panel-section">
      <div className="section-title">
        <p>GESTIÓN INTERNA</p>
        <h1>Panel de administración</h1>
      </div>

      <p
        className={estado.error ? "form-status error" : "form-status"}
        id="panel-status"
        role="status"
        aria-live="polite"
      >
        {estado.texto}
      </p>

      {cargando ? (
        <p className="description">Cargando panel...</p>
      ) : errorCarga ? null : (
        <>
          <h2 className="admin-title">Mensajes de contacto</h2>
          <div id="messages-list" className="admin-list">
            <MessageList mensajes={mensajes} />
          </div>

          <h2 className="admin-title">Inventario</h2>
          <div id="stock-list" className="admin-list">
            <StockList productos={productos} onGuardar={guardarStock} />
          </div>
        </>
      )}
    </section>
  );
}

export default AdminPanel;
