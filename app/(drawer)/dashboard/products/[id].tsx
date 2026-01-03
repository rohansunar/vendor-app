import { ProductForm } from '@/features/product/components/ProductForm';
import { useDeleteProduct } from '@/features/product/hooks/useDeleteProduct';
import { useProduct } from '@/features/product/hooks/useProduct';
import { useUpdateProduct } from '@/features/product/hooks/useUpdateProduct';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Button, Text, View } from 'react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading } = useProduct(id);
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  if (isLoading || !data) return <Text>Loading...</Text>;

  function handleDelete() {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProduct(id, {
              onSuccess: () => {
                router.replace('/dashboard/products');
              },
            });
          },
        },
      ],
    );
  }

  return (
    <View>
      <ProductForm
        product={data}
        isPending={isPending}
        onSubmit={(formData) => updateProduct({ id, data: formData })}
      />

      <Button
        title={isDeleting ? 'Deleting...' : 'Delete Product'}
        color="red"
        onPress={handleDelete}
        disabled={isDeleting}
      />
    </View>
  );
}
