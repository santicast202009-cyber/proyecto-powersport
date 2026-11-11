import { useEffect, useRef, useState } from "react";
import { enviarMensajeChat } from "../api";

const MENSAJE_BIENVENIDA = {
  id: "bienvenida",
  role: "assistant",
  text: "¡Hola! Soy el asistente de PowerSport. Puedo ayudarte con productos, precios, stock y cómo contactarnos. ¿Qué necesitas?",
};

function crearId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([MENSAJE_BIENVENIDA]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const listaRef = useRef(null);
  const inputRef = useRef(null);

  // useEffect baja la lista cuando llega un mensaje nuevo.
  useEffect(() => {
    if (!abierto) return;
    const lista = listaRef.current;
    if (lista) lista.scrollTop = lista.scrollHeight;
  }, [abierto, mensajes, enviando]);

  useEffect(() => {
    if (abierto) inputRef.current?.focus();
  }, [abierto]);

  async function handleSubmit(event) {
    event.preventDefault();

    const limpio = texto.trim();
    if (!limpio || enviando) return;

    const mensajeUsuario = {
      id: crearId(),
      role: "user",
      text: limpio,
    };

    const historial = mensajes
      .filter((mensaje) => mensaje.id !== "bienvenida")
      .slice(-8)
      .map((mensaje) => ({
        role: mensaje.role,
        content: mensaje.text,
      }));

    setMensajes((actuales) => [...actuales, mensajeUsuario]);
    setTexto("");
    setError("");
    setEnviando(true);

    try {
      const data = await enviarMensajeChat(limpio, historial);
      setMensajes((actuales) => [
        ...actuales,
        {
          id: crearId(),
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (err) {
      setError(
        err.status
          ? err.message
          : "No se pudo conectar con el asistente. Revisa que el backend esté iniciado.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="chatbot">
      {abierto && (
        <section className="chat-panel" id="chat-panel" aria-label="Asistente de PowerSport">
          <header className="chat-header">
            <div>
              <h2 className="chat-title">Asistente PowerSport</h2>
              <p className="chat-subtitle">Productos, precios y stock · IA</p>
            </div>
            <button
              type="button"
              className="chat-close"
              aria-label="Cerrar chat"
              onClick={() => setAbierto(false)}
            >
              ✕
            </button>
          </header>

          <div className="chat-messages" ref={listaRef} role="log" aria-live="polite">
            {mensajes.map((mensaje) => (
              <div key={mensaje.id} className={`chat-message ${mensaje.role}`}>
                {mensaje.text}
              </div>
            ))}

            {enviando && (
              <div className="chat-message assistant typing">Escribiendo...</div>
            )}
          </div>

          {error && (
            <p className="chat-error" role="status" aria-live="polite">
              {error}
            </p>
          )}

          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              maxLength={500}
              placeholder="Escribe tu pregunta..."
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              disabled={enviando}
              aria-label="Mensaje para el asistente"
            />
            <button
              className="chat-send"
              type="submit"
              disabled={enviando || !texto.trim()}
              aria-label="Enviar mensaje"
            >
              ➤
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chat-toggle"
        aria-label={abierto ? "Cerrar chat" : "Abrir chat"}
        aria-expanded={abierto}
        aria-controls="chat-panel"
        onClick={() => setAbierto((valor) => !valor)}
      >
        {abierto ? "✕" : "💬"}
      </button>
    </div>
  );
}

export default Chatbot;
