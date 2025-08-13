const Testimonial = require("../models/testimonial.model");

// للمستخدم العادي
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// للأدمن
exports.getAllTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// إضافة feedback
exports.saveTestimonial = async (req, res) => {
  try {
    const { name,comment, rating } = req.body;
    if (!req.user) return res.status(401).json({ message: "You must be logged in" });

    const testimonial = await Testimonial.create({
      name,
      comment,
      rating,
      isActive: true,
      userId: req.user._id
    });

    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// toggle show/hide
exports.toggleActive = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Not found" });

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
