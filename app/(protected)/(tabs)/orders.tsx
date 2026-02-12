
import {
  OrdersSelectionProvider,
  RiderSelectionModal,
  useOrders,
  useOrdersSelection,
  useRiderAssignment,
} from '@/features/orders/';
import { OrderCard } from '@/features/orders/components/OrderCard';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function OrdersScreenContent() {
  const { data, isLoading, refetch, isFetching, error } = useOrders();
  const { selectedIds, isSelectionMode, setSelectionMode, clearSelection } =
    useOrdersSelection();
  const { assignRiders, isAssigning: isBulkAssigning } = useRiderAssignment();
  const insets = useSafeAreaInsets();
  const [riderModalVisible, setRiderModalVisible] = useState(false);

  const handleBulkAssign = async (riderId: string) => {
    try {
      await assignRiders({ orderIds: selectedIds, riderId });
      setRiderModalVisible(false);
      clearSelection();
      Alert.alert('Success', `Assigned rider to ${selectedIds.length} orders`);
    } catch (error) {
      Alert.alert('Error', 'Failed to assign rider to orders');
    }
  };



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
      <View style={styles.header}>
        <View>
          <Text style={styles.totalOrders}>Total Orders: {data?.total ?? 0}</Text>
          {isSelectionMode && (
            <Text style={styles.selectedCount}>
              {selectedIds.length} orders selected
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            if (isSelectionMode) {
              clearSelection();
            } else {
              setSelectionMode(true);
            }
          }}
          style={[
            styles.selectionToggle,
            isSelectionMode && styles.selectionToggleActive,
          ]}
        >
          <Text
            style={[
              styles.selectionToggleText,
              isSelectionMode && styles.selectionToggleTextActive,
            ]}
          >
            {isSelectionMode ? 'Cancel Selection' : 'Select Multiple'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data?.orders ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} />
        )}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 20 + insets.bottom,
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

      {isSelectionMode && selectedIds.length > 0 && (
        <View style={[styles.bulkActions, { bottom: 20 + insets.bottom }]}>
          <TouchableOpacity
            style={styles.bulkAssignButton}
            onPress={() => setRiderModalVisible(true)}
            disabled={isBulkAssigning}
          >
            <Text style={styles.bulkAssignButtonText}>
              {isBulkAssigning
                ? 'Assigning...'
                : `Assign Rider to ${selectedIds.length} Orders`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <RiderSelectionModal
        visible={riderModalVisible}
        onClose={() => setRiderModalVisible(false)}
        onSelect={handleBulkAssign}
      />
    </View>
  );
}

export default function OrdersScreen() {
  return (
    <OrdersSelectionProvider>
      <OrdersScreenContent />
    </OrdersSelectionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F7F7',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  totalOrders: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  selectedCount: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  selectionToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  selectionToggleActive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#64748B',
  },
  selectionToggleText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  selectionToggleTextActive: {
    color: '#0F172A',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulkActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bulkAssignButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  bulkAssignButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
