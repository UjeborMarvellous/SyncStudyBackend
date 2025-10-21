"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const validation_2 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Public routes
router.post('/login', (0, validation_1.validateRequest)(validation_2.adminLoginSchema), adminController_1.adminLogin);
router.post('/signup', adminController_1.adminSignup);
// Protected routes
router.get('/profile', auth_1.authenticateToken, adminController_1.getAdminProfile);
router.get('/dashboard', auth_1.authenticateToken, adminController_1.getDashboardStats);
exports.default = router;
//# sourceMappingURL=admin.js.map