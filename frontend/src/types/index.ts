export interface User {
  id: string;
  phoneNumber: string;
  createdAt: string;
}

export type LoanStatus = 'PENDING' | 'REPAID';

export interface LoanEntry {
  id: string;
  userId: string;
  friendName: string;
  amount: number;
  dueDate: string;
  status: LoanStatus;
  receiptUrl?: string | null;
  createdAt: string;
  isOverdue?: boolean;
}

export interface SummaryMetrics {
  total_lent: number;
  total_repaid: number;
  overdue_amount: number;
}

export interface CreateLoanPayload {
  friendName: string;
  amount: number;
  dueDate: string;
  receiptUrl?: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RequestOtpResponse {
  message: string;
  debugOtp?: string;
}
