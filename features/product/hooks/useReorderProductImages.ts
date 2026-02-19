import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { productImageService } from '../services/productImage.service';

export function useReorderProductImages(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (images: string[]) =>
      productImageService.reorderImages(productId, images),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product', productId],
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Failed to reorder images',
        text2: error.message || 'Please try again later',
      });
    },
  });
}
