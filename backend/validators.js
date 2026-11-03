function validateContact(body) {
  const source = body && typeof body === "object" ? body : {};
  const clean = (value) => (typeof value === "string" ? value.trim() : "");

  const name = clean(source.name);
  const email = clean(source.email).toLowerCase();
  const message = clean(source.message);

  const errors = [];
  if (name.length < 2 || name.length > 80) {
    errors.push("El nombre debe tener entre 2 y 80 caracteres.");
  }
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Escribe un correo válido.");
  }
  if (message.length < 10 || message.length > 1000) {
    errors.push("El mensaje debe tener entre 10 y 1000 caracteres.");
  }

  return { errors, data: { name, email, message } };
}

module.exports = { validateContact };