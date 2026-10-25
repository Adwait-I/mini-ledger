import {
  isLoanOverdue,
  calculateSummary,
  LoanCalculationItem,
} from '../src/utils/calculations';

describe('Loan Calculation Logic', () => {
  const referenceDate = new Date('2026-10-22T12:00:00.000Z');

  describe('isLoanOverdue', () => {
    it('should return true for a PENDING loan with due date in the past', () => {
      const pastDueDate = new Date('2026-10-20T00:00:00.000Z');
      expect(isLoanOverdue(pastDueDate, 'PENDING', referenceDate)).toBe(true);
    });

    it('should return false for a PENDING loan with due date in the future', () => {
      const futureDueDate = new Date('2026-10-25T00:00:00.000Z');
      expect(isLoanOverdue(futureDueDate, 'PENDING', referenceDate)).toBe(false);
    });

    it('should return false for a REPAID loan even if due date is in the past', () => {
      const pastDueDate = new Date('2026-10-15T00:00:00.000Z');
      expect(isLoanOverdue(pastDueDate, 'REPAID', referenceDate)).toBe(false);
    });

    it('should accept ISO date strings as due date', () => {
      expect(isLoanOverdue('2026-10-10T00:00:00.000Z', 'PENDING', referenceDate)).toBe(true);
      expect(isLoanOverdue('2026-10-30T00:00:00.000Z', 'PENDING', referenceDate)).toBe(false);
    });
  });

  describe('calculateSummary', () => {
    it('should return zeros for an empty loan list', () => {
      const result = calculateSummary([], referenceDate);
      expect(result).toEqual({
        total_lent: 0,
        total_repaid: 0,
        overdue_amount: 0,
      });
    });

    it('should calculate total_lent as the sum of all loans', () => {
      const loans: LoanCalculationItem[] = [
        { amount: 50.5, status: 'PENDING', dueDate: new Date('2026-11-01') },
        { amount: 100, status: 'REPAID', dueDate: new Date('2026-10-01') },
        { amount: 75.25, status: 'PENDING', dueDate: new Date('2026-10-10') },
      ];

      const result = calculateSummary(loans, referenceDate);
      expect(result.total_lent).toBe(225.75);
    });

    it('should calculate total_repaid by summing only REPAID loans', () => {
      const loans: LoanCalculationItem[] = [
        { amount: 150, status: 'REPAID', dueDate: new Date('2026-09-01') },
        { amount: 200, status: 'REPAID', dueDate: new Date('2026-10-15') },
        { amount: 300, status: 'PENDING', dueDate: new Date('2026-10-01') },
      ];

      const result = calculateSummary(loans, referenceDate);
      expect(result.total_repaid).toBe(350);
    });

    it('should calculate overdue_amount exclusively for PENDING loans with past due date', () => {
      const loans: LoanCalculationItem[] = [
        // Overdue pending loan: due Oct 10 (past)
        { amount: 80, status: 'PENDING', dueDate: new Date('2026-10-10') },
        // Upcoming pending loan: due Oct 28 (future)
        { amount: 120, status: 'PENDING', dueDate: new Date('2026-10-28') },
        // Repaid loan in past: due Oct 5 (past, but REPAID so not overdue)
        { amount: 200, status: 'REPAID', dueDate: new Date('2026-10-05') },
        // Another overdue pending loan: due Oct 18 (past)
        { amount: 45.5, status: 'PENDING', dueDate: new Date('2026-10-18') },
      ];

      const result = calculateSummary(loans, referenceDate);
      expect(result.total_lent).toBe(445.5);
      expect(result.total_repaid).toBe(200);
      expect(result.overdue_amount).toBe(125.5); // 80 + 45.5
    });

    it('should round calculations cleanly to 2 decimal places', () => {
      const loans: LoanCalculationItem[] = [
        { amount: 10.333, status: 'PENDING', dueDate: new Date('2026-10-10') },
        { amount: 20.666, status: 'PENDING', dueDate: new Date('2026-10-10') },
      ];

      const result = calculateSummary(loans, referenceDate);
      expect(result.total_lent).toBe(31);
      expect(result.overdue_amount).toBe(31);
    });
  });
});
