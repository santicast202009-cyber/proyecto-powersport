const beneficios = [
  {
    icono: "✓",
    titulo: "Marcas reconocidas",
    texto: "Un catálogo organizado por categorías para comparar opciones.",
  },
  {
    icono: "🚚",
    titulo: "Atención cercana",
    texto: "Queremos ayudarte a encontrar el producto que buscas.",
  },
  {
    icono: "💬",
    titulo: "Asesoría",
    texto: "Consulta la información del producto antes de comprar.",
  },
];

function About() {
  return (
    <section className="about" id="nosotros">
      <div className="section-title">
        <p>POWERSPORT</p>
        <h2>¿Por qué elegirnos?</h2>
      </div>

      <div className="benefits">
        {beneficios.map((beneficio) => (
          <article className="benefit" key={beneficio.titulo}>
            <span aria-hidden="true">{beneficio.icono}</span>
            <h3>{beneficio.titulo}</h3>
            <p>{beneficio.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default About;
