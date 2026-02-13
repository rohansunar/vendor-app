import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../';

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressService.createAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['address'],
      });
    },
    onError: (error) => {
      console.log('❌ Address creation failed');
    },
  });
}
