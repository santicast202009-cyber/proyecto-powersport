const enlaces = [
  { href: "#inicio", texto: "Inicio" },
  { href: "#productos", texto: "Productos" },
  { href: "#nosotros", texto: "Nosotros" },
  { href: "#contacto", texto: "Contacto" },
];

function Header() {
  return (
    <header className="header">
      <button
        className="menu-button"
        type="button"
        aria-label="Abrir menú"
        aria-expanded="false"
        aria-controls="main-nav"
      >
        ☰
      </button>

      <a href="#inicio" className="logo" aria-label="PowerSport, inicio">
        <img src="/img/logo-powersport.jpeg" alt="Logo de PowerSport" />
      </a>

      <nav className="nav" id="main-nav" aria-label="Navegación principal">
        {enlaces.map((enlace) => (
          <a key={enlace.href} href={enlace.href}>
            {enlace.texto}
          </a>
        ))}
      </nav>

      <a
        href="#productos"
        className="cart"
        aria-label="Ir al catálogo"
        title="Ver productos"
      >
        🛒
      </a>
    </header>
  );
}

export default Header;
