import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bankService } from '../services/bank.service';

export function useUpdateBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        accountHolderName: string;
        accountNumber: string;
        ifscCode: string;
        bankName: string;
      };
    }) => bankService.updateBankAccount(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bank-accounts'],
      });
    },
  });
}
