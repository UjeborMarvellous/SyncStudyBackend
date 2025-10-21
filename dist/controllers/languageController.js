"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageStats = exports.getTranslations = exports.detectLanguage = void 0;
const firebase_1 = require("../config/firebase");
const detectLanguage = async (req, res) => {
    try {
        const { userAgent } = req.headers;
        const { preferredLanguage } = req.body;
        // Detect language from browser
        const browserLang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
        const detectedLanguage = ['en', 'it'].includes(browserLang) ? browserLang : 'en';
        // Use preferred language if provided and valid
        const finalLanguage = preferredLanguage && ['en', 'it'].includes(preferredLanguage)
            ? preferredLanguage
            : detectedLanguage;
        // Store language preference
        const languagePreference = {
            userAgent: (Array.isArray(userAgent) ? userAgent[0] : userAgent) || 'unknown',
            detectedLanguage,
            selectedLanguage: finalLanguage,
            timestamp: new Date()
        };
        await firebase_1.db.collection('languagePreferences').add(languagePreference);
        const response = {
            success: true,
            data: { language: finalLanguage }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error detecting language:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.detectLanguage = detectLanguage;
const getTranslations = async (req, res) => {
    try {
        const { lang } = req.params;
        if (!['en', 'it'].includes(lang)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid language. Supported languages: en, it'
            });
        }
        // Import translations based on language
        const translations = await Promise.resolve(`${`../locales/${lang}.json`}`).then(s => __importStar(require(s)));
        const response = {
            success: true,
            data: translations.default || translations
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching translations:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getTranslations = getTranslations;
const getLanguageStats = async (req, res) => {
    try {
        const snapshot = await firebase_1.db.collection('languagePreferences').get();
        const stats = {
            total: snapshot.size,
            english: 0,
            italian: 0,
            detected: { en: 0, it: 0 },
            selected: { en: 0, it: 0 }
        };
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.detectedLanguage === 'en')
                stats.detected.en++;
            if (data.detectedLanguage === 'it')
                stats.detected.it++;
            if (data.selectedLanguage === 'en')
                stats.selected.en++;
            if (data.selectedLanguage === 'it')
                stats.selected.it++;
        });
        stats.english = stats.selected.en;
        stats.italian = stats.selected.it;
        const response = {
            success: true,
            data: stats
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching language stats:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getLanguageStats = getLanguageStats;
//# sourceMappingURL=languageController.js.map