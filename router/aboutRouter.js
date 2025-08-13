const express = require("express")
const router = express.Router()
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const uploads = require('../middleware/uploads.middleware');

const aboutController = require("../controllers/aboutController")
router.get("/", aboutController.getAboutSection);
router.put("/", authenticate, authorize('admin'), uploads.single('image'), aboutController.updateAboutSection);

module.exports = router;