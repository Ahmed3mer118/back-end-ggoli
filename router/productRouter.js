const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers")
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const uploads = require('../middleware/uploads.middleware');

router.get("/", productControllers.getProducts);
router.get("/slug/:routeProduct", productControllers.getProductsbyRouteProduct);

router.get("/send/stock", authenticate, authorize('admin'), productControllers.checkStock);
router.get("/:routeProduct", productControllers.getProductsbyId);
router.post("/", authenticate, authorize('admin'), uploads.single('image'), productControllers.addProduct);
router.post('/get-multiple', productControllers.getMultipleProductsByIds)
router.put("/:routeProduct", authenticate, authorize('admin'), uploads.single('image'), productControllers.updateProduct);
router.put("/:routeProduct/status", authenticate, authorize('admin'), productControllers.updateStatusProduct);

module.exports = router;
