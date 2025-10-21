import { Router } from 'express';
import { 
  submitSuggestion, 
  getAllSuggestions, 
  deleteSuggestion, 
  updateSuggestionStatus 
} from '../controllers/suggestionController';
import { validateRequest, validateLanguageMiddleware } from '../middleware/validation';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { suggestionSchema } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/', 
  validateRequest(suggestionSchema),
  validateLanguageMiddleware('suggestion'),
  submitSuggestion
);

// Admin routes
router.get('/admin', 
  authenticateToken, 
  requireAdmin, 
  getAllSuggestions
);

router.delete('/admin/:id', 
  authenticateToken, 
  requireAdmin, 
  deleteSuggestion
);

router.patch('/admin/:id/status', 
  authenticateToken, 
  requireAdmin, 
  updateSuggestionStatus
);

export default router;
