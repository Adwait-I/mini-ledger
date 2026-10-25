import { Router } from 'express';
import authRoutes from './auth.routes';
import loanRoutes from './loan.routes';
import summaryRoutes from './summary.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MiniLedger API', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/loans', loanRoutes);
router.use('/summary', summaryRoutes);

export default router;
