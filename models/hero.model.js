const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  buttonText: { type: String, required: true },
  buttonLink: { type: String, required: true },
  backgroundImage: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Hero", heroSchema);
