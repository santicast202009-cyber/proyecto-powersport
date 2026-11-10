function MessageList({ mensajes }) {
  if (!mensajes.length) {
    return <p>Aún no hay mensajes.</p>;
  }

  return mensajes.map((mensaje) => (
    <article className="admin-item" key={mensaje._id}>
      <h3>
        {mensaje.name} · {mensaje.email}
      </h3>
      <p className="admin-date">
        {new Date(mensaje.createdAt).toLocaleString("es-CO")}
      </p>
      <p>{mensaje.message}</p>
    </article>
  ));
}

export default MessageList;
