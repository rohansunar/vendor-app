import { useOrders } from '@/features/orders/';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { FlatList, RefreshControl, StyleSheet, Text, View, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrdersScreen() {
  const { data, isLoading, refetch, isFetching, error } = useOrders();
  const insets = useSafeAreaInsets();
 if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
      <Text
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          fontSize: 14,
          color: '#64748B',
        }}
      >
        Total Orders: {data?.total ?? 0}
      </Text>

      <FlatList
        data={data?.orders ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} />
        )}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>
            No orders found
          </Text>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
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