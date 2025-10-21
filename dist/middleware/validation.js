"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLanguageMiddleware = exports.validateRequest = exports.adminLoginSchema = exports.suggestionSchema = exports.waitlistSchema = exports.validateLanguage = void 0;
const joi_1 = __importDefault(require("joi"));
// Language validation regex for English and Italian
const ENGLISH_ITALIAN_REGEX = /^[a-zA-ZÀ-ÿ\s.,!?;:'"()-]+$/;
const validateLanguage = (text) => {
    if (!text || text.trim().length === 0) {
        return { isValid: false, error: 'Text cannot be empty' };
    }
    if (!ENGLISH_ITALIAN_REGEX.test(text)) {
        return {
            isValid: false,
            error: 'Only English and Italian languages are supported'
        };
    }
    // Simple language detection based on common Italian characters
    const hasItalianChars = /[À-ÿ]/.test(text);
    const detectedLanguage = hasItalianChars ? 'it' : 'en';
    return {
        isValid: true,
        detectedLanguage
    };
};
exports.validateLanguage = validateLanguage;
// Validation schemas
exports.waitlistSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    name: joi_1.default.string().min(2).max(50).required(),
    university: joi_1.default.string().min(2).max(100).required(),
    interests: joi_1.default.array().items(joi_1.default.string().min(1).max(50)).min(1).required(),
    language: joi_1.default.string().valid('en', 'it').required()
});
exports.suggestionSchema = joi_1.default.object({
    suggestion: joi_1.default.string().min(10).max(1000).required(),
    email: joi_1.default.string().email().required(),
    language: joi_1.default.string().valid('en', 'it').required()
});
exports.adminLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required()
});
// Middleware for validating request body
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message
            });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
// Middleware for language validation
const validateLanguageMiddleware = (field) => {
    return (req, res, next) => {
        const text = req.body[field];
        if (text) {
            const validation = (0, exports.validateLanguage)(text);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    error: validation.error
                });
            }
            // Add detected language to request body
            req.body.detectedLanguage = validation.detectedLanguage;
        }
        next();
    };
};
exports.validateLanguageMiddleware = validateLanguageMiddleware;
//# sourceMappingURL=validation.js.map