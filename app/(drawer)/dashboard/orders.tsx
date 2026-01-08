import OrderCard from '@/features/orders/components/OrderCard';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

/**
 * OrdersTab component displays a list of orders with pull-to-refresh functionality.
 * Allows navigation to individual order details.
 */
export default function OrdersTab() {
  const { data, isLoading, refetch, isFetching, error } = useOrders();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading orders</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => router.push(`/dashboard/orders/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F7F7F7',
    flex: 1,
  },
  list: {
    paddingTop: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
