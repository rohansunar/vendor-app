import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export function useMarkOutForDelivery() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: string) => orderService.markOutForDelivery(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    return {
        markOutForDelivery: mutation.mutateAsync,
        isMarkingOut: mutation.isPending,
    };
}
