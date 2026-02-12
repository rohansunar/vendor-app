import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

/**
 * Hook for managing rider assignment operations and fetching riders.
 * 
 * Provides:
 * - riders: List of available riders
 * - isLoadingRiders: Loading state for riders list
 * - assignRider: Function for single order assignment
 * - bulkAssignRider: Function for multiple order assignment
 * - isAssigning: State for single assignment mutation
 * - isBulkAssigning: State for bulk assignment mutation
 */
export function useRiderAssignment() {
    const queryClient = useQueryClient();

    // Fetch riders from the real API
    const {
        data: riders = [],
        isLoading: isLoadingRiders,
        error: ridersError
    } = useQuery({
        queryKey: ['riders'],
        queryFn: () => orderService.getRiders(),
    });

    // Mutation for rider assignment
    const mutation = useMutation({
        mutationFn: ({ orderIds, riderId }: { orderIds: string[]; riderId: string }) =>
            orderService.assignRiders(orderIds, riderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    return {
        riders,
        isLoadingRiders,
        ridersError,
        assignRiders: mutation.mutateAsync,
        isAssigning: mutation.isPending,
        mutationError: mutation.error,
    };
}
