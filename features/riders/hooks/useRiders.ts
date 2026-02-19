import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { RiderFormValues } from '../rider.schema';
import { riderService } from '../rider.service';

export function useRiders() {
    const queryClient = useQueryClient();

    const {
        data: riders = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['riders'],
        queryFn: () => riderService.getRiders(),
    });

    const addRiderMutation = useMutation({
        mutationFn: (data: RiderFormValues) => riderService.addRider(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['riders'] });
            Toast.show({
                type: 'success',
                text1: 'Rider added successfully',
            });
        },
        onError: (error: Error) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to add rider',
                text2: error.message,
            });
        },
    });

    return {
        riders,
        isLoading,
        isError,
        error,
        refetch,
        addRider: addRiderMutation.mutateAsync,
        isAdding: addRiderMutation.isPending,
    };
}
