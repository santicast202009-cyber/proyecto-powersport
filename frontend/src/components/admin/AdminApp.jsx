import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

function AdminApp() {
  return (
    <>
      <header className="admin-header">
        <a href="/" className="admin-back">
          ← Volver a la tienda
        </a>
        <button type="button" id="logout-button" className="admin-logout" hidden>
          Cerrar sesión
        </button>
      </header>

      <main className="admin-main">
        <AdminLogin />
        <AdminPanel visible={false} />
      </main>
    </>
  );
}

export default AdminApp;
