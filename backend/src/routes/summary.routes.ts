import { Router } from 'express';
import { SummaryController } from '../controllers/summary.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Summary endpoint requires authentication
router.use(authenticate);

router.get('/', SummaryController.getSummary);

export default router;
