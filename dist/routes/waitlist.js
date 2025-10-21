"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waitlistController_1 = require("../controllers/waitlistController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const validation_2 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Public routes
router.post('/', (0, validation_1.validateRequest)(validation_2.waitlistSchema), (0, validation_1.validateLanguageMiddleware)('name'), waitlistController_1.submitWaitlistEntry);
// Admin routes
router.get('/admin', auth_1.authenticateToken, auth_1.requireAdmin, waitlistController_1.getAllWaitlistEntries);
router.delete('/admin/:id', auth_1.authenticateToken, auth_1.requireAdmin, waitlistController_1.deleteWaitlistEntry);
router.get('/admin/stats', auth_1.authenticateToken, auth_1.requireAdmin, waitlistController_1.getWaitlistStats);
exports.default = router;
//# sourceMappingURL=waitlist.js.map