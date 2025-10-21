import { Router } from 'express';
import { 
  adminLogin, 
  adminSignup, 
  getAdminProfile, 
  getDashboardStats 
} from '../controllers/adminController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { adminLoginSchema } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/login', validateRequest(adminLoginSchema), adminLogin);
router.post('/signup', adminSignup);

// Protected routes
router.get('/profile', authenticateToken, getAdminProfile);
router.get('/dashboard', authenticateToken, getDashboardStats);

export default router;
