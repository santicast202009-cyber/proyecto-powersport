import { useCallback, useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

function leerToken() {
  try {
    return sessionStorage.getItem("ps_token");
  } catch {
    return null;
  }
}

function guardarToken(token) {
  try {
    sessionStorage.setItem("ps_token", token);
  } catch {
    // Sin almacenamiento disponible.
  }
}

function borrarToken() {
  try {
    sessionStorage.removeItem("ps_token");
  } catch {
    // Sin almacenamiento disponible.
  }
}

function AdminApp() {
  const [token, setToken] = useState(() => leerToken());
  const [mensajeLogin, setMensajeLogin] = useState("");

  const cerrarSesion = useCallback((mensaje = "") => {
    borrarToken();
    setToken(null);
    setMensajeLogin(mensaje);
  }, []);

  function handleLogin(nuevoToken) {
    guardarToken(nuevoToken);
    setMensajeLogin("");
    setToken(nuevoToken);
  }

  return (
    <>
      <header className="admin-header">
        <a href="/" className="admin-back">
          ← Volver a la tienda
        </a>
        <button
          type="button"
          id="logout-button"
          className="admin-logout"
          hidden={!token}
          onClick={() => cerrarSesion()}
        >
          Cerrar sesión
        </button>
      </header>

      <main className="admin-main">
        {token ? (
          <AdminPanel token={token} onSesionExpirada={cerrarSesion} />
        ) : (
          <AdminLogin onLogin={handleLogin} mensaje={mensajeLogin} />
        )}
      </main>
    </>
  );
}

export default AdminApp;
