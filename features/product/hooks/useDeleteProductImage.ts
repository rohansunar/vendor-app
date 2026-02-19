import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { productImageService } from '../services/productImage.service';

export function useDeleteProductImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      productImageService.deleteImage(productId, imageId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product', productId],
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete image',
        text2: error.message || 'Please try again later',
      });
    },
  });
}
