import { Router } from 'express';
import { 
  detectLanguage, 
  getTranslations, 
  getLanguageStats 
} from '../controllers/languageController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/detect', detectLanguage);
router.get('/translations/:lang', getTranslations);

// Admin routes
router.get('/admin/stats', 
  authenticateToken, 
  requireAdmin, 
  getLanguageStats
);

export default router;
