import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody, validateParams } from '../middlewares/validate.middleware';
import { createLoanSchema, repayLoanParamSchema } from '../validators/loan.validator';

const router = Router();

// All loan endpoints require authentication
router.use(authenticate);

router.get('/', LoanController.getLoans);
router.post('/', validateBody(createLoanSchema), LoanController.createLoan);
router.put('/:id/repay', validateParams(repayLoanParamSchema), LoanController.markRepaid);

export default router;
