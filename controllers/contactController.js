// controllers/contact.controller.js
const Contact = require("../models/contact.model");

exports.getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({
        phone: "000-000-0000",
        email: "default@email.com",
        address: "Default Address"
      });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const updateData = req.body;
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create(updateData);
    } else {
      contact = await Contact.findByIdAndUpdate(contact._id, updateData, { new: true });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
