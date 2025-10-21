"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const suggestionController_1 = require("../controllers/suggestionController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const validation_2 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Public routes
router.post('/', (0, validation_1.validateRequest)(validation_2.suggestionSchema), (0, validation_1.validateLanguageMiddleware)('suggestion'), suggestionController_1.submitSuggestion);
// Admin routes
router.get('/admin', auth_1.authenticateToken, auth_1.requireAdmin, suggestionController_1.getAllSuggestions);
router.delete('/admin/:id', auth_1.authenticateToken, auth_1.requireAdmin, suggestionController_1.deleteSuggestion);
router.patch('/admin/:id/status', auth_1.authenticateToken, auth_1.requireAdmin, suggestionController_1.updateSuggestionStatus);
exports.default = router;
//# sourceMappingURL=suggestions.js.map