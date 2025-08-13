const express = require("express");
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const testimonialController = require("../controllers/testiomnialController");

router.get("/", testimonialController.getAllTestimonials);
router.get("/byAdmin", authenticate, authorize('admin'), testimonialController.getAllTestimonialsAdmin);
router.post("/", authenticate, authorize('user'), testimonialController.saveTestimonial);
router.put("/status/:id", authenticate, authorize('admin'), testimonialController.toggleActive);

module.exports = router;
