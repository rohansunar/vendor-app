import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { productService } from '../services/product.service';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deleteProduct,

    onSuccess: () => {
      // Refresh product list after delete
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete product',
        text2: error.message || 'Please try again later',
      });
    },
  });
}
