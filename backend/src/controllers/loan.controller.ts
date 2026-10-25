import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { LoanService } from '../services/loan.service';

export class LoanController {
  /**
   * GET /api/loans
   * Fetch all loans for the currently authenticated user
   */
  static async getLoans(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const loans = await LoanService.getLoansByUser(userId);
      return res.status(200).json({ loans });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/loans
   * Create a new loan entry
   */
  static async createLoan(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { friendName, amount, dueDate, receiptUrl } = req.body;

      const loan = await LoanService.createLoan({
        userId,
        friendName,
        amount,
        dueDate,
        receiptUrl,
      });

      return res.status(201).json({
        message: 'Loan entry created successfully',
        loan,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PUT /api/loans/:id/repay
   * Mark a loan entry as REPAID
   */
  static async markRepaid(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const updated = await LoanService.markAsRepaid(id, userId);

      return res.status(200).json({
        message: 'Loan marked as repaid successfully',
        loan: updated,
      });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Loan entry not found' });
    }
  }
}
