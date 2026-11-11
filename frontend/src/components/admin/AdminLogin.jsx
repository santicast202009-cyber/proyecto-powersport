import { useState } from "react";
import { iniciarSesion } from "../../api";

function AdminLogin({ onLogin, mensaje }) {
  const [credenciales, setCredenciales] = useState({
    user: "",
    password: "",
  });
  const [estado, setEstado] = useState(() => ({
    texto: mensaje || "",
    error: Boolean(mensaje),
  }));
  const [enviando, setEnviando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setCredenciales((actual) => ({ ...actual, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!credenciales.user.trim()) {
      setEstado({ texto: "Escribe el usuario.", error: true });
      return;
    }

    if (!credenciales.password) {
      setEstado({ texto: "Escribe la contraseña.", error: true });
      return;
    }

    setEnviando(true);

    try {
      const data = await iniciarSesion({
        user: credenciales.user.trim(),
        password: credenciales.password,
      });
      onLogin(data.token);
    } catch (error) {
      setEstado({
        texto: error.status
          ? error.message
          : "No se pudo conectar con la API. ¿Está encendido el backend?",
        error: true,
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="login-section" aria-labelledby="login-title">
      <div className="section-title">
        <p>ZONA PRIVADA</p>
        <h1 id="login-title">Ingreso de administrador</h1>
      </div>

      <form className="form" id="login-form" noValidate onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-user">Usuario</label>
          <input
            type="text"
            id="login-user"
            name="user"
            autoComplete="username"
            value={credenciales.user}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Contraseña</label>
          <input
            type="password"
            id="login-password"
            name="password"
            autoComplete="current-password"
            value={credenciales.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="buy-button" type="submit" disabled={enviando}>
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p
        className={estado.error ? "form-status error" : "form-status"}
        id="login-status"
        role="status"
        aria-live="polite"
      >
        {estado.texto}
      </p>
    </section>
  );
}

export default AdminLogin;
