const express = require("express")
const router = express.Router()
const orderControllers = require("../controllers/orderControllers")
const { authenticate } = require("../middleware/auth.middleware");
const { authorize, authorizePermissions, allow } = require("../middleware/role.middleware");
const { createOrder, getMyOrders, getMyOrderById ,cancelMyOrder } = orderControllers

// admin or sub-admin with orders permission
router.get("/byAdmin", authenticate, allow({ roles: ['admin'], permissions: ['orders:read'] }), orderControllers.getAllOrders);
router.get("/:id/byAdmin", authenticate, allow({ roles: ['admin'], permissions: ['orders:read'] }), orderControllers.getOrderById);
router.get('/multiple/:ids/byAdmin',authenticate, orderControllers.getOrdersByIdsAdmin);
router.post("/send/:id/byAdmin", authenticate, allow({ roles: ['admin'], permissions: ['orders:update'] }), orderControllers.addOrderToShipping);
router.put("/status/:id/byAdmin", authenticate, allow({ roles: ['admin'], permissions: ['orders:update'] }), orderControllers.updateStatusOrder);
// router.delete("/:id/byAdmin", authenticate, authorize('admin'), orderControllers.deleteOrder);

// user 
router.get("/",authenticate , getMyOrders);
router.get("/:id", authenticate, getMyOrderById);
router.post("/", authenticate, authorize('user'), createOrder);
router.put("/cancel/:id/status", authenticate, authorize('user'), cancelMyOrder);

module.exports = router