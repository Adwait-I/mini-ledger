export interface LoanCalculationItem {
  id?: string;
  amount: number;
  status: 'PENDING' | 'REPAID';
  dueDate: Date | string;
}

export interface SummaryResult {
  total_lent: number;
  total_repaid: number;
  overdue_amount: number;
}

/**
 * Checks whether a given loan is overdue.
 * A loan is overdue only if:
 * 1. Its status is PENDING
 * 2. Its due_date is strictly before the current reference date (past due)
 */
export function isLoanOverdue(
  dueDate: Date | string,
  status: 'PENDING' | 'REPAID',
  referenceDate: Date = new Date()
): boolean {
  if (status !== 'PENDING') {
    return false;
  }
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return due.getTime() < referenceDate.getTime();
}

/**
 * Calculates total_lent, total_repaid, and overdue_amount for a collection of loans.
 * 
 * - total_lent: Total principal amount lent across all records.
 * - total_repaid: Total principal amount of loans that have been marked REPAID.
 * - overdue_amount: Total amount of PENDING loans whose due_date is in the past.
 */
export function calculateSummary(
  loans: LoanCalculationItem[],
  referenceDate: Date = new Date()
): SummaryResult {
  let totalLent = 0;
  let totalRepaid = 0;
  let overdueAmount = 0;

  for (const loan of loans) {
    const amount = Number(loan.amount) || 0;
    totalLent += amount;

    if (loan.status === 'REPAID') {
      totalRepaid += amount;
    } else if (loan.status === 'PENDING') {
      if (isLoanOverdue(loan.dueDate, loan.status, referenceDate)) {
        overdueAmount += amount;
      }
    }
  }

  return {
    total_lent: Number(totalLent.toFixed(2)),
    total_repaid: Number(totalRepaid.toFixed(2)),
    overdue_amount: Number(overdueAmount.toFixed(2)),
  };
}
