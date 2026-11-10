function AdminLogin() {
  return (
    <section id="login-section" aria-labelledby="login-title">
      <div className="section-title">
        <p>ZONA PRIVADA</p>
        <h1 id="login-title">Ingreso de administrador</h1>
      </div>

      <form className="form" id="login-form">
        <div className="form-group">
          <label htmlFor="login-user">Usuario</label>
          <input
            type="text"
            id="login-user"
            name="user"
            autoComplete="username"
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
            required
          />
        </div>

        <button className="buy-button" type="submit">
          Ingresar
        </button>
      </form>

      <p
        className="form-status"
        id="login-status"
        role="status"
        aria-live="polite"
      />
    </section>
  );
}

export default AdminLogin;
