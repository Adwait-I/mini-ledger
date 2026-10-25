import { prisma } from '../utils/prisma';
import { LoanStatus } from '@prisma/client';
import { isLoanOverdue } from '../utils/calculations';

export interface CreateLoanDTO {
  userId: string;
  friendName: string;
  amount: number;
  dueDate: string;
  receiptUrl?: string | null;
}

export class LoanService {
  /**
   * Fetch all loans belonging to the authenticated user.
   * Annotates each loan with a computed `isOverdue` flag for frontend convenience.
   */
  static async getLoansByUser(userId: string) {
    const loans = await prisma.loanEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    return loans.map((loan) => ({
      ...loan,
      isOverdue: isLoanOverdue(loan.dueDate, loan.status, now),
    }));
  }

  /**
   * Create a new loan entry.
   */
  static async createLoan(data: CreateLoanDTO) {
    const loan = await prisma.loanEntry.create({
      data: {
        userId: data.userId,
        friendName: data.friendName.trim(),
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        status: LoanStatus.PENDING,
        receiptUrl: data.receiptUrl || null,
      },
    });

    return {
      ...loan,
      isOverdue: isLoanOverdue(loan.dueDate, loan.status, new Date()),
    };
  }

  /**
   * Mark an existing loan as REPAID. Ensures the user owns the loan.
   */
  static async markAsRepaid(loanId: string, userId: string) {
    const existingLoan = await prisma.loanEntry.findFirst({
      where: { id: loanId, userId },
    });

    if (!existingLoan) {
      throw new Error('Loan entry not found or you do not have permission to modify it');
    }

    const updated = await prisma.loanEntry.update({
      where: { id: loanId },
      data: { status: LoanStatus.REPAID },
    });

    return {
      ...updated,
      isOverdue: false,
    };
  }
}
