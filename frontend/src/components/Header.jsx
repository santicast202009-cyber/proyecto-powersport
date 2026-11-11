import { useState } from "react";

const enlaces = [
  { href: "#inicio", texto: "Inicio" },
  { href: "#productos", texto: "Productos" },
  { href: "#nosotros", texto: "Nosotros" },
  { href: "#contacto", texto: "Contacto" },
];

function Header() {
  // useState guarda si el menú móvil está abierto.
  const [menuAbierto, setMenuAbierto] = useState(false);

  function alternarMenu() {
    setMenuAbierto((abierto) => !abierto);
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <header className="header">
      <button
        className="menu-button"
        type="button"
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuAbierto}
        aria-controls="main-nav"
        onClick={alternarMenu}
      >
        ☰
      </button>

      <a
        href="#inicio"
        className="logo"
        aria-label="PowerSport, inicio"
        onClick={cerrarMenu}
      >
        <img src="/img/logo-powersport.jpeg" alt="Logo de PowerSport" />
      </a>

      <nav
        className={menuAbierto ? "nav is-open" : "nav"}
        id="main-nav"
        aria-label="Navegación principal"
      >
        {enlaces.map((enlace) => (
          <a key={enlace.href} href={enlace.href} onClick={cerrarMenu}>
            {enlace.texto}
          </a>
        ))}
      </nav>

      <a
        href="#productos"
        className="cart"
        aria-label="Ir al catálogo"
        title="Ver productos"
        onClick={cerrarMenu}
      >
        🛒
      </a>
    </header>
  );
}

export default Header;
