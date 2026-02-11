import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { Order } from '../orders.types';
import {
  getDeliveryColor,
  getPaymentColor,
} from '../orders.utils';
import { OrderStatusBadge } from './OrderStatusBadge';

export function OrderCard({ order }: { order: Order }) {
  const paymentColor = getPaymentColor(order.payment_status);
  const deliveryColor = getDeliveryColor(order.delivery_status);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8FAFF']}
      style={styles.card}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.orderNo}>
          #{order.orderNo}
        </Text>

        <Text style={styles.amount}>
          ₹{order.total_amount}
        </Text>
      </View>

      {/* Address */}
      <View style={styles.row}>
        <Feather name="map-pin" size={16} color="#64748B" />
        <Text style={styles.address}>
          {order.address.address}
        </Text>
      </View>

      {/* Payment & Delivery */}
      <View style={styles.statusRow}>
        <OrderStatusBadge
          label={order.payment_status}
          color={paymentColor}
        />

        <OrderStatusBadge
          label={order.delivery_status}
          color={deliveryColor}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.date}>
          {new Date(order.created_at).toDateString()}
        </Text>

        {order.assigned_rider_phone && (
          <View style={styles.rider}>
            <Feather
              name="truck"
              size={14}
              color="#2563EB"
            />
            <Text style={styles.riderText}>
              {order.assigned_rider_phone}
            </Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderNo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  address: {
    color: '#334155',
    fontSize: 13,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  date: {
    fontSize: 12,
    color: '#64748B',
  },
  rider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  riderText: {
    fontSize: 12,
    color: '#2563EB',
  },
});
