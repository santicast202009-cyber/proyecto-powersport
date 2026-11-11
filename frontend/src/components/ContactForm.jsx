import { useState } from "react";
import { enviarMensajeContacto } from "../api";

function ContactForm() {
  // useState guarda lo que la persona escribe en cada campo.
  const [formulario, setFormulario] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [estado, setEstado] = useState({ texto: "", error: false });
  const [enviando, setEnviando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function mostrarEstado(texto, error) {
    setEstado({ texto, error });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nombre = formulario.name.trim();
    const correo = formulario.email.trim();
    const mensaje = formulario.message.trim();

    if (nombre.length < 2 || nombre.length > 80) {
      mostrarEstado("El nombre debe tener entre 2 y 80 caracteres.", true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      mostrarEstado("Escribe un correo válido.", true);
      return;
    }

    if (mensaje.length < 10 || mensaje.length > 1000) {
      mostrarEstado("El mensaje debe tener entre 10 y 1000 caracteres.", true);
      return;
    }

    setEnviando(true);

    try {
      const data = await enviarMensajeContacto({
        name: nombre,
        email: correo,
        message: mensaje,
      });
      mostrarEstado(data.message, false);
      setFormulario({ name: "", email: "", message: "" });
    } catch (error) {
      mostrarEstado(
        error.status
          ? error.message
          : "No se pudo enviar el mensaje. Intenta de nuevo más tarde.",
        true,
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="contact" id="contacto" aria-labelledby="contact-title">
      <div className="section-title">
        <p>ESCRÍBENOS</p>
        <h2 id="contact-title">Contacto</h2>
      </div>

      <form className="form" id="contact-form" noValidate onSubmit={handleSubmit}>
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
              value={formulario.name}
              onChange={handleChange}
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
              value={formulario.email}
              onChange={handleChange}
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
            value={formulario.message}
            onChange={handleChange}
            required
          />
        </div>

        <button className="buy-button" type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>

      <p
        className={estado.error ? "form-status error" : "form-status"}
        id="contact-status"
        role="status"
        aria-live="polite"
      >
        {estado.texto}
      </p>
    </section>
  );
}

export default ContactForm;
