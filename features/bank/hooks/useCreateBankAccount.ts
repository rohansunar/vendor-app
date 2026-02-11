import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { bankService } from '../services/bank.service';

export function useCreateBankAccount() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: bankService.createBankAccount,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bank-accounts'] });

      Toast.show({
        type: 'success',
        text1: 'Bank Details Saved',
      });
    },

    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Failed to Save',
        text2: error?.message || 'Try again',
      });
    },
  });
}
