import { useQuery } from '@tanstack/react-query';
import { bankService } from '../services/bank.service';

export function useBankAccounts() {
  return useQuery({
    queryKey: ['bank-accounts'],
    queryFn: bankService.getBankAccounts,
  });
}
