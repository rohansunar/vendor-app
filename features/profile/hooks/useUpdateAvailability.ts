import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { updateAvailability } from '../services/profile.service';

export function useUpdateAvailability() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateAvailability,
    onSuccess: () => {
      // Refetch profile properly
      qc.invalidateQueries({ queryKey: ['profile'] });

      Toast.show({
        type: 'success',
        text1: 'Availability Updated',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: (error as Error)?.message || 'Could not update availability.',
      });
    },
  });
}
