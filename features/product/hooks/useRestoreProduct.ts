import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { productService } from '../services/product.service';

export function useRestoreProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.restoreProduct,

    onSuccess: () => {
      // 🔥 Refresh product list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Failed to restore product',
        text2: error.message || 'Please try again later',
      });
    },
  });
}
