import { Router } from 'express';
import { 
  submitWaitlistEntry, 
  getAllWaitlistEntries, 
  deleteWaitlistEntry, 
  getWaitlistStats 
} from '../controllers/waitlistController';
import { validateRequest, validateLanguageMiddleware } from '../middleware/validation';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { waitlistSchema } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/', 
  validateRequest(waitlistSchema),
  validateLanguageMiddleware('name'),
  submitWaitlistEntry
);

// Admin routes
router.get('/admin', 
  authenticateToken, 
  requireAdmin, 
  getAllWaitlistEntries
);

router.delete('/admin/:id', 
  authenticateToken, 
  requireAdmin, 
  deleteWaitlistEntry
);

router.get('/admin/stats', 
  authenticateToken, 
  requireAdmin, 
  getWaitlistStats
);

export default router;
