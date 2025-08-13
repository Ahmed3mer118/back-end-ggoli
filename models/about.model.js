const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description1: { type: String, required: true },
  description2: { type: String },
  image: { type: String, required: true },
  features: {
    type: [
      {
        icon: String,
        title: String,
        text: String
      }
    ],
    default: [
      { icon: "fas fa-shipping-fast", title: "Fast Delivery", text: "Within 24–48 hours" },
      { icon: "fas fa-headset", title: "Customer Support", text: "24/7 Availability" },
    //   { icon: "fas fa-medal"}
    ]
  }
  
}, { timestamps: true });

module.exports = mongoose.model("About", aboutSchema);
