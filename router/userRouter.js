const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers")
const { authenticate } = require('../middleware/auth.middleware');
const { authorize, allow } = require('../middleware/role.middleware');
router.get("/byAdmin",authenticate, authorize('admin') ,  userControllers.getUsers )
router.get("/byAdmin/:id", authenticate, authorize('admin'), userControllers.getUsersById);
router.put('/byAdmin/:id/permissions', authenticate, authorize('admin'), userControllers.updateUserPermissionsByAdmin);
router.get('/byAdmin/permissions/catalog', authenticate, authorize('admin'), userControllers.getPermissionsCatalog);
router.get('/byAdmin/:id/permissions', authenticate, authorize('admin'), userControllers.getUserPermissionsByAdmin);
router.get("/", authenticate, authorize('user'), userControllers.getUsersById);
router.put("/update", authenticate, authorize('user'), userControllers.updateUserById);

module.exports = router;
