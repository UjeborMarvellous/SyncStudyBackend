"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.getAdminProfile = exports.adminSignup = exports.adminLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const firebase_1 = require("../config/firebase");
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // This endpoint is now deprecated since we use Firebase Auth directly
        // Keep for backward compatibility but redirect to Firebase Auth
        return res.status(400).json({
            success: false,
            error: 'Please use Firebase Authentication directly from the frontend'
        });
    }
    catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'production' ? 'internal server error' : error.message,
            code: error.code,
            details: process.env.NODE_ENV === "development" ? error.stack : undefined
        });
    }
};
exports.adminLogin = adminLogin;
const adminSignup = async (req, res) => {
    try {
        const { email, password, role = 'admin' } = req.body;
        // Check if admin already exists
        const existingAdmin = await firebase_1.db.collection('adminUsers')
            .where('email', '==', email)
            .get();
        if (!existingAdmin.empty) {
            return res.status(400).json({
                success: false,
                error: 'Admin user already exists'
            });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Create admin user
        const newAdmin = {
            email,
            password: hashedPassword,
            role: role,
            createdAt: new Date()
        };
        const docRef = await firebase_1.db.collection('adminUsers').add(newAdmin);
        const response = {
            success: true,
            data: { id: docRef.id },
            message: 'Admin user created successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.adminSignup = adminSignup;
const getAdminProfile = async (req, res) => {
    try {
        const user = req.user;
        const response = {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getAdminProfile = getAdminProfile;
const getDashboardStats = async (req, res) => {
    try {
        // Get waitlist stats
        const waitlistSnapshot = await firebase_1.db.collection('waitlist').get();
        const waitlistCount = waitlistSnapshot.size;
        // Get suggestions stats
        const suggestionsSnapshot = await firebase_1.db.collection('suggestions').get();
        const suggestionsCount = suggestionsSnapshot.size;
        // Get language preferences stats
        const languageSnapshot = await firebase_1.db.collection('languagePreferences').get();
        const languageCount = languageSnapshot.size;
        // Count by language
        const languageStats = { en: 0, it: 0 };
        waitlistSnapshot.forEach(doc => {
            const data = doc.data();
            const lang = data.language;
            if (lang === 'en' || lang === 'it') {
                languageStats[lang]++;
            }
        });
        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentWaitlist = waitlistSnapshot.docs.filter(doc => {
            const data = doc.data();
            return data.timestamp && data.timestamp.toDate() > sevenDaysAgo;
        }).length;
        const recentSuggestions = suggestionsSnapshot.docs.filter(doc => {
            const data = doc.data();
            return data.timestamp && data.timestamp.toDate() > sevenDaysAgo;
        }).length;
        const response = {
            success: true,
            data: {
                waitlist: {
                    total: waitlistCount,
                    recent: recentWaitlist,
                    byLanguage: languageStats
                },
                suggestions: {
                    total: suggestionsCount,
                    recent: recentSuggestions
                },
                language: {
                    total: languageCount
                }
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=adminController.js.map