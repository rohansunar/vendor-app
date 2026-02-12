// Update Product
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      // queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
