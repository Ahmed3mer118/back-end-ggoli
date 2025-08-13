// models/contact.model.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  socialLinks: {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" }
  },
  location: { type: String},
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);
