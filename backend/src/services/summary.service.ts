import { prisma } from '../utils/prisma';
import { calculateSummary, SummaryResult } from '../utils/calculations';

export class SummaryService {
  /**
   * Fetches all user loans and computes total_lent, total_repaid, and overdue_amount.
   */
  static async getSummary(userId: string): Promise<SummaryResult> {
    const loans = await prisma.loanEntry.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        status: true,
        dueDate: true,
      },
    });

    return calculateSummary(loans, new Date());
  }
}
