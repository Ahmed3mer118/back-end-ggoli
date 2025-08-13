const express = require("express")
const router = express.Router()
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const uploads = require('../middleware/uploads.middleware');

const heroController = require("../controllers/heroController")
router.get("/", heroController.getHeroSection);
router.put("/", authenticate, authorize('admin'), uploads.single('image'), heroController.updateHeroSection);

module.exports = router;