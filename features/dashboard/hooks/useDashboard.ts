import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../services/dashboard.service';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,

    staleTime: 60 * 1000, // 1 min
    retry: 1, // only retry once
    refetchOnWindowFocus: false,
  });
}
