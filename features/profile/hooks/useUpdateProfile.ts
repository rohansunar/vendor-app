import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { updateProfile } from '../services/profile.service';

export function useUpdateProfile() {
   const qc = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your changes have been saved.',
        position: 'top',
        visibilityTime: 3000,
      });
    },

    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2:
          error?.message ||
          'Something went wrong. Please try again.',
        position: 'top',
        visibilityTime: 3000,
      });
    },
  });
}
