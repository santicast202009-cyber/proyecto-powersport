function ContactForm() {
  return (
    <section className="contact" id="contacto" aria-labelledby="contact-title">
      <div className="section-title">
        <p>ESCRÍBENOS</p>
        <h2 id="contact-title">Contacto</h2>
      </div>

      <form className="form" id="contact-form" noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact-name">Nombre</label>
            <input
              type="text"
              id="contact-name"
              name="name"
              maxLength={80}
              placeholder="Tu nombre"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">Correo</label>
            <input
              type="email"
              id="contact-email"
              name="email"
              maxLength={120}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="contact-message">Mensaje</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={1000}
            placeholder="Cuéntanos qué necesitas"
            required
          />
        </div>

        <button className="buy-button" type="submit">
          Enviar mensaje
        </button>
      </form>

      <p
        className="form-status"
        id="contact-status"
        role="status"
        aria-live="polite"
      />
    </section>
  );
}

export default ContactForm;
