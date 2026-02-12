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

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tabButton, active && styles.tabButtonActive]}
    >
      <Text
        style={[styles.tabButtonText, active && styles.tabButtonTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function OrdersScreenContent() {
  const { data, isLoading, refetch, isFetching, error } = useOrders();
  const { selectedIds, isSelectionMode, setSelectionMode, clearSelection } =
    useOrdersSelection();
  const { assignRiders, isAssigning: isBulkAssigning } = useRiderAssignment();
  const insets = useSafeAreaInsets();
  const [riderModalVisible, setRiderModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');

  // Client-side filtering as the endpoint doesn't support filtering yet
  const filteredOrders = React.useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.filter((order) => {
      const status = order.delivery_status;
      if (activeTab === 'ACTIVE') {
        return (
          status === 'PENDING' ||
          status === 'OUT_FOR_DELIVERY' ||
          status === 'CONFIRMED'
        );
      } else {
        return status === 'DELIVERED' || status === 'CANCELLED';
      }
    });
  }, [data, activeTab]);

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

  const handleTabChange = (tab: 'ACTIVE' | 'HISTORY') => {
    setActiveTab(tab);
    if (isSelectionMode) {
      clearSelection();
      setSelectionMode(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TabButton
          label="Active"
          active={activeTab === 'ACTIVE'}
          onPress={() => handleTabChange('ACTIVE')}
        />
        <TabButton
          label="History"
          active={activeTab === 'HISTORY'}
          onPress={() => handleTabChange('HISTORY')}
        />
      </View>

      <View style={styles.header}>
        <View>
          <Text style={styles.totalOrders}>
            Showing: {filteredOrders.length} orders
          </Text>
          {isSelectionMode && (
            <Text style={styles.selectedCount}>
              {selectedIds.length} orders selected
            </Text>
          )}
        </View>

        {activeTab === 'ACTIVE' && (
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
              {isSelectionMode ? 'Cancel' : 'Select Multiple'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 20 + insets.bottom + (isSelectionMode ? 80 : 0),
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {activeTab.toLowerCase()} orders found
            </Text>
          </View>
        )}
      />

      {isSelectionMode && activeTab === 'ACTIVE' && selectedIds.length > 0 && (
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
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
