import { ProductForm } from '@/features/product/components/ProductForm';
import { useCreateProduct } from '@/features/product/hooks/useCreateProduct';
import { router } from 'expo-router';

export default function CreateProductScreen() {
  const { mutate, isPending } = useCreateProduct();

  return (
    <ProductForm
      isPending={isPending}
      onSubmit={(data) => {
        mutate(data, {
          onSuccess: () => router.back(),
        });
      }}
    />
  );
}
