import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export function useConfirmDelivery() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { otp?: string; image?: string };
    }) => orderService.confirmDelivery(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    confirmDelivery: mutation.mutateAsync,
    isConfirming: mutation.isPending,
  };
}
