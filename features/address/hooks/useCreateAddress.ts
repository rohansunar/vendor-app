import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { addressService } from '../services/address.service';

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressService.createAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['address'],
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Address creation failed',
        text2: error.message || 'Please try again later',
      });
    },
  });
}
