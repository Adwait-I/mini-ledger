import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { SummaryService } from '../services/summary.service';

export class SummaryController {
  /**
   * GET /api/summary
   * Returns total_lent, total_repaid, overdue_amount for authenticated user
   */
  static async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const summary = await SummaryService.getSummary(userId);
      return res.status(200).json(summary);
    } catch (error) {
      return next(error);
    }
  }
}
