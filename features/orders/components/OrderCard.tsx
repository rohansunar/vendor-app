import { Feather } from '@expo/vector-icons';
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
import { getDeliveryColor, getPaymentColor } from '../orders.utils';
import { CollapsibleReason } from './CollapsibleReason';
import { DeliveryConfirmationModal } from './DeliveryConfirmationModal';
import { OrderItemsSection } from './OrderItemsSection';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentModeBadge } from './PaymentModeBadge';
import { RejectionReasonModal } from './RejectionReasonModal';
import { RiderSelectionModal } from './RiderSelectionModal';

export function OrderCard({ order }: { order: Order }) {
  const { selectedIds, toggleSelect, isSelectionMode } = useOrdersSelection();
  const { rejectOrder, isRejecting } = useRejectOrder();
  const { assignRiders, isAssigning, revertAssignment, isReverting } =
    useRiderAssignment();
  const { markOutForDelivery, isMarkingOut } = useMarkOutForDelivery();
  const { confirmDelivery, isConfirming } = useConfirmDelivery();

  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [riderModalVisible, setRiderModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);

  const paymentColor = getPaymentColor(order.payment_status);
  const deliveryColor = getDeliveryColor(order.delivery_status);
  const isSelected = selectedIds.includes(order.id);
  const isCOD = order.payment_mode === 'COD';

  const handleRevertAssignment = async () => {
    Alert.alert(
      'Revert Assignment',
      'Are you sure you want to unassign this rider?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revert',
          style: 'destructive',
          onPress: async () => {
            try {
              await revertAssignment(order.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to revert rider assignment');
            }
          },
        },
      ],
    );
  };

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

  const isLoading =
    isRejecting || isAssigning || isMarkingOut || isConfirming || isReverting;
  const isHistorical =
    order.delivery_status === 'DELIVERED' ||
    order.delivery_status === 'CANCELLED';

  return (
    <TouchableOpacity
      onPress={
        isSelectionMode && !isHistorical
          ? () => toggleSelect(order.id)
          : undefined
      }
      activeOpacity={isSelectionMode && !isHistorical ? 0.7 : 1}
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
        {isSelectionMode && !isHistorical && (
          <View
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          >
            {isSelected && <Feather name="check" size={14} color="#FFF" />}
          </View>
        )}

        {/* Header */}
        <View
          style={[
            styles.header,
            isSelectionMode && !isHistorical && styles.headerWithSelection,
          ]}
        >
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
          {order.address.address}, {order.address.pincode},{' '}
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
        <View
          style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}
        >
          <PaymentModeBadge mode={order.payment_mode} />
          {order.rider && (
            <View style={styles.riderInfo}>
              <Text style={styles.riderLabel}>Rider: {order.rider.name}</Text>
              <TouchableOpacity
                style={styles.revertButton}
                onPress={() => handleRevertAssignment()}
                disabled={isReverting}
              >
                {isReverting ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <Text style={styles.revertButtonText}>✕</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Order Items */}
        <OrderItemsSection items={order.orderItems ?? []} />

        {/* Cancellation Details */}
        {order.delivery_status === 'CANCELLED' && order.cancelReason && (
          <CollapsibleReason
            title="Cancellation Reason"
            content={order.cancelReason}
            timestamp={order.cancelledAt}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.date}>
            {new Date(order.created_at).toLocaleString([], {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          {!isSelectionMode && (
            <View style={styles.actionRow}>
              {order.delivery_status === 'PENDING' && (
                <View style={styles.ctaGroup}>
                  <TouchableOpacity
                    style={[styles.ctaButton, styles.rejectCta]}
                    onPress={() => setRejectionModalVisible(true)}
                  >
                    <Feather name="x-circle" size={16} color="#EF4444" />
                    <Text style={styles.rejectCtaText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.ctaButton, styles.assignCta]}
                    onPress={() => setRiderModalVisible(true)}
                  >
                    <Feather name="user-plus" size={16} color="#FFFFFF" />
                    <Text style={styles.assignCtaText}>Assign Rider</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.ctaButton, styles.selfDeliveryCta]}
                    onPress={handleSelfDelivery}
                  >
                    <Feather name="truck" size={16} color="#16A34A" />
                    <Text style={styles.selfDeliveryCtaText}>
                      Self Delivery
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {order.delivery_status === 'OUT_FOR_DELIVERY' && (
                <TouchableOpacity
                  style={[styles.ctaButton, styles.confirmCta]}
                  onPress={() => setDeliveryModalVisible(true)}
                >
                  <Feather name="check-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.confirmCtaText}>Confirm Delivery</Text>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  headerWithSelection: {
    paddingLeft: 36, // Create space for checkbox to avoid overlap
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riderLabel: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  revertButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },
  revertButtonText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: 'bold',
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
    flex: 1,
    marginTop: 8,
  },
  ctaGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rejectCta: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  rejectCtaText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  assignCta: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
  },
  assignCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  selfDeliveryCta: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  selfDeliveryCtaText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '700',
  },
  confirmCta: {
    backgroundColor: '#059669',
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 14,
    shadowColor: '#059669',
    shadowOpacity: 0.3,
  },
  confirmCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
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
