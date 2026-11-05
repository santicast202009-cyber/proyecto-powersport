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

if (!JWT_SECRET || !ADMIN_USER || !ADMIN_PASSWORD) {
  console.error("Falta configurar JWT_SECRET, ADMIN_USER y ADMIN_PASSWORD en el archivo .env");
  process.exit(1);
}

app.use(cors());
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