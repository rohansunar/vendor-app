import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useConfirmDelivery } from '../hooks/useConfirmDelivery';
import { useMarkOutForDelivery } from '../hooks/useMarkOutForDelivery';
import { useRejectOrder } from '../hooks/useRejectOrder';
import { useRiderAssignment } from '../hooks/useRiderAssignment';
import { useOrdersSelection } from '../orders.context';
import { Order } from '../orders.types';
import {
  getDeliveryColor,
  getPaymentColor,
} from '../orders.utils';
import { DeliveryConfirmationModal } from './DeliveryConfirmationModal';
import { OrderItemsSection } from './OrderItemsSection';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentModeBadge } from './PaymentModeBadge';
import { RejectionReasonModal } from './RejectionReasonModal';
import { RiderSelectionModal } from './RiderSelectionModal';

export function OrderCard({
  order,
}: {
  order: Order;
}) {
  const { selectedIds, toggleSelect, isSelectionMode } = useOrdersSelection();
  const { rejectOrder, isRejecting } = useRejectOrder();
  const { assignRiders, isAssigning } = useRiderAssignment();
  const { markOutForDelivery, isMarkingOut } = useMarkOutForDelivery();
  const { confirmDelivery, isConfirming } = useConfirmDelivery();

  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [riderModalVisible, setRiderModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);

  const paymentColor = getPaymentColor(order.payment_status);
  const deliveryColor = getDeliveryColor(order.delivery_status);
  const isSelected = selectedIds.includes(order.id);
  const isCOD = order.payment_mode === 'COD';



  const handleReject = async (reason: string) => {
    try {
      await rejectOrder({ id: order.id, reason });
      setRejectionModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to reject order');
    }
  };

  const handleAssignRider = async (riderId: string) => {
    try {
      await assignRiders({ orderIds: [order.id], riderId });
      setRiderModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to assign rider');
    }
  };

  const handleSelfDelivery = async () => {
    try {
      await markOutForDelivery(order.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to mark as out for delivery');
    }
  };

  const handleConfirmDelivery = async (data: {
    otp?: string;
    image?: string;
  }) => {
    try {
      await confirmDelivery({ id: order.id, data });
      setDeliveryModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm delivery');
    }
  };

  const isLoading = isRejecting || isAssigning || isMarkingOut || isConfirming;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => isSelectionMode && toggleSelect(order.id)}
      style={[
        styles.cardContainer,
        isSelected && styles.selectedCard,
        isCOD && styles.codCard,
      ]}
    >
      <LinearGradient
        colors={isSelected ? ['#EFF6FF', '#DBEAFE'] : ['#FFFFFF', '#F8FAFF']}
        style={styles.card}
      >
        {/* Selection Indicator */}
        {isSelectionMode && (
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <View style={styles.checkboxInner} />}
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.orderNo}>#{order.orderNo}</Text>
          </View>
          <View style={styles.headerRight}>
            {isCOD && (
              <View style={styles.codBadge}>
                <Text style={styles.codText}>CASH ON DELIVERY</Text>
              </View>
            )}
            <Text style={styles.amount}>₹{order.total_amount}</Text>
          </View>
        </View>

        {/* Address */}
        <Text style={styles.address}>
          {order.address.address}, {order.address.pincode}, {' '}
          {order.address.location.name}, {order.address.location.state}
        </Text>

        {/* Status Section */}
        <View style={styles.statusRow}>
          <OrderStatusBadge
            label={`Payment: ${order.payment_status}`}
            color={paymentColor}
          />
          <OrderStatusBadge
            label={`Delivery: ${order.delivery_status}`}
            color={deliveryColor}
          />
        </View>

        {/* Payment Mode */}
        <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
          <PaymentModeBadge mode={order.payment_mode} />
          {order.rider && (
            <View style={styles.riderInfo}>
              <Text style={styles.riderLabel}>Rider: {order.rider.name}</Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        <OrderItemsSection items={order.orderItems ?? []} />

        <View style={styles.footer}>
          <Text style={styles.date}>
            {new Date(order.created_at).toLocaleDateString([], {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>

          {!isSelectionMode && (
            <View style={styles.actionRow}>
              {order.delivery_status === 'PENDING' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => setRejectionModalVisible(true)}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.assignButton]}
                    onPress={() => setRiderModalVisible(true)}
                  >
                    <Text style={styles.assignButtonText}>Assign Rider</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.selfDeliveryButton]}
                    onPress={handleSelfDelivery}
                  >
                    <Text style={styles.selfDeliveryText}>Self Delivery</Text>
                  </TouchableOpacity>
                </>
              )}

              {order.delivery_status === 'OUT_FOR_DELIVERY' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.confirmButton]}
                  onPress={() => setDeliveryModalVisible(true)}
                >
                  <Text style={styles.confirmButtonText}>Confirm Delivery</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#2563EB" />
          </View>
        )}
      </LinearGradient>

      <RejectionReasonModal
        visible={rejectionModalVisible}
        onClose={() => setRejectionModalVisible(false)}
        onSelect={handleReject}
      />

      <RiderSelectionModal
        visible={riderModalVisible}
        onClose={() => setRiderModalVisible(false)}
        onSelect={handleAssignRider}
      />

      <DeliveryConfirmationModal
        visible={deliveryModalVisible}
        onClose={() => setDeliveryModalVisible(false)}
        onConfirm={handleConfirmDelivery}
        method={order.confirmation_method || 'OTP'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  selectedCard: {
    borderColor: '#2563EB',
    borderWidth: 2,
  },
  codCard: {
    borderColor: '#F59E0B',
    borderWidth: 1.5,
  },
  checkbox: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  orderNo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },

  amount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  codBadge: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  codText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  address: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  riderInfo: {
    marginLeft: 12,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  riderLabel: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  date: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  rejectButton: {
    backgroundColor: '#FEF2F2',
  },
  rejectButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  assignButton: {
    backgroundColor: '#EEF2FF',
  },
  assignButtonText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '700',
  },
  selfDeliveryButton: {
    backgroundColor: '#F0FDF4',
  },
  selfDeliveryText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    zIndex: 100,
  },
});
