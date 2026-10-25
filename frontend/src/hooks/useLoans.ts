import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loansApi } from '../api/loans.api';
import { CreateLoanPayload } from '../types';

export const useLoans = () => {
  const queryClient = useQueryClient();

  const loansQuery = useQuery({
    queryKey: ['loans'],
    queryFn: loansApi.getLoans,
  });

  const createLoanMutation = useMutation({
    mutationFn: (payload: CreateLoanPayload) => loansApi.createLoan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });

  const repayLoanMutation = useMutation({
    mutationFn: (loanId: string) => loansApi.repayLoan(loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });

  return {
    loans: loansQuery.data || [],
    isLoading: loansQuery.isLoading,
    isRefetching: loansQuery.isRefetching,
    error: loansQuery.error,
    refetch: loansQuery.refetch,
    createLoan: createLoanMutation.mutateAsync,
    isCreating: createLoanMutation.isPending,
    repayLoan: repayLoanMutation.mutateAsync,
    isRepaying: repayLoanMutation.isPending,
  };
};
