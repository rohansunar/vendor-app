import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export function useRejectOrder() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      orderService.rejectOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    rejectOrder: mutation.mutateAsync,
    isRejecting: mutation.isPending,
  };
}
