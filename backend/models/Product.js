const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ["proteina", "creatina", "preentreno"]
  },
  image: { type: String, default: "" }
});

module.exports = mongoose.model("Product", productSchema);