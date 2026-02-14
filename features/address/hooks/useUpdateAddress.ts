import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/address.service';

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof addressService.updateAddress>[0]) =>
      addressService.updateAddress(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['address'],
      });
    },
  });
}
