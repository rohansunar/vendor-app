import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bankService } from '../services/bankService';

export function useUpdateBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankService.updateBankAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bank-account'],
      });
    },
  });
}
