const express = require("express");
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const reportController = require("../controllers/reports.controller");


router.get("/", authenticate, authorize('admin'), reportController.getSalesReports);


module.exports = router;
