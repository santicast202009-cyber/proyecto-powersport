require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Product = require("./models/Product");
const Message = require("./models/Message");
const { validateContact } = require("./validators");
const initialProducts = require("./products.json");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/powersport";
const { JWT_SECRET, ADMIN_USER, ADMIN_PASSWORD } = process.env;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

if (!JWT_SECRET || !ADMIN_USER || !ADMIN_PASSWORD) {
  console.error("Falta configurar JWT_SECRET, ADMIN_USER y ADMIN_PASSWORD en el archivo .env");
  process.exit(1);
}

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5500")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ---------- Productos ----------
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().select("-__v");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudieron obtener los productos." });
  }
});

// ---------- Contacto ----------
app.post("/api/contact", async (req, res) => {
  const { errors, data } = validateContact(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }
  try {
    await Message.create(data);
    res.status(201).json({ ok: true, message: "¡Gracias! Recibimos tu mensaje y te responderemos pronto." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo guardar tu mensaje. Intenta de nuevo." });
  }
});

// ---------- Chatbot con Gemini ----------
const CATEGORIAS = {
  proteina: "Proteínas",
  creatina: "Creatinas",
  preentreno: "Pre-entrenos",
};

function limitarTexto(valor, maximo) {
  return typeof valor === "string" ? valor.trim().slice(0, maximo) : "";
}

async function obtenerContextoProductos() {
  const productos = await Product.find()
    .select("name brand description price stock category")
    .lean();

  if (!productos.length) {
    return "Todavía no hay productos registrados.";
  }

  const formatoPrecio = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

  const lineas = productos.map((producto) => {
    const categoria = CATEGORIAS[producto.category] || producto.category;
    const estado =
      producto.stock > 0
        ? `DISPONIBLE (${producto.stock} unidades)`
        : "AGOTADO";
    return `- ${producto.name} (${producto.brand}) | ${categoria} | ${formatoPrecio.format(producto.price)} | Estado: ${estado} | ${producto.description}`;
  });

  const agotados = productos
    .filter((producto) => producto.stock === 0)
    .map((producto) => producto.name);

  const resumenAgotados = agotados.length
    ? `\nProductos agotados actualmente: ${agotados.join(", ")}.`
    : "\nNo hay productos agotados actualmente.";

  return `${lineas.join("\n")}${resumenAgotados}`;
}

function construirInstruccion(productos) {
  return `Eres el asistente virtual de PowerSport, una tienda de suplementos deportivos.

Responde siempre en español, con un tono amable, claro y breve (máximo 120 palabras).
Responde en texto plano, sin Markdown: no uses **, *, # ni tablas. Si necesitas una lista, usa guiones.
Usa únicamente la información de la tienda y del catálogo que aparece abajo. No inventes productos, precios, stock ni promociones.
No recomiendes marcas ni productos que no aparezcan en el catálogo.
Para preguntas de disponibilidad, revisa el campo "Estado" de cada producto. Los que dicen "AGOTADO" no están disponibles. No afirmes que todos están disponibles sin revisar la lista de agotados.
Si no tienes la información, dilo y recomienda usar el formulario de contacto de la página o revisar la sección de productos.
No des diagnósticos, tratamientos ni consejos médicos. Si te preguntan por salud, recomienda consultar a un profesional.
No proceses pagos ni pidas datos personales, contraseñas o información sensible.
Para comprar o resolver un pedido, indica que escriba por el formulario de contacto.

Catálogo actual:
${productos}`;
}

app.post("/api/chat", async (req, res) => {
  const mensaje = limitarTexto(req.body?.message, 500);

  if (mensaje.length < 2) {
    return res.status(400).json({ error: "Escribe una pregunta un poco más larga." });
  }

  if (!GEMINI_API_KEY) {
    return res.status(503).json({
      error: "El chatbot no está configurado. Falta GEMINI_API_KEY en el backend.",
    });
  }

  const historial = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
  const contents = [];

  for (const item of historial) {
    if (!item || !["user", "assistant"].includes(item.role)) continue;

    const texto = limitarTexto(item.content, 1000);
    if (!texto) continue;

    contents.push({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: texto }],
    });
  }

  contents.push({ role: "user", parts: [{ text: mensaje }] });

  try {
    const contexto = await obtenerContextoProductos();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    const respuestaGemini = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: construirInstruccion(contexto) }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
      }),
      signal: AbortSignal.timeout(25000),
    });

    const data = await respuestaGemini.json().catch(() => ({}));

    if (!respuestaGemini.ok) {
      console.error(
        "Gemini respondió con error:",
        respuestaGemini.status,
        data?.error?.message || "",
      );

      if (respuestaGemini.status === 404) {
        return res.status(502).json({
          error: "El modelo de Gemini configurado ya no está disponible. Revisa GEMINI_MODEL en el backend.",
        });
      }

      if (respuestaGemini.status === 429) {
        return res.status(429).json({
          error: "El asistente está recibiendo muchas solicitudes. Intenta de nuevo en un momento.",
        });
      }

      return res.status(502).json({
        error: "El asistente no está disponible en este momento. Intenta de nuevo más tarde.",
      });
    }

    const respuesta = (data.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join("")
      .trim();

    if (!respuesta) {
      console.error(
        "Gemini no devolvió texto. Motivo:",
        data?.promptFeedback?.blockReason || "sin motivo",
      );
      return res.status(502).json({
        error: "No pude generar una respuesta. Intenta reformular tu pregunta.",
      });
    }

    res.json({ reply: respuesta });
  } catch (error) {
    console.error("Error al consultar Gemini:", error.message);
    res.status(502).json({
      error: "No se pudo conectar con el asistente. Intenta de nuevo más tarde.",
    });
  }
});

// ---------- Administrador ----------
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Debes iniciar sesión." });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Sesión inválida o vencida." });
  }
}

app.post("/api/admin/login", (req, res) => {
  const { user, password } = req.body || {};

  if (user !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

app.get("/api/admin/messages", requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().select("-__v").sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudieron obtener los mensajes." });
  }
});

app.patch("/api/admin/products/:id/stock", requireAdmin, async (req, res) => {
  const stock = Number(req.body?.stock);

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID de producto no válido." });
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: "El stock debe ser un número entero mayor o igual a 0." });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    ).select("-__v");

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo actualizar el stock." });
  }
});

// ---------- Arranque ----------
async function seedIfEmpty() {
  const total = await Product.countDocuments();
  if (total === 0) {
    const toInsert = initialProducts.map(({ id, ...product }) => product);
    await Product.insertMany(toInsert);
    console.log(`Se cargaron ${toInsert.length} productos iniciales.`);
  }
}

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB conectado.");
    await seedIfEmpty();
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
}

start();