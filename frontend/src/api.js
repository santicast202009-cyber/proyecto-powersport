const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function peticion(ruta, opciones = {}) {
  if (!API_URL) {
    throw new Error("Falta configurar VITE_API_URL en el archivo .env.");
  }

  const { headers, ...resto } = opciones;
  const response = await fetch(`${API_URL}${ruta}`, {
    ...resto,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const mensaje = (data.errors || [data.error || "Error en la petición."]).join(" ");
    const error = new Error(mensaje);
    error.status = response.status;
    throw error;
  }

  return data;
}

export function obtenerProductos() {
  return peticion("/api/products");
}

export function enviarMensajeContacto(datos) {
  return peticion("/api/contact", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function iniciarSesion(credenciales) {
  return peticion("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(credenciales),
  });
}

export function obtenerMensajes(token) {
  return peticion("/api/admin/messages", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function actualizarStock(id, stock, token) {
  return peticion(`/api/admin/products/${id}/stock`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ stock }),
  });
}
