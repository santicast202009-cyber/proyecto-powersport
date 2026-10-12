const express = require("express");
const cors = require("cors");
const products = require("./products.json");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});