import { useState } from "react";

function AdminLogin() {
  const [credenciales, setCredenciales] = useState({
    user: "",
    password: "",
  });
  const [estado, setEstado] = useState({ texto: "", error: false });

  function handleChange(event) {
    const { name, value } = event.target;
    setCredenciales((actual) => ({ ...actual, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!credenciales.user.trim()) {
      setEstado({ texto: "Escribe el usuario.", error: true });
      return;
    }

    if (!credenciales.password.trim()) {
      setEstado({ texto: "Escribe la contraseña.", error: true });
      return;
    }

    // El inicio de sesión real se conecta a la API en la Fase 5.
    setEstado({
      texto: "Datos válidos. El inicio de sesión se conectará a la API en la Fase 5.",
      error: false,
    });
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

        <button className="buy-button" type="submit">
          Ingresar
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
