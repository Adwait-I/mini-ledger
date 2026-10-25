import { useQuery } from '@tanstack/react-query';
import { loansApi } from '../api/loans.api';
import { SummaryMetrics } from '../types';

export const useSummary = () => {
  const summaryQuery = useQuery<SummaryMetrics>({
    queryKey: ['summary'],
    queryFn: loansApi.getSummary,
  });

  return {
    summary: summaryQuery.data || {
      total_lent: 0,
      total_repaid: 0,
      overdue_amount: 0,
    },
    isLoading: summaryQuery.isLoading,
    isRefetching: summaryQuery.isRefetching,
    error: summaryQuery.error,
    refetch: summaryQuery.refetch,
  };
};
