import { Pressable, Text, View } from 'react-native';
import { Order } from '../types';

interface Props {
  order: Order;
  onPress: () => void;
}

export default function OrderCard({ order, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: '600' }}>#{order.orderNo}</Text>
        <Text>{order.status}</Text>
      </View>

      <Text style={{ marginTop: 6 }}>Items: {order.cart.cartItems.length}</Text>

      <Text>Total: ₹{order.total_amount}</Text>

      <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
        {new Date(order.created_at).toLocaleString()}
      </Text>

      <Text style={{ fontSize: 12, color: '#666' }}>
        {order.address.label} • {order.address.pincode}
      </Text>
    </Pressable>
  );
}
