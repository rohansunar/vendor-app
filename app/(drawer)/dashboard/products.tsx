import { useProducts } from '@/features/product/hooks/useProducts';
import { router } from 'expo-router';
import { Button, FlatList, Text, View } from 'react-native';

export default function ProductsTab() {
  const { data, isLoading } = useProducts();

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View>
      <Button
        title="Add Product"
        onPress={() => router.push('/dashboard/products/create')}
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text onPress={() => router.push(`/dashboard/products/${item.id}`)}>
            {item.name}
          </Text>
        )}
      />
    </View>
  );
}
