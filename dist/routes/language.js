"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const languageController_1 = require("../controllers/languageController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/detect', languageController_1.detectLanguage);
router.get('/translations/:lang', languageController_1.getTranslations);
// Admin routes
router.get('/admin/stats', auth_1.authenticateToken, auth_1.requireAdmin, languageController_1.getLanguageStats);
exports.default = router;
//# sourceMappingURL=language.js.map