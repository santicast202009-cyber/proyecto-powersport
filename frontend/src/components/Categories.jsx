const categorias = [
  {
    href: "#proteinas",
    icono: "💪",
    titulo: "Proteínas",
    texto: "Opciones para complementar tu alimentación deportiva.",
  },
  {
    href: "#creatinas",
    icono: "⚡",
    titulo: "Creatinas",
    texto: "Suplementos para acompañar tus entrenamientos de fuerza.",
  },
  {
    href: "#pre-entrenos",
    icono: "🔥",
    titulo: "Pre-entrenos",
    texto: "Encuentra productos para tu rutina de entrenamiento.",
  },
];

function Categories() {
  return (
    <section className="categories" aria-labelledby="categories-title">
      <div className="section-title">
        <p>ENCUENTRA LO QUE NECESITAS</p>
        <h2 id="categories-title">Nuestras categorías</h2>
      </div>

      <div className="category-container">
        {categorias.map((categoria) => (
          <a key={categoria.href} href={categoria.href} className="category-card">
            <div className="category-icon" aria-hidden="true">
              {categoria.icono}
            </div>
            <h3>{categoria.titulo}</h3>
            <p>{categoria.texto}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Categories;
