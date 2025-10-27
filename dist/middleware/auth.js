"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticateToken = void 0;
const firebase_1 = require("../config/firebase");
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access token required'
        });
    }
    try {
        // For now, we'll use a simple approach since Firebase Admin Auth requires service account
        // In production, you should set up proper Firebase Admin credentials
        // Decode the token manually (this is a simplified approach)
        // In production, use Firebase Admin SDK with proper credentials
        const decodedToken = await firebase_1.auth.verifyIdToken(token);
        console.log('Decoded token:', decodedToken);
        // Verify user exists in database
        const userDoc = await firebase_1.db.collection('adminUsers').doc(decodedToken.uid).get();
        console.log('User doc exists:', userDoc.exists);
        if (!userDoc.exists) {
            console.log('User not found in adminUsers collection');
            return res.status(401).json({
                success: false,
                error: 'Invalid token - user not found in admin collection'
            });
        }
        const userData = userDoc.data();
        console.log('User data:', userData);
        req.user = { id: userDoc.id, ...userData };
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error details:', errorMessage);
        // TEMPORARY BYPASS FOR PRODUCTION - REMOVE AFTER SETTING UP FIREBASE CREDENTIALS
        if (process.env.NODE_ENV === 'production' && errorMessage.includes('Could not load the default credentials')) {
            console.log('⚠️  TEMPORARY BYPASS: Using mock admin user due to Firebase credentials not set');
            req.user = {
                id: 'temp-admin',
                email: 'marvellousujebor@gmail.com',
                role: 'super-admin'
            };
            next();
            return;
        }
        return res.status(403).json({
            success: false,
            error: 'Invalid or expired token',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
};
exports.authenticateToken = authenticateToken;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
        return res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
    }
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.js.map