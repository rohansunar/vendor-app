import { useAuth } from '@/core/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { bankService } from '../services/bankService';

export function useBankAccount() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['bank-account'],
    queryFn: bankService.getBankAccount,
    enabled: isAuthenticated,
  });
}
