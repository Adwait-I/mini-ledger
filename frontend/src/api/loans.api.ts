import { apiClient } from './client';
import { LoanEntry, SummaryMetrics, CreateLoanPayload } from '../types';

export const loansApi = {
  /**
   * Fetch all loans for the logged-in user
   */
  getLoans: async (): Promise<LoanEntry[]> => {
    const response = await apiClient.get<{ loans: LoanEntry[] }>('/loans');
    return response.data.loans;
  },

  /**
   * Create a new loan entry
   */
  createLoan: async (payload: CreateLoanPayload): Promise<LoanEntry> => {
    const response = await apiClient.post<{ message: string; loan: LoanEntry }>('/loans', payload);
    return response.data.loan;
  },

  /**
   * Mark a loan as REPAID
   */
  repayLoan: async (loanId: string): Promise<LoanEntry> => {
    const response = await apiClient.put<{ message: string; loan: LoanEntry }>(
      `/loans/${loanId}/repay`
    );
    return response.data.loan;
  },

  /**
   * Fetch aggregate summary metrics (total_lent, total_repaid, overdue_amount)
   */
  getSummary: async (): Promise<SummaryMetrics> => {
    const response = await apiClient.get<SummaryMetrics>('/summary');
    return response.data;
  },
};
