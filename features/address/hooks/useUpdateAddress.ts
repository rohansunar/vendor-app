import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../';

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof addressService.updateAddress>[1];
    }) => addressService.updateAddress(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['address'],
      });
    },
  });
}
