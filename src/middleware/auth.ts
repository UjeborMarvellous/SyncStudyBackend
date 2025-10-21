import { Request, Response, NextFunction } from 'express';
import { db, auth } from '../config/firebase';
import { AdminUser } from '../types';

interface AuthRequest extends Request {
  user?: AdminUser;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    const decodedToken = await auth.verifyIdToken(token);
    // const userDoc = await db.collection('adminUsers').doc(uid).get();
    
    // Verify user exists in database
    const userDoc = await db.collection('adminUsers').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
    }

    req.user = { id: userDoc.id, ...userDoc.data() } as AdminUser;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
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
