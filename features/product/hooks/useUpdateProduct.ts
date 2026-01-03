// Update Product
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({
        queryKey: ['product', variables.id],
      });
    },
  });
}
